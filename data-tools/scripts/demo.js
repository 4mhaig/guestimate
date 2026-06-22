// =============================================================
// DEMO — prueba el motor de cálculo sin necesidad de nada más
// =============================================================
// Ejecuta:  npm run demo
// =============================================================

import { calculateEvent } from '../src/portions/engine.js';
import { calculateRural, standardMealsConfig } from '../src/portions/casaRural.js';

function printItems(title, result) {
  console.log(`\n=== ${title} ===`);
  for (const [product, qty] of Object.entries(result.items)) {
    const unit = /bebida|lacteos|leche|agua/.test(product) ? 'ml' : 'g';
    console.log(`  ${product.padEnd(22)} ${qty} ${unit}`);
  }
  if (result.extras) {
    console.log('  -- extras de grupo --');
    for (const [k, v] of Object.entries(result.extras)) {
      console.log(`  ${k.padEnd(22)} ${v}`);
    }
  }
  if (result.notes?.length) {
    console.log('  -- notas --');
    result.notes.forEach((n) => console.log(`  • ${n}`));
  }
}

// Ejemplo 1: barbacoa para 10 personas
printItems(
  'Barbacoa · 4 hombres, 3 mujeres, 1 adolescente, 2 niños',
  calculateEvent({
    type: 'barbacoa',
    people: { hombre: 4, mujer: 3, adolescente: 1, nino: 2 },
    restrictions: [],
  })
);

// Ejemplo 2: cumpleaños con un celíaco y sin alcohol
printItems(
  'Cumpleaños · 6 adultos, 4 niños · celíaco + sin alcohol',
  calculateEvent({
    type: 'cumpleanos',
    people: { hombre: 3, mujer: 3, adolescente: 0, nino: 4 },
    restrictions: ['celiaco', 'sin_alcohol'],
  })
);

// Ejemplo 3: casa rural 3 días, 8 personas (config estándar)
printItems(
  'Casa rural · 3 días · 8 personas (config estándar)',
  calculateRural({
    days: 3,
    people: { hombre: 4, mujer: 4, adolescente: 0, nino: 0 },
    restrictions: [],
    meals_config: standardMealsConfig(3),
  })
);

console.log('\n✅ Demo completada.\n');
