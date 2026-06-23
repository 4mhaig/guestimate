// =============================================================
// PRODUCTOS CONCRETOS + PRECIO
// =============================================================
// Convierte las cantidades genéricas de la cesta (p.ej. "3 kg de
// carne") en productos reales de Mercadona con precio, repartiendo
// con variedad (chorizo + panceta + pollo...) y ofreciendo 2-3
// opciones a elegir por cada necesidad.
// =============================================================

import { CATALOG, SPECIAL, BASICS, type ProductOption } from "./catalog";
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

// Usa el catálogo específico del evento/variante si existe (p.ej.
// "carne:nochebuena" o "carne:rural_easy"), y si no, el genérico.
function catalogKey(category: Category, key: string | null): string {
  if (key && CATALOG[`${category}:${key}`]) return `${category}:${key}`;
  return category;
}

// Mapea un id de producto especial (sub_...) a su tipo en SPECIAL.
function specialKind(id: string): string | null {
  if (id.endsWith("_sg")) return "sin_gluten";
  if (id === "sub_legumbres") return "legumbres";
  if (id === "sub_bebida_vegetal") return "bebida_vegetal";
  if (id === "sub_embutido_veg") return "embutido_veg";
  if (id === "sub_lacteos_sl") return "lacteos_sl";
  if (id === "sub_embutido_pavo") return "embutido_pavo";
  return null;
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
  /** Precios en vivo desde Supabase (nombre de producto → precio de referencia).
   *  Si un producto está aquí, se usa este precio en vez del del catálogo. */
  prices?: Record<string, number>;
};

// Devuelve la opción con el precio en vivo si lo tenemos en Supabase.
function withLivePrice(o: ProductOption, prices?: Record<string, number>): ProductOption {
  const live = prices?.[o.name];
  return live != null && live > 0 ? { ...o, price: live } : o;
}

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
  const prices = opts.prices;
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
    // Productos especiales por restricción (sin gluten, legumbres, sin lactosa...).
    if (item.id.startsWith("sub_")) {
      if (removed.has(item.id)) continue;
      const g = ensureGroup(item.category);
      const amount = item.unit === "u" ? item.qty : item.qty / 1000;
      const unit = item.unit === "g" ? "kg" : item.unit === "ml" ? "L" : "ud";
      const kind = specialKind(item.id);
      const options = (kind && SPECIAL[kind]) || [];
      if (options.length) {
        const alternatives = options.map((o) => withLivePrice(o, prices));
        const idx = Math.min(Math.max(0, choices[item.id] ?? 0), alternatives.length - 1);
        const option = alternatives[idx];
        g.lines.push({
          key: item.id,
          slotLabel: item.name,
          option,
          alternatives,
          amount,
          amountLabel: fmtAmount(amount, option.unit),
          cost: round2(option.price * amount),
        });
      } else {
        g.lines.push({
          key: item.id,
          slotLabel: item.name,
          option: { id: item.id, name: item.name, price: 0, unit, packPrice: null, image: null },
          alternatives: [],
          amount,
          amountLabel: fmtAmount(amount, unit),
          cost: 0,
        });
      }
      continue;
    }

    // Básicos de grupo (casa rural): aceite, sal, café, papel...
    if (item.category === "otros") {
      if (removed.has(item.id)) continue;
      const basic = BASICS[item.id];
      const g = ensureGroup("otros");
      const units = Math.max(1, Math.round(item.qty));
      const basicPrice = basic ? prices?.[basic.name] ?? basic.price : 0;
      const option: ProductOption = basic
        ? { id: item.id, name: basic.name, price: basicPrice, unit: "ud", packPrice: basicPrice, image: basic.image }
        : { id: item.id, name: item.name, price: 0, unit: "ud", packPrice: null, image: null };
      g.lines.push({
        key: item.id,
        slotLabel: item.name,
        option,
        alternatives: [option],
        amount: units,
        amountLabel: `${units} ud`,
        cost: round2(basicPrice * units),
      });
      continue;
    }

    const key = catalogKey(item.category, item.variant ?? item.event ?? event);
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
      const alternatives = slot.options.map((o) => withLivePrice(o, prices));
      const idx = Math.min(Math.max(0, choices[lineKey] ?? 0), alternatives.length - 1);
      const option = alternatives[idx];
      // Un slot puede ir a otra categoría (p.ej. el queso de "cena de amigos" → embutido).
      const target = ensureGroup((slot.cat as Category) ?? item.category);
      target.lines.push({
        key: lineKey,
        slotLabel: slot.label,
        option,
        alternatives,
        amount,
        amountLabel: fmtAmount(amount, option.unit),
        cost: round2(option.price * amount),
      });
    }
  }

  const list = [...groups.values()].filter((g) => g.lines.length > 0);
  // Fusionar líneas que apuntan al MISMO producto concreto (p.ej. una barbacoa
  // dentro de una casa rural que repite "jamoncitos"): se suman cantidad y precio.
  for (const g of list) {
    const byId = new Map<string, ResolvedLine>();
    const order: string[] = [];
    for (const line of g.lines) {
      const existing = byId.get(line.option.id);
      if (existing) {
        existing.amount += line.amount;
        existing.cost = round2(existing.cost + line.cost);
        existing.amountLabel = fmtAmount(existing.amount, existing.option.unit);
      } else {
        byId.set(line.option.id, { ...line });
        order.push(line.option.id);
      }
    }
    g.lines = order.map((id) => byId.get(id)!);
  }
  list.forEach((g) => (g.cost = round2(g.lines.reduce((s, l) => s + l.cost, 0))));
  const total = round2(list.reduce((s, g) => s + g.cost, 0));
  return { groups: list, total };
}

export function formatEuro(n: number): string {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

// =============================================================
// Emparejar texto libre de la IA con un producto real del catálogo
// =============================================================
// La IA propone nombres en lenguaje natural ("Lubina fresca"). Aquí
// buscamos el producto real más parecido del catálogo de Mercadona
// para poder ponerle un precio de verdad (y unidad correcta).

let _allOptions: ProductOption[] | null = null;
function allCatalogOptions(): ProductOption[] {
  if (_allOptions) return _allOptions;
  const seen = new Set<string>();
  const out: ProductOption[] = [];
  for (const slots of Object.values(CATALOG)) {
    for (const slot of slots) {
      for (const o of slot.options) {
        if (seen.has(o.id)) continue;
        seen.add(o.id);
        out.push(o);
      }
    }
  }
  _allOptions = out;
  return out;
}

const STOPWORDS = new Set([
  "de", "del", "la", "el", "los", "las", "y", "con", "sin", "al",
  "fresco", "fresca", "frescos", "frescas", "natural", "naturales",
]);

const COMBINING = /[̀-ͯ]/g;
function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(COMBINING, "");
}

function wordTokens(s: string): string[] {
  return normalize(s)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

/** Busca el producto real del catálogo que mejor encaja con el nombre
 *  libre que ha propuesto la IA. Devuelve null si no hay nada parecido. */
export function findCatalogMatch(name: string, prices?: Record<string, number>): ProductOption | null {
  const want = wordTokens(name);
  if (!want.length) return null;
  // La 1ª palabra suele ser el sustantivo principal ("Salmón ahumado",
  // "Lubina fresca"). La exigimos para evitar coincidencias por palabras
  // sueltas y secundarias ("ahumado" → salchichas ahumadas).
  const primary = want[0];
  let best: ProductOption | null = null;
  let bestScore = 0;
  for (const o of allCatalogOptions()) {
    const have = new Set(wordTokens(o.name));
    if (!have.has(primary)) continue;
    let score = 0;
    for (const w of want) if (have.has(w)) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = o;
    }
  }
  if (!best || bestScore === 0) return null;
  return withLivePrice(best, prices);
}

function unitFamily(u: string): "weight" | "volume" | "count" {
  const n = normalize(u);
  if (["g", "gr", "kg", "kilo", "kilos"].includes(n)) return "weight";
  if (["ml", "cl", "l", "litro", "litros"].includes(n)) return "volume";
  return "count";
}

/** Interpreta una cantidad en texto de la IA ("200 g", "1 bote", "6 ud")
 *  hacia la unidad base del producto encontrado (kg / L / ud). */
export function parseAiAmount(text: string, unit: string): { amount: number; label: string } {
  const m = normalize(text || "").match(/([\d]+(?:[.,][\d]+)?)\s*([a-z]+)?/);
  let num = m ? parseFloat(m[1].replace(",", ".")) : NaN;
  if (!isFinite(num) || num <= 0) num = 1;
  const givenFamily = m && m[2] ? unitFamily(m[2]) : null;
  const targetFamily = unitFamily(unit);

  // Si la unidad de la IA es de otra familia que la del producto real
  // (p.ej. pide "200 g" pero se vende por unidad), usamos 1 para no
  // calcular un precio absurdo.
  if (givenFamily && givenFamily !== targetFamily) {
    return { amount: 1, label: fmtAmount(1, unit) };
  }
  let amount = num;
  if (unit === "kg" && m && /^(g|gr)$/.test(m[2] ?? "")) amount = num / 1000;
  else if (unit === "L" && m && (m[2] === "ml")) amount = num / 1000;
  else if (unit === "L" && m && (m[2] === "cl")) amount = num / 100;
  else if (unit === "ud") amount = Math.max(1, Math.round(num));
  return { amount, label: fmtAmount(amount, unit) };
}
