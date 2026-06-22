// =============================================================
// GENERADOR DE CATÁLOGO
// =============================================================
// Lee data/products.json (productos reales de Mercadona) y produce
// ../../src/lib/catalog.ts: un catálogo curado que mapea cada
// "necesidad" (carne para barbacoa, bebidas, pan...) a productos
// concretos con 2-3 opciones a elegir y variedad.
//
// Ejecutar:  node scripts/build-catalog.js   (desde data-tools/)
// =============================================================

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const APP_ROOT = join(ROOT, '..');

// Cada "slot" cubre una parte de la cantidad de su categoría (share)
// y ofrece varias opciones reales para elegir. La variedad sale de
// tener varios slots por categoría (p.ej. barbacoa = chorizo + panceta
// + pollo + chuletas).
//
// spec de slot: { id, label, share, cats:[categorías], inc:/regex/, exc:/regex/, unit:"kg"|"L", n }
const SPECS = {
  // ---- CARNE estándar (comida familiar, etc.) ----
  carne: [
    { id: 'pollo', label: 'Pollo', share: 0.5, cats: ['Carne'], inc: /pechuga de pollo|muslo|contramuslo de pollo|jamoncit/i, unit: 'kg', n: 3 },
    { id: 'cerdo_ternera', label: 'Cerdo / ternera', share: 0.5, cats: ['Carne'], inc: /chuleta.*cerdo|lomo de cerdo|filete.*ternera|aguja|entrecot|cinta de lomo/i, unit: 'kg', n: 3 },
  ],
  // ---- CARNE comida familiar (asado/guiso) ----
  'carne:familiar': [
    { id: 'pollo', label: 'Pollo', share: 0.5, cats: ['Carne'], inc: /pechuga de pollo|muslo|contramuslo|jamoncit|pollo entero/i, unit: 'kg', n: 3 },
    { id: 'guiso_asado', label: 'Cerdo / ternera para asar o guisar', share: 0.5, cats: ['Carne'], inc: /entrecot|aguja|lomo de cerdo|chuleta.*cerdo|cinta de lomo|morcillo/i, unit: 'kg', n: 3 },
  ],
  // ---- CARNE cumpleaños (para picar, apto niños) ----
  'carne:cumple': [
    { id: 'empanados', label: 'Empanados y para picar', share: 0.4, cats: ['Carne', 'Congelados'], inc: /empanad|nugget|varitas|lagrimitas|san jacobo|fingers|crujiente/i, unit: 'kg', n: 3 },
    { id: 'hamburguesas', label: 'Hamburguesas y salchichas', share: 0.3, cats: ['Carne'], inc: /hamburguesa|salchicha/i, unit: 'kg', n: 3 },
    { id: 'alitas', label: 'Alitas y jamoncitos', share: 0.3, cats: ['Carne'], inc: /alas.*pollo|jamoncit/i, unit: 'kg', n: 3 },
  ],
  // ---- CARNE cena de amigos (tabla de picoteo) ----
  'carne:amigos': [
    { id: 'iberico', label: 'Ibéricos y embutido', share: 0.5, cats: ['Charcutería y quesos', 'Carne'], inc: /ibérico|salchichón|lomo embuchado|fuet|cecina|jamón (serrano|ibérico)|chorizo (vela|sarta)/i, unit: 'kg', n: 3 },
    { id: 'queso', label: 'Quesos', share: 0.5, cat: 'embutido', cats: ['Charcutería y quesos'], inc: /queso (curado|viejo|manchego|mezcla|semicurado|añejo|ibérico)|cuña|tabla de queso/i, exc: /rallado|crema|untable|batido|fresco|0%/i, unit: 'kg', n: 3 },
  ],
  // ---- CARNE Nochebuena (festivo) ----
  'carne:nochebuena': [
    { id: 'cordero', label: 'Cordero / lechal', share: 0.35, cats: ['Carne'], inc: /cordero|lechal|paletilla|cabrito/i, unit: 'kg', n: 3 },
    { id: 'marisco', label: 'Marisco', share: 0.35, cats: ['Marisco y pescado', 'Congelados'], inc: /langostino|gambón|gamba|marisco|mejillón|almeja|pulpo/i, unit: 'kg', n: 3 },
    { id: 'iberico_premium', label: 'Ibérico y solomillo', share: 0.3, cats: ['Carne'], inc: /presa|secreto|solomillo|ibérico|entrecot/i, unit: 'kg', n: 3 },
  ],
  // ---- ENTRANTES Nochebuena (en lugar de ensalada normal) ----
  'ensalada:nochebuena': [
    { id: 'marisco_entrante', label: 'Marisco para entrante', share: 0.5, cats: ['Marisco y pescado', 'Congelados'], inc: /langostino|gambón|salpicón|salmón ahumado|gulas|cóctel de marisco/i, unit: 'kg', n: 3 },
    { id: 'tabla', label: 'Tabla de ibéricos y queso', share: 0.5, cat: 'embutido', cats: ['Charcutería y quesos'], inc: /ibérico|jamón|queso (curado|viejo|manchego|mezcla)|paté|cuña/i, exc: /rallado|batido|fresco|0%/i, unit: 'kg', n: 3 },
  ],
  // ---- CARNE barbacoa (variada) ----
  'carne:barbacoa': [
    { id: 'embutido_bbq', label: 'Para la parrilla (chorizo, salchichas)', share: 0.3, cats: ['Carne', 'Charcutería y quesos'], inc: /chorizo (parrilla|criollo|fresco|oreado)|salchicha (fresca|parrilla|criolla)|butifarra|longaniza/i, unit: 'kg', n: 3 },
    { id: 'panceta', label: 'Panceta y secreto', share: 0.2, cats: ['Carne'], inc: /panceta|secreto|costilla|churrasco/i, unit: 'kg', n: 3 },
    { id: 'pollo_bbq', label: 'Pollo (alas, muslos)', share: 0.25, cats: ['Carne'], inc: /alas.*pollo|muslo|contramuslo|jamoncit|brocheta/i, unit: 'kg', n: 3 },
    { id: 'chuletas_bbq', label: 'Chuletas y cinta', share: 0.25, cats: ['Carne'], inc: /chuleta|cinta de lomo|lomo de cerdo|aguja/i, unit: 'kg', n: 3 },
  ],
  // ---- BEBIDA SIN ALCOHOL ----
  bebida_sin: [
    { id: 'agua', label: 'Agua', share: 0.4, cats: ['Agua y refrescos'], inc: /agua mineral/i, unit: 'L', n: 3 },
    { id: 'cola', label: 'Refresco de cola', share: 0.25, cats: ['Agua y refrescos'], inc: /cola/i, exc: /gambón|rape|colas de/i, unit: 'L', n: 3 },
    { id: 'naranja_limon', label: 'Refresco naranja / limón', share: 0.2, cats: ['Agua y refrescos'], inc: /naranja|limón|gaseosa|tónica|seven|sprite|fanta/i, unit: 'L', n: 3 },
    { id: 'zumo', label: 'Zumo', share: 0.15, cats: ['Zumos'], inc: /zumo|néctar/i, unit: 'L', n: 3 },
  ],
  // ---- BEBIDA CON ALCOHOL ----
  bebida_con: [
    { id: 'cerveza', label: 'Cerveza', share: 0.6, cats: ['Bodega'], inc: /cerveza/i, exc: /sin alcohol|0,0|0\.0/i, unit: 'L', n: 3 },
    { id: 'vino', label: 'Vino', share: 0.4, cats: ['Bodega'], inc: /vino (tinto|blanco|rosado)/i, unit: 'L', n: 3 },
  ],
  // ---- PAN ----
  pan: [
    { id: 'pan', label: 'Pan', share: 1, cats: ['Panadería y pastelería'], inc: /barra|baguet|chapata|hogaza|pan de pueblo|pan rústic|pan candeal|pan gallego|payés/i, unit: 'kg', n: 3 },
  ],
  // ---- ENSALADA / VERDURA ----
  ensalada: [
    { id: 'hoja', label: 'Lechuga / bolsa de ensalada', share: 0.6, cats: ['Fruta y verdura'], inc: /lechuga|ensalada|brotes|canónigos|rúcula|escarola/i, exc: /tomate/i, unit: 'kg', n: 3 },
    { id: 'tomate', label: 'Tomate y crudités', share: 0.4, cats: ['Fruta y verdura'], inc: /tomate|pepino|zanahoria|pimiento|cebolla/i, unit: 'kg', n: 3 },
  ],
  // ---- GUARNICIÓN ----
  guarnicion: [
    { id: 'patata', label: 'Patatas', share: 1, cats: ['Fruta y verdura', 'Congelados'], inc: /patata/i, exc: /fritas|chips|snack/i, unit: 'kg', n: 3 },
  ],
  // ---- POSTRE (general) ----
  postre: [
    { id: 'postre', label: 'Postre', share: 1, cats: ['Postres y yogures', 'Panadería y pastelería'], inc: /tarta|tiramis|brownie|natilla|flan|mousse|cheesecake|profiterol/i, exc: /steak|tartar/i, unit: 'kg', n: 3 },
  ],
  // ---- POSTRE barbacoa (fruta y refrescante) ----
  'postre:barbacoa': [
    { id: 'fruta', label: 'Fruta de postre', share: 0.5, cats: ['Fruta y verdura'], inc: /sandía|melón|piña|uva|fresa|cereza|melocotón/i, unit: 'kg', n: 3 },
    { id: 'dulce', label: 'Tarta o helado', share: 0.5, cats: ['Postres y yogures', 'Panadería y pastelería'], inc: /tarta|helado|tiramis|brownie/i, exc: /steak|tartar/i, unit: 'kg', n: 3 },
  ],
  // ---- POSTRE cena de amigos (tarta de queso, algo ligero) ----
  'postre:amigos': [
    { id: 'tarta_queso', label: 'Tarta de queso / tiramisú', share: 0.6, cats: ['Postres y yogures', 'Panadería y pastelería'], inc: /tarta de queso|cheesecake|tiramis|brownie|mousse/i, unit: 'kg', n: 3 },
    { id: 'fruta_dulce', label: 'Fruta y dulces', share: 0.4, cats: ['Fruta y verdura'], inc: /uva|fresa|frambuesa|arándano|cereza/i, unit: 'kg', n: 3 },
  ],
  // ---- ENSALADA barbacoa (fresca, con maíz y variado) ----
  'ensalada:barbacoa': [
    { id: 'hoja', label: 'Lechuga / bolsa de ensalada', share: 0.5, cats: ['Fruta y verdura'], inc: /lechuga|ensalada|brotes|canónigos|rúcula|escarola/i, exc: /tomate/i, unit: 'kg', n: 3 },
    { id: 'maiz_tomate', label: 'Tomate, maíz y aguacate', share: 0.5, cats: ['Fruta y verdura', 'Conservas, caldos y cremas'], inc: /tomate|maíz|aguacate|cebolla/i, unit: 'kg', n: 3 },
  ],
  // ---- POSTRE para cumpleaños (tarta protagonista) ----
  'postre:cumple': [
    { id: 'tarta', label: 'Tarta de cumpleaños', share: 0.7, cats: ['Postres y yogures', 'Panadería y pastelería', 'Congelados'], inc: /tarta|cheesecake|red velvet/i, exc: /steak|tartar/i, unit: 'kg', n: 3 },
    { id: 'dulces', label: 'Dulces y chuches', share: 0.3, cats: ['Aperitivos', 'Postres y yogures'], inc: /gominola|chuche|caramelo|galleta|magdalena|bizcocho|donut/i, unit: 'kg', n: 3 },
  ],
  // ---- SNACKS / APERITIVO ----
  snacks: [
    { id: 'patatas_fritas', label: 'Patatas fritas y chips', share: 0.4, cats: ['Aperitivos'], inc: /patatas fritas|chips|nachos|tortilla chip/i, unit: 'kg', n: 3 },
    { id: 'aceitunas', label: 'Aceitunas y encurtidos', share: 0.3, cats: ['Aperitivos', 'Conservas, caldos y cremas'], inc: /aceituna|banderilla|encurtido|pepinillo/i, unit: 'kg', n: 3 },
    { id: 'frutos_secos', label: 'Frutos secos', share: 0.3, cats: ['Aperitivos'], inc: /cacahuete|almendra|pistacho|anacardo|cóctel|frutos secos/i, unit: 'kg', n: 3 },
  ],
  // ---- LÁCTEOS ----
  lacteos: [
    { id: 'leche', label: 'Leche', share: 0.6, cats: ['Huevos, leche y mantequilla'], inc: /leche (entera|semi|desnatada)/i, exc: /sin lactosa|condensada/i, unit: 'L', n: 3 },
    { id: 'yogur', label: 'Yogur', share: 0.4, cats: ['Postres y yogures'], inc: /yogur/i, unit: 'kg', n: 3 },
  ],
  // ---- EMBUTIDO Y QUESO ----
  embutido: [
    { id: 'embutido', label: 'Jamón y embutido', share: 0.6, cats: ['Charcutería y quesos', 'Carne'], inc: /jamón (serrano|cocido|york)|chorizo|salchichón|lomo|mortadela|pavo lonchas|fuet/i, unit: 'kg', n: 3 },
    { id: 'queso', label: 'Queso', share: 0.4, cats: ['Charcutería y quesos'], inc: /queso/i, exc: /rallado|crema/i, unit: 'kg', n: 3 },
  ],
  // ---- FRUTA ----
  fruta: [
    { id: 'fruta', label: 'Fruta variada', share: 1, cats: ['Fruta y verdura'], inc: /plátano|manzana|naranja|pera|uva|melón|sandía|fresa|mandarina|kiwi/i, unit: 'kg', n: 3 },
  ],
};

// Productos concretos para los básicos de grupo de casa rural (1 unidad
// cada uno → usamos el precio del paquete).
const BASICS = {
  aceite: /^aceite de oliva/i,
  sal: /^sal /i,
  especias: /^especias|^orégano|^pimienta/i,
  papel_cocina: /papel.*cocina|rollo de cocina|bobina/i,
  bolsas_basura: /bolsa.*basura/i,
  cafe: /^café molido|^café natural|^café en grano/i,
  azucar: /^azúcar/i,
  condimentos: /kétchup|ketchup|mayonesa|mostaza/i,
};

function pickOptions(products, spec) {
  const inCat = (x) => spec.cats.includes(x.category);
  let pool = products.filter(
    (x) =>
      inCat(x) &&
      x.unit === spec.unit &&
      typeof x.price === 'number' &&
      x.price > 0 &&
      spec.inc.test(x.name) &&
      !(spec.exc && spec.exc.test(x.name)),
  );
  // dedupe por nombre
  const seen = new Set();
  pool = pool.filter((x) => (seen.has(x.name) ? false : seen.add(x.name)));
  // ordenar por precio ascendente (opción económica primero)
  pool.sort((a, b) => a.price - b.price);
  return pool.slice(0, spec.n || 3).map((x) => ({
    id: String(x.external_id),
    name: x.name,
    price: Number(x.price.toFixed(2)),
    unit: x.unit,
    packPrice: x.pack_price != null ? Number(Number(x.pack_price).toFixed(2)) : null,
    image: x.image_url || null,
  }));
}

async function main() {
  const raw = JSON.parse(await readFile(join(ROOT, 'data', 'products.json'), 'utf8'));

  const catalog = {};
  const report = [];
  for (const [key, slots] of Object.entries(SPECS)) {
    const built = [];
    for (const spec of slots) {
      const options = pickOptions(raw, spec);
      report.push(`${key} · ${spec.id}: ${options.length} opciones${options.length ? ' → ' + options.map((o) => `${o.name} (${o.price}€/${o.unit})`).slice(0, 1).join('') : ' ⚠️ SIN RESULTADOS'}`);
      // Solo guardamos los slots que tienen productos reales.
      if (options.length) {
        const slot = { id: spec.id, label: spec.label, share: spec.share, options };
        if (spec.cat) slot.cat = spec.cat;
        built.push(slot);
      }
    }
    // Un catálogo específico de evento (clave con ":") solo se registra si
    // tiene algún slot con productos; si no, la app cae al catálogo genérico.
    if (built.length) catalog[key] = built;
  }

  const basics = {};
  for (const [id, re] of Object.entries(BASICS)) {
    const found = raw
      .filter((x) => re.test(x.name) && (x.pack_price || x.price))
      .sort((a, b) => (a.pack_price || a.price) - (b.pack_price || b.price))[0];
    if (found) {
      basics[id] = {
        name: found.name,
        price: Number(Number(found.pack_price || found.price).toFixed(2)),
        image: found.image_url || null,
      };
      report.push(`basic · ${id}: ${found.name} (${basics[id].price}€)`);
    } else {
      report.push(`basic · ${id}: ⚠️ SIN RESULTADOS`);
    }
  }

  const header = `// AUTO-GENERADO por data-tools/scripts/build-catalog.js — no editar a mano.
// Catálogo de productos reales de Mercadona agrupados por necesidad.
// Regenerar tras un scrape:  cd data-tools && node scripts/build-catalog.js

export type ProductOption = {
  id: string;
  name: string;
  price: number;        // €/kg, €/L o €/ud (precio de referencia)
  unit: string;         // "kg" | "L" | "ud"
  packPrice: number | null;
  image: string | null;
};
export type CatalogSlot = {
  id: string;
  label: string;
  share: number;        // parte de la cantidad de la categoría
  cat?: string;         // categoría destino si difiere de la del item (p.ej. queso → embutido)
  options: ProductOption[];
};
export type BasicProduct = { name: string; price: number; image: string | null };
`;

  const body =
    `\nexport const CATALOG: Record<string, CatalogSlot[]> = ${JSON.stringify(catalog, null, 2)};\n` +
    `\nexport const BASICS: Record<string, BasicProduct> = ${JSON.stringify(basics, null, 2)};\n`;

  await writeFile(join(APP_ROOT, 'src', 'lib', 'catalog.ts'), header + body, 'utf8');
  console.log(report.join('\n'));
  console.log('\n✅ Catálogo escrito en src/lib/catalog.ts');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
