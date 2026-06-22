// =============================================================
// MOTOR DE CÁLCULO — eventos estándar
// =============================================================
// Calcula las cantidades de cada producto para un evento de una
// sola comida (barbacoa, comida familiar, cumpleaños, cena de
// amigos, nochebuena).
//
// Para "casa rural" hay lógica aparte en ./casaRural.js
// =============================================================

import {
  BASE_PORTIONS,
  EVENT_MULTIPLIERS,
  PROFILES,
} from './data.js';

// Convierte el desglose de personas del formulario en un objeto
// con el recuento por perfil. Acepta el formato del briefing:
//   { hombre: 4, mujer: 3, adolescente: 1, nino: 2 }
function normalizePeople(people) {
  const counts = { hombre: 0, mujer: 0, adolescente: 0, nino: 0 };

  // Formato 1: ya viene como recuento por perfil
  if (!Array.isArray(people)) {
    for (const p of PROFILES) {
      counts[p] = Number(people[p]) || 0;
    }
    return counts;
  }

  // Formato 2: lista de personas [{age, sex}] (como en la tabla `events`)
  for (const person of people) {
    const age = Number(person.age);
    const sex = (person.sex || '').toUpperCase();
    if (age <= 12) counts.nino += 1;
    else if (age <= 17) counts.adolescente += 1;
    else if (sex === 'F') counts.mujer += 1;
    else counts.hombre += 1; // por defecto adulto hombre si no se indica sexo
  }
  return counts;
}

// Aplica las restricciones alimentarias al resultado.
function applyRestrictions(items, restrictions) {
  const set = new Set(restrictions || []);
  const notes = [];

  // Sin alcohol: eliminamos la bebida alcohólica
  if (set.has('sin_alcohol')) {
    delete items.bebida_con_alcohol;
  }

  // Vegano / vegetariano: la carne pasa a "proteína vegetal"
  if (set.has('vegano') || set.has('vegetariano')) {
    if (items.carne) {
      items.proteina_vegetal = items.carne;
      delete items.carne;
      notes.push('Carne sustituida por proteína vegetal (legumbres, tofu, seitán...).');
    }
    if (set.has('vegano')) {
      notes.push('Vegano: evita lácteos y huevo en postres y guarniciones.');
    }
  }

  if (set.has('celiaco')) {
    notes.push('Hay celíacos: el pan y la guarnición deben ser SIN GLUTEN.');
  }
  if (set.has('intolerante_lactosa')) {
    notes.push('Hay intolerantes a la lactosa: usa lácteos/postres sin lactosa.');
  }
  if (set.has('alergico_frutos_secos')) {
    notes.push('ALERGIA a frutos secos: revisa etiquetas de postres y snacks.');
  }
  if (set.has('alergico_marisco')) {
    notes.push('ALERGIA al marisco: evita platos con marisco.');
  }
  if (set.has('sin_cerdo')) {
    notes.push('Sin cerdo: elige carnes de ternera, pollo o pavo.');
  }

  return notes;
}

/**
 * Calcula la lista de cantidades para un evento estándar.
 *
 * @param {Object} event
 * @param {string} event.type - barbacoa | comida_familiar | cumpleanos | cena_amigos | nochebuena
 * @param {Object|Array} event.people - { hombre, mujer, adolescente, nino } o [{age, sex}]
 * @param {string[]} [event.restrictions] - ver RESTRICTIONS en data.js
 * @returns {{ items: Object, notes: string[], people: Object }}
 */
export function calculateEvent(event) {
  const { type, people, restrictions } = event;

  if (!EVENT_MULTIPLIERS[type]) {
    throw new Error(
      `Tipo de evento no soportado por este motor: "${type}". ` +
      `Para "casa_rural" usa calculateRural() de ./casaRural.js`
    );
  }

  const counts = normalizePeople(people);
  const multipliers = EVENT_MULTIPLIERS[type];
  const items = {};

  // Para cada producto, sumamos la porción de cada perfil presente.
  for (const [product, byProfile] of Object.entries(BASE_PORTIONS)) {
    let total = 0;
    for (const profile of PROFILES) {
      total += (byProfile[profile] || 0) * counts[profile];
    }
    const mult = multipliers[product] ?? 1;
    total = total * mult;
    if (total > 0) {
      items[product] = Math.round(total);
    }
  }

  const notes = applyRestrictions(items, restrictions);

  return { items, notes, people: counts };
}
