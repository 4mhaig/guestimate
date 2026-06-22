// =============================================================
// PRODUCTOS CONCRETOS + PRECIO
// =============================================================
// Convierte las cantidades genéricas de la cesta (p.ej. "3 kg de
// carne") en productos reales de Mercadona con precio, repartiendo
// con variedad (chorizo + panceta + pollo...) y ofreciendo 2-3
// opciones a elegir por cada necesidad.
// =============================================================

import { CATALOG, BASICS, type ProductOption } from "./catalog";
import { CATEGORY_META, type Category, type EventType, type Item } from "./guestimate";

export type ResolvedLine = {
  key: string; // clave estable para guardar la elección del usuario
  slotLabel: string; // "Pollo", "Chorizo y salchichas"...
  option: ProductOption; // producto elegido
  alternatives: ProductOption[]; // opciones para cambiar
  amount: number; // cantidad en unidad base (kg/L/ud)
  amountLabel: string; // "≈ 1,2 kg"
  cost: number; // € aproximado
};

export type ResolvedGroup = {
  category: Category;
  label: string;
  icon: string;
  lines: ResolvedLine[];
  cost: number;
};

export type ResolvedBasket = { groups: ResolvedGroup[]; total: number };

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// Usa el catálogo específico del evento si existe (p.ej. "carne:nochebuena"),
// y si no, el genérico de la categoría.
function catalogKey(category: Category, event: EventType | null): string {
  if (event && CATALOG[`${category}:${event}`]) return `${category}:${event}`;
  return category;
}

function fmtAmount(amount: number, unit: string): string {
  if (unit === "kg") {
    return amount >= 1 ? `≈ ${amount.toFixed(1)} kg` : `≈ ${Math.round(amount * 1000)} g`;
  }
  if (unit === "L") {
    return amount >= 1 ? `≈ ${amount.toFixed(1)} L` : `≈ ${Math.round(amount * 1000)} ml`;
  }
  return `${Math.round(amount)} ud`;
}

export type ResolveOptions = {
  /** Elección de opción por línea (clave → índice). */
  choices?: Record<string, number>;
  /** Claves de línea que el usuario ha eliminado de la cesta. */
  removed?: Set<string>;
  /** Ids de bebidas a incluir (agua, cola, naranja_limon, zumo, cerveza, vino).
   *  Si es undefined se incluyen todas. */
  drinks?: Set<string>;
};

// Ids de los "slots" de bebida del catálogo, para la selección de bebidas.
export const DRINK_SLOTS = {
  bebida_sin: ["agua", "cola", "naranja_limon", "zumo"],
  bebida_con: ["cerveza", "vino"],
};

/**
 * Calcula la cesta con productos concretos y precio aproximado.
 */
export function resolveBasket(
  items: Item[],
  event: EventType | null,
  opts: ResolveOptions = {},
): ResolvedBasket {
  const choices = opts.choices ?? {};
  const removed = opts.removed ?? new Set<string>();
  const drinks = opts.drinks;
  const groups = new Map<Category, ResolvedGroup>();
  const ensureGroup = (cat: Category): ResolvedGroup => {
    let g = groups.get(cat);
    if (!g) {
      const meta = CATEGORY_META[cat];
      g = { category: cat, label: meta.label, icon: meta.icon, lines: [], cost: 0 };
      groups.set(cat, g);
    }
    return g;
  };

  for (const item of items) {
    // Básicos de grupo (casa rural): aceite, sal, café, papel...
    if (item.category === "otros") {
      if (removed.has(item.id)) continue;
      const basic = BASICS[item.id];
      const g = ensureGroup("otros");
      const units = Math.max(1, Math.round(item.qty));
      const option: ProductOption = basic
        ? { id: item.id, name: basic.name, price: basic.price, unit: "ud", packPrice: basic.price, image: basic.image }
        : { id: item.id, name: item.name, price: 0, unit: "ud", packPrice: null, image: null };
      g.lines.push({
        key: item.id,
        slotLabel: item.name,
        option,
        alternatives: [option],
        amount: units,
        amountLabel: `${units} ud`,
        cost: round2((basic?.price ?? 0) * units),
      });
      continue;
    }

    const key = catalogKey(item.category, event);
    const slots = CATALOG[key] ?? CATALOG[item.category];
    const g = ensureGroup(item.category);

    if (!slots || slots.length === 0) {
      // Sin catálogo: mostramos genérico sin precio
      if (removed.has(item.id)) continue;
      g.lines.push({
        key: item.id,
        slotLabel: item.name,
        option: { id: item.id, name: item.name, price: 0, unit: "", packPrice: null, image: null },
        alternatives: [],
        amount: 0,
        amountLabel: "",
        cost: 0,
      });
      continue;
    }

    // Filtro de bebidas: si el usuario eligió qué bebidas quiere, nos quedamos
    // solo con esos slots y repartimos su cantidad entre los elegidos.
    let useSlots = slots;
    if (drinks && (item.category === "bebida_sin" || item.category === "bebida_con")) {
      const kept = slots.filter((s) => drinks.has(s.id));
      const shareSum = kept.reduce((sum, s) => sum + s.share, 0) || 1;
      useSlots = kept.map((s) => ({ ...s, share: s.share / shareSum }));
    }

    for (const slot of useSlots) {
      if (!slot.options.length) continue;
      const lineKey = `${item.category}:${slot.id}`;
      if (removed.has(lineKey)) continue;
      const slotQty = item.qty * slot.share; // en g/ml/u
      const amount = item.unit === "u" ? slotQty : slotQty / 1000; // → kg/L
      const idx = Math.min(Math.max(0, choices[lineKey] ?? 0), slot.options.length - 1);
      const option = slot.options[idx];
      g.lines.push({
        key: lineKey,
        slotLabel: slot.label,
        option,
        alternatives: slot.options,
        amount,
        amountLabel: fmtAmount(amount, option.unit),
        cost: round2(option.price * amount),
      });
    }
  }

  const list = [...groups.values()].filter((g) => g.lines.length > 0);
  list.forEach((g) => (g.cost = round2(g.lines.reduce((s, l) => s + l.cost, 0))));
  const total = round2(list.reduce((s, g) => s + g.cost, 0));
  return { groups: list, total };
}

export function formatEuro(n: number): string {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}
