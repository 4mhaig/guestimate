// =============================================================
// DATOS DE PORCIONES — Guestimate
// =============================================================
// Aquí viven todas las "tablas" de referencia: cuánto come una
// persona, los multiplicadores por tipo de evento, etc.
//
// Si en el futuro quieres afinar las cantidades, este es el único
// archivo que tienes que tocar. Está separado del cálculo a
// propósito para que sea fácil de ajustar sin tocar la lógica.
// =============================================================

// Perfiles de persona que manejamos
export const PROFILES = ['hombre', 'mujer', 'adolescente', 'nino'];

// -------------------------------------------------------------
// Porciones base por persona, para UNA comida completa (en gramos
// o mililitros). Fuente: briefing del proyecto.
// -------------------------------------------------------------
export const BASE_PORTIONS = {
  carne:               { hombre: 350, mujer: 250, adolescente: 300, nino: 150 }, // g
  pan:                 { hombre: 100, mujer: 80,  adolescente: 100, nino: 60 },  // g
  ensalada:            { hombre: 150, mujer: 180, adolescente: 120, nino: 80 },  // g
  guarnicion:          { hombre: 200, mujer: 150, adolescente: 200, nino: 120 }, // g (patatas, etc.)
  postre:              { hombre: 150, mujer: 150, adolescente: 150, nino: 150 }, // g
  bebida_sin_alcohol:  { hombre: 500, mujer: 500, adolescente: 500, nino: 500 }, // ml
  bebida_con_alcohol:  { hombre: 500, mujer: 350, adolescente: 0,   nino: 0 },   // ml
};

// -------------------------------------------------------------
// Multiplicadores por tipo de evento.
// Solo se listan los productos que cambian; el resto se queda en x1.
// -------------------------------------------------------------
export const EVENT_MULTIPLIERS = {
  barbacoa: {
    carne: 1.3,
    bebida_sin_alcohol: 1.4,
    bebida_con_alcohol: 1.4,
    pan: 1.2,
  },
  nochebuena: {
    // "entrantes" lo mapeamos a ensalada/guarnición de aperitivo
    ensalada: 1.5,
    guarnicion: 1.5,
    postre: 1.8,
    bebida_sin_alcohol: 1.3,
    bebida_con_alcohol: 1.3,
  },
  cumpleanos: {
    postre: 2.0, // la tarta
    bebida_sin_alcohol: 1.2,
    bebida_con_alcohol: 1.2,
  },
  cena_amigos: {
    // cenas más ligeras: todo x0.85
    carne: 0.85,
    pan: 0.85,
    ensalada: 0.85,
    guarnicion: 0.85,
    postre: 0.85,
    bebida_sin_alcohol: 0.85,
    bebida_con_alcohol: 0.85,
  },
  comida_familiar: {}, // base x1.0
};

// -------------------------------------------------------------
// Restricciones alimentarias y cómo afectan al cálculo.
// =============================================================
export const RESTRICTIONS = [
  'celiaco',
  'intolerante_lactosa',
  'vegano',
  'vegetariano',
  'alergico_frutos_secos',
  'alergico_marisco',
  'sin_cerdo',
  'sin_alcohol',
];

// =============================================================
// CASA RURAL — porciones por tipo de comida (g o ml por persona)
// =============================================================
export const RURAL_MEAL_PORTIONS = {
  desayuno: {
    pan: 80,
    lacteos: 250,
    embutido_queso: 50,
    fruta: 150,
    bebida_sin_alcohol: 300,
    cafe_infusion: 1, // unidades
  },
  comida: {
    pan: 80,
    embutido_queso: 80,
    fruta: 150,
    proteina: 300,
    verdura: 180,
    guarnicion: 150, // pasta/arroz/patata
    postre: 120,
    bebida_sin_alcohol: 500,
    bebida_con_alcohol: 300,
  },
  merienda: {
    pan: 60,
    lacteos: 200,
    embutido_queso: 60,
    fruta: 150,
    bebida_sin_alcohol: 300,
    cafe_infusion: 1,
    snacks: 60,
  },
  cena: {
    pan: 60,
    embutido_queso: 80,
    proteina: 250,
    verdura: 150,
    guarnicion: 120,
    postre: 100,
    bebida_sin_alcohol: 500,
    bebida_con_alcohol: 500,
    cafe_infusion: 1,
    snacks: 80,
  },
};

// Multiplicadores por tipo de comida en casa rural
export const RURAL_MEAL_MULTIPLIERS = {
  desayuno: 1.1, // se desayuna más fuerte en vacaciones
  comida: 1.0,
  merienda: 1.0,
  cena: 0.9, // se cena más ligero
};

// Extras de grupo para casa rural (no escalan por persona de la
// misma forma: son "packs" para todo el grupo / por días).
// Se calculan en src/portions/casaRural.js
export const RURAL_GROUP_EXTRAS = [
  'aceite',
  'sal',
  'especias',
  'papel_cocina',
  'bolsas_basura',
  'azucar',
  'condimentos',
];
