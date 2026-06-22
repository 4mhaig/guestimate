export type EventType =
  | "barbacoa"
  | "familiar"
  | "cumple"
  | "amigos"
  | "nochebuena"
  | "rural";

export type Restriction =
  | "celiaco"
  | "lactosa"
  | "vegano"
  | "vegetariano"
  | "frutos_secos"
  | "marisco"
  | "sin_cerdo"
  | "sin_alcohol"
  | "ninguna";

export type People = {
  hombres: number;
  mujeres: number;
  adolescentes: number;
  ninos: number;
};

export type Meal = "desayuno" | "comida" | "merienda" | "cena";
export type MealsConfig = Record<number, Record<Meal, boolean>>;

export type Category =
  | "carne"
  | "pan"
  | "ensalada"
  | "guarnicion"
  | "postre"
  | "bebida_sin"
  | "bebida_con"
  | "snacks"
  | "lacteos"
  | "embutido"
  | "fruta"
  | "otros";

export type Item = {
  id: string;
  name: string;
  category: Category;
  qty: number; // raw in g, ml or units
  unit: "g" | "ml" | "u";
};

export const EVENTS: {
  id: EventType;
  name: string;
  desc: string;
  icon: string;
}[] = [
  { id: "barbacoa", name: "Barbacoa", desc: "Carne, fuego y buena compañía", icon: "Flame" },
  { id: "familiar", name: "Comida familiar", desc: "Para celebrar en casa", icon: "Home" },
  { id: "cumple", name: "Cumpleaños", desc: "Que no falte la tarta", icon: "Cake" },
  { id: "amigos", name: "Cena de amigos", desc: "Una noche para recordar", icon: "Wine" },
  { id: "nochebuena", name: "Nochebuena / Navidad", desc: "La mesa más especial del año", icon: "TreePine" },
  { id: "rural", name: "Casa rural", desc: "Un viaje con todo incluido", icon: "Tent" },
];

export const RESTRICTIONS: { id: Restriction; label: string; note: string }[] = [
  { id: "celiaco", label: "Celíaco / Sin gluten", note: "Hemos sustituido pan y pasta por versiones sin gluten." },
  { id: "lactosa", label: "Intolerante a la lactosa", note: "Los lácteos serán sin lactosa." },
  { id: "vegano", label: "Vegano", note: "Hemos sustituido carne y lácteos por legumbres, tofu y bebidas vegetales." },
  { id: "vegetariano", label: "Vegetariano", note: "Hemos sustituido la carne por legumbres y tofu." },
  { id: "frutos_secos", label: "Alérgico a frutos secos", note: "Evita postres y snacks con frutos secos." },
  { id: "marisco", label: "Alérgico al marisco", note: "Evita platos con marisco." },
  { id: "sin_cerdo", label: "Sin cerdo", note: "Evita embutidos y carne de cerdo." },
  { id: "sin_alcohol", label: "Sin alcohol", note: "Hemos retirado las bebidas alcohólicas." },
  { id: "ninguna", label: "Sin restricciones", note: "" },
];

export const CATEGORY_META: Record<Category, { label: string; icon: string }> = {
  carne: { label: "Carne y proteína", icon: "Beef" },
  pan: { label: "Pan y cereales", icon: "Croissant" },
  ensalada: { label: "Verdura y ensalada", icon: "Salad" },
  guarnicion: { label: "Guarniciones", icon: "ShoppingBasket" },
  postre: { label: "Postres y dulces", icon: "CakeSlice" },
  bebida_sin: { label: "Bebidas sin alcohol", icon: "Milk" },
  bebida_con: { label: "Bebidas con alcohol", icon: "Beer" },
  snacks: { label: "Aperitivos y snacks", icon: "Cookie" },
  lacteos: { label: "Lácteos", icon: "Milk" },
  embutido: { label: "Embutidos y queso", icon: "Beef" },
  fruta: { label: "Fruta", icon: "Salad" },
  otros: { label: "Básicos y otros", icon: "ShoppingBasket" },
};

export function totalPeople(p: People) {
  return p.hombres + p.mujeres + p.adolescentes + p.ninos;
}

function adultUnits(p: People) {
  return p.hombres * 1 + p.mujeres * 0.75 + p.adolescentes * 0.85 + p.ninos * 0.45;
}

type Portion = { id: string; name: string; category: Category; per: number; unit: "g" | "ml" | "u" };

const BASE_MEAL: Portion[] = [
  { id: "carne", name: "Carne / proteína", category: "carne", per: 350, unit: "g" },
  { id: "pan", name: "Pan", category: "pan", per: 100, unit: "g" },
  { id: "ensalada", name: "Ensalada / verdura", category: "ensalada", per: 150, unit: "g" },
  { id: "guarnicion", name: "Guarnición", category: "guarnicion", per: 200, unit: "g" },
  { id: "postre", name: "Postre", category: "postre", per: 150, unit: "g" },
  { id: "bebida_sin", name: "Bebida sin alcohol", category: "bebida_sin", per: 500, unit: "ml" },
  { id: "bebida_con", name: "Bebida con alcohol", category: "bebida_con", per: 500, unit: "ml" },
  { id: "snacks", name: "Aperitivos / snacks", category: "snacks", per: 80, unit: "g" },
];

const RURAL_MEALS: Record<Meal, Portion[]> = {
  desayuno: [
    { id: "pan", name: "Pan y bollería", category: "pan", per: 80, unit: "g" },
    { id: "lacteos", name: "Leche / yogur", category: "lacteos", per: 250, unit: "ml" },
    { id: "embutido_queso", name: "Embutido y queso", category: "embutido", per: 50, unit: "g" },
    { id: "fruta", name: "Fruta", category: "fruta", per: 150, unit: "g" },
    { id: "bebida_sin", name: "Bebida (agua, refresco, zumo)", category: "bebida_sin", per: 300, unit: "ml" },
  ],
  comida: [
    { id: "carne", name: "Carne / proteína", category: "carne", per: 300, unit: "g" },
    { id: "ensalada", name: "Verdura", category: "ensalada", per: 180, unit: "g" },
    { id: "guarnicion", name: "Guarnición", category: "guarnicion", per: 150, unit: "g" },
    { id: "pan", name: "Pan y bollería", category: "pan", per: 80, unit: "g" },
    { id: "postre", name: "Postre", category: "postre", per: 120, unit: "g" },
    { id: "bebida_sin", name: "Bebida (agua, refresco, zumo)", category: "bebida_sin", per: 500, unit: "ml" },
  ],
  merienda: [
    { id: "pan", name: "Pan y bollería", category: "pan", per: 60, unit: "g" },
    { id: "lacteos", name: "Lácteos", category: "lacteos", per: 200, unit: "ml" },
    { id: "fruta", name: "Fruta", category: "fruta", per: 150, unit: "g" },
    { id: "snacks", name: "Snacks", category: "snacks", per: 60, unit: "g" },
    { id: "bebida_sin", name: "Bebida (agua, refresco, zumo)", category: "bebida_sin", per: 300, unit: "ml" },
  ],
  cena: [
    { id: "carne", name: "Proteína", category: "carne", per: 250, unit: "g" },
    { id: "ensalada", name: "Verdura", category: "ensalada", per: 150, unit: "g" },
    { id: "guarnicion", name: "Guarnición", category: "guarnicion", per: 120, unit: "g" },
    { id: "postre", name: "Postre", category: "postre", per: 100, unit: "g" },
    { id: "snacks", name: "Snacks", category: "snacks", per: 80, unit: "g" },
    { id: "bebida_sin", name: "Bebida (agua, refresco, zumo)", category: "bebida_sin", per: 500, unit: "ml" },
  ],
};

const RURAL_MEAL_MULT: Record<Meal, number> = {
  desayuno: 1.1,
  comida: 1.0,
  merienda: 1.0,
  cena: 0.9,
};

function eventMultiplier(event: EventType, category: Category): number {
  switch (event) {
    case "barbacoa":
      if (category === "carne") return 1.3;
      if (category === "bebida_sin" || category === "bebida_con") return 1.4;
      if (category === "pan") return 1.2;
      return 1;
    case "nochebuena":
      if (category === "ensalada" || category === "snacks") return 1.5;
      if (category === "postre") return 1.8;
      if (category === "bebida_sin" || category === "bebida_con") return 1.3;
      return 1;
    case "cumple":
      if (category === "postre") return 2.0;
      if (category === "bebida_sin" || category === "bebida_con") return 1.2;
      return 1;
    case "amigos":
      return 0.85;
    case "familiar":
      return 1;
    default:
      return 1;
  }
}

function add(map: Map<string, Item>, p: Portion, qty: number) {
  const existing = map.get(p.id);
  if (existing) existing.qty += qty;
  else map.set(p.id, { id: p.id, name: p.name, category: p.category, qty, unit: p.unit });
}

const GROUP_BASICS: Portion[] = [
  { id: "aceite", name: "Aceite de oliva", category: "otros", per: 1, unit: "u" },
  { id: "sal", name: "Sal", category: "otros", per: 1, unit: "u" },
  { id: "especias", name: "Especias", category: "otros", per: 1, unit: "u" },
  { id: "papel_cocina", name: "Papel de cocina", category: "otros", per: 2, unit: "u" },
  { id: "bolsas_basura", name: "Bolsas de basura", category: "otros", per: 1, unit: "u" },
  { id: "cafe", name: "Café", category: "otros", per: 1, unit: "u" },
  { id: "azucar", name: "Azúcar", category: "otros", per: 1, unit: "u" },
  { id: "condimentos", name: "Condimentos", category: "otros", per: 1, unit: "u" },
];

// Evento especial dentro de una casa rural (una comida concreta del
// viaje que es barbacoa o cumpleaños).
export type SpecialEvent = "barbacoa" | "cumple";
export type SpecialEvents = Record<number, SpecialEvent | null>;

export function computeBasket(
  event: EventType | null,
  people: People,
  restrictions: Restriction[],
  days: number,
  meals: MealsConfig,
  aperitivo: boolean = false,
  specialEvents: SpecialEvents = {},
): Item[] {
  if (!event) return [];
  const map = new Map<string, Item>();
  const units = adultUnits(people);
  if (units === 0 && event !== "rural") return [];

  if (event === "rural") {
    if (units === 0) return [];
    for (let d = 1; d <= days; d++) {
      const dayMeals = meals[d] || { desayuno: true, comida: true, merienda: true, cena: true };
      const special = specialEvents[d];
      (Object.keys(dayMeals) as Meal[]).forEach((m) => {
        if (!dayMeals[m]) return;
        const mult = RURAL_MEAL_MULT[m];
        RURAL_MEALS[m].forEach((p) => {
          let qty = p.per * units * mult;
          // Si ese día hay barbacoa/cumpleaños, aplicamos su multiplicador
          // a la comida y la cena (la celebración fuerte del día).
          if (special && (m === "comida" || m === "cena")) {
            qty *= eventMultiplier(special, p.category);
          }
          add(map, p, qty);
        });
      });
    }
    GROUP_BASICS.forEach((p) => add(map, p, p.per));
  } else {
    BASE_MEAL.forEach((p) => {
      // Los aperitivos/snacks solo entran si el usuario activa el aperitivo
      if (p.category === "snacks" && !aperitivo) return;
      const mult = eventMultiplier(event, p.category);
      add(map, p, p.per * units * mult);
    });
    // Con aperitivo añadimos algo de picoteo (embutido y queso)
    if (aperitivo) {
      add(
        map,
        { id: "picoteo", name: "Embutido y queso para picar", category: "embutido", per: 70, unit: "g" },
        70 * units,
      );
    }
  }

  // Apply restrictions
  const list = Array.from(map.values());
  const hasNinguna = restrictions.includes("ninguna");
  const active = hasNinguna ? [] : restrictions;

  return list
    .map((it) => transformItem(it, active))
    .filter((it): it is Item => it !== null);
}

function transformItem(item: Item, restrictions: Restriction[]): Item | null {
  let it = { ...item };
  for (const r of restrictions) {
    if (r === "sin_alcohol" && it.category === "bebida_con") return null;
    if (r === "celiaco" && (it.category === "pan" || it.id.includes("pasta"))) {
      it = { ...it, name: it.name.replace(/\s+sin gluten$/i, "") + " sin gluten" };
    }
    if (r === "lactosa" && it.category === "lacteos") {
      it = { ...it, name: "Lácteos sin lactosa" };
    }
    if ((r === "vegano" || r === "vegetariano") && it.category === "carne") {
      it = { ...it, name: "Legumbres / tofu", id: "legumbres" };
    }
    if (r === "vegano" && it.category === "lacteos") {
      it = { ...it, name: "Bebida vegetal", id: "bebida_vegetal" };
    }
    if (r === "vegano" && it.category === "embutido") {
      it = { ...it, name: "Paté vegetal y queso vegano", id: "embutido_vegano" };
    }
    if (r === "sin_cerdo" && it.category === "embutido") {
      it = { ...it, name: "Embutido (pavo) y queso" };
    }
  }
  return it;
}

export function formatQty(it: Item): string {
  if (it.unit === "g") {
    const kg = it.qty / 1000;
    if (kg >= 1) return `${kg.toFixed(kg >= 10 ? 0 : 1)} kg`;
    return `${Math.round(it.qty)} g`;
  }
  if (it.unit === "ml") {
    const l = it.qty / 1000;
    if (l >= 1) return `${l.toFixed(l >= 10 ? 0 : 1)} L`;
    return `${Math.round(it.qty)} ml`;
  }
  return `${Math.round(it.qty)} ud`;
}

export function groupByCategory(items: Item[]): Record<Category, Item[]> {
  const out = {} as Record<Category, Item[]>;
  items.forEach((it) => {
    if (!out[it.category]) out[it.category] = [];
    out[it.category].push(it);
  });
  return out;
}

export function defaultMealsConfig(days: number, mode: "all" | "standard" = "all"): MealsConfig {
  const cfg: MealsConfig = {};
  for (let d = 1; d <= days; d++) {
    if (mode === "standard") {
      if (d === 1) cfg[d] = { desayuno: false, comida: false, merienda: false, cena: true };
      else if (d === days) cfg[d] = { desayuno: true, comida: true, merienda: false, cena: false };
      else cfg[d] = { desayuno: true, comida: true, merienda: true, cena: true };
    } else {
      cfg[d] = { desayuno: true, comida: true, merienda: true, cena: true };
    }
  }
  return cfg;
}