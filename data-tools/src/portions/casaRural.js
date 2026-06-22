// =============================================================
// MOTOR DE CÁLCULO — Casa rural / viaje en grupo
// =============================================================
// A diferencia del resto de eventos, una casa rural NO es una sola
// comida sino varias comidas a lo largo de varios días. El usuario
// activa/desactiva cada comida (desayuno, comida, merienda, cena)
// día a día, y aquí sumamos todo.
// =============================================================

import {
  RURAL_MEAL_PORTIONS,
  RURAL_MEAL_MULTIPLIERS,
} from './data.js';

// Cuenta total de personas a partir del desglose por perfil o lista.
function totalPeople(people) {
  if (Array.isArray(people)) return people.length;
  return Object.values(people).reduce((a, b) => a + (Number(b) || 0), 0);
}

// Configuración estándar sugerida: todo activado EXCEPTO el desayuno
// y la comida del primer día (llegas a mediodía) y la cena del último
// (te vas por la tarde).
export function standardMealsConfig(days) {
  const config = [];
  for (let day = 1; day <= days; day++) {
    config.push({
      day,
      breakfast: day !== 1,
      lunch: day !== 1,
      snack: true,
      dinner: day !== days,
    });
  }
  return config;
}

/**
 * Calcula la lista de la compra para una casa rural.
 *
 * @param {Object} event
 * @param {number} event.days - número de días del viaje
 * @param {Object|Array} event.people - { hombre, mujer, ... } o [{age, sex}]
 * @param {string[]} [event.restrictions]
 * @param {Array} [event.meals_config] - [{day, breakfast, lunch, snack, dinner}]
 *        Si no se pasa, se usa standardMealsConfig(days).
 * @returns {{ items: Object, notes: string[], extras: Object, meals: Object }}
 */
export function calculateRural(event) {
  const { days, people, restrictions } = event;
  const persons = totalPeople(people);
  const mealsConfig = event.meals_config || standardMealsConfig(days);

  // Mapa de la clave del formulario (inglés) -> clave de porciones (español)
  const mealKeyMap = {
    breakfast: 'desayuno',
    lunch: 'comida',
    snack: 'merienda',
    dinner: 'cena',
  };

  const items = {};
  const mealsCount = { desayuno: 0, comida: 0, merienda: 0, cena: 0 };

  for (const dayCfg of mealsConfig) {
    for (const [formKey, mealKey] of Object.entries(mealKeyMap)) {
      if (!dayCfg[formKey]) continue;
      mealsCount[mealKey] += 1;

      const portions = RURAL_MEAL_PORTIONS[mealKey];
      const mult = RURAL_MEAL_MULTIPLIERS[mealKey] ?? 1;

      for (const [product, perPerson] of Object.entries(portions)) {
        const add = perPerson * persons * mult;
        items[product] = (items[product] || 0) + add;
      }
    }
  }

  // Redondeamos al final
  for (const key of Object.keys(items)) {
    items[key] = Math.round(items[key]);
  }

  // Si nadie bebe alcohol, fuera la bebida alcohólica
  if ((restrictions || []).includes('sin_alcohol')) {
    delete items.bebida_con_alcohol;
  }

  const extras = calculateGroupExtras(persons, days);
  const notes = ruralNotes(restrictions, persons, days);

  return { items, notes, extras, meals: mealsCount, people: persons };
}

// Extras que se compran "para el grupo" y escalan más por días que
// por persona (aceite, sal, papel de cocina, café, etc.).
function calculateGroupExtras(persons, days) {
  return {
    aceite_L: Math.max(1, Math.ceil((persons * days) / 30)),
    sal_pack: 1,
    especias_pack: 1,
    papel_cocina_rollos: Math.max(2, Math.ceil(days * 1.5)),
    bolsas_basura_pack: 1,
    azucar_kg: 1,
    cafe_ud: Math.ceil(persons * days * 0.5),
    condimentos_pack: 1, // ketchup, mayonesa, mostaza
  };
}

function ruralNotes(restrictions, persons, days) {
  const set = new Set(restrictions || []);
  const notes = [
    `Viaje de ${days} día(s) para ${persons} persona(s).`,
    'Recuerda incluir los extras de grupo (aceite, sal, papel de cocina...).',
  ];
  if (set.has('celiaco')) notes.push('Hay celíacos: pan, pasta y cereales SIN GLUTEN.');
  if (set.has('intolerante_lactosa')) notes.push('Lácteos sin lactosa.');
  if (set.has('vegano') || set.has('vegetariano')) {
    notes.push('Sustituye la proteína animal por opciones veggie.');
  }
  if (set.has('sin_alcohol')) notes.push('Sin alcohol: elimina cerveza/vino de la lista.');
  return notes;
}
