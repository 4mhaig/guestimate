// Tests del motor de cálculo. Se ejecutan con:  npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateEvent } from '../src/portions/engine.js';
import { calculateRural, standardMealsConfig } from '../src/portions/casaRural.js';

test('barbacoa aplica el multiplicador de carne (x1.3)', () => {
  const { items } = calculateEvent({
    type: 'barbacoa',
    people: { hombre: 1, mujer: 0, adolescente: 0, nino: 0 },
  });
  // 1 hombre = 350g base * 1.3 = 455g
  assert.equal(items.carne, 455);
});

test('comida familiar usa porciones base sin multiplicar', () => {
  const { items } = calculateEvent({
    type: 'comida_familiar',
    people: { hombre: 2, mujer: 0, adolescente: 0, nino: 0 },
  });
  assert.equal(items.carne, 700); // 350 * 2
});

test('vegano sustituye carne por proteína vegetal', () => {
  const { items } = calculateEvent({
    type: 'comida_familiar',
    people: { hombre: 1, mujer: 0, adolescente: 0, nino: 0 },
    restrictions: ['vegano'],
  });
  assert.ok(!items.carne, 'no debe haber carne');
  assert.ok(items.proteina_vegetal > 0, 'debe haber proteína vegetal');
});

test('sin_alcohol elimina la bebida alcohólica', () => {
  const { items } = calculateEvent({
    type: 'cena_amigos',
    people: { hombre: 2, mujer: 2, adolescente: 0, nino: 0 },
    restrictions: ['sin_alcohol'],
  });
  assert.ok(!items.bebida_con_alcohol);
  assert.ok(items.bebida_sin_alcohol > 0);
});

test('acepta lista de personas [{age, sex}]', () => {
  const { people } = calculateEvent({
    type: 'comida_familiar',
    people: [
      { age: 35, sex: 'M' },
      { age: 32, sex: 'F' },
      { age: 8, sex: 'F' },
      { age: 15, sex: 'M' },
    ],
  });
  assert.deepEqual(people, { hombre: 1, mujer: 1, adolescente: 1, nino: 1 });
});

test('tipo casa_rural lanza error en el motor estándar', () => {
  assert.throws(() => calculateEvent({ type: 'casa_rural', people: {} }));
});

test('casa rural suma varias comidas y días', () => {
  const { items, meals, extras } = calculateRural({
    days: 3,
    people: { hombre: 4, mujer: 4, adolescente: 0, nino: 0 },
    meals_config: standardMealsConfig(3),
  });
  // Config estándar de 3 días: desayuno días 2-3, comida días 2-3,
  // merienda 3 días, cena días 1-2.
  assert.equal(meals.desayuno, 2);
  assert.equal(meals.comida, 2);
  assert.equal(meals.merienda, 3);
  assert.equal(meals.cena, 2);
  assert.ok(items.proteina > 0);
  assert.ok(extras.aceite_L >= 1);
});

test('standardMealsConfig desactiva primera y última comida', () => {
  const cfg = standardMealsConfig(2);
  assert.equal(cfg[0].breakfast, false); // día 1 sin desayuno
  assert.equal(cfg[0].lunch, false);     // día 1 sin comida
  assert.equal(cfg[1].dinner, false);    // último día sin cena
});
