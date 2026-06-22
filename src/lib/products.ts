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

function catalogKey(category: Category, event: EventType | null): string {
  if (category === "carne" && event === "barbacoa") return "carne:barbacoa";
  if (category === "postre" && event === "cumple") return "postre:cumple";
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

/**
 * Calcula la cesta con productos concretos y precio aproximado.
 * @param choices elección de opción por línea (clave → índice). Por
 *        defecto se usa la opción 0 (la más económica).
 */
export function resolveBasket(
  items: Item[],
  event: EventType | null,
  choices: Record<string, number> = {},
): ResolvedBasket {
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

    for (const slot of slots) {
      if (!slot.options.length) continue;
      const slotQty = item.qty * slot.share; // en g/ml/u
      const amount = item.unit === "u" ? slotQty : slotQty / 1000; // → kg/L
      const lineKey = `${item.category}:${slot.id}`;
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

  const list = [...groups.values()];
  list.forEach((g) => (g.cost = round2(g.lines.reduce((s, l) => s + l.cost, 0))));
  const total = round2(list.reduce((s, g) => s + g.cost, 0));
  return { groups: list, total };
}

export function formatEuro(n: number): string {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}
