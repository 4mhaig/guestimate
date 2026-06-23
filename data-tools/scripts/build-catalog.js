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
  // ---- CARNE/PROTEÍNA estándar (comida familiar, casa rural...) ----
  // Una sola línea: eliges UN tipo de proteína; el desplegable ofrece variedad
  // (pollo, cerdo, ternera, pavo, pescado, cordero...).
  carne: [
    {
      id: 'principal',
      label: 'Carne o pescado',
      share: 1,
      unit: 'kg',
      n: 9,
      mix: [
        { cats: ['Carne'], inc: /pechuga de pollo|muslo|contramuslo de pollo|jamoncit|pollo entero/i, take: 2 },
        { cats: ['Carne'], inc: /chuleta.*cerdo|lomo de cerdo|secreto|aguja de cerdo|cinta de lomo|magro/i, take: 2 },
        { cats: ['Carne'], inc: /ternera|añojo|vacuno|entrecot/i, exc: /cerdo|hígado|casquer|riñon|molleja|rabo|callos/i, take: 2 },
        { cats: ['Carne'], inc: /filetes? (de )?pavo|pechuga de pavo|escalope/i, take: 1 },
        { cats: ['Marisco y pescado', 'Congelados'], inc: /merluza|salmón|dorada|lubina|bacalao|emperador/i, exc: /relleno|varitas|palitos|croqueta|albóndiga|rebozad|buñuelo/i, take: 2 },
        { cats: ['Carne'], inc: /cordero|conejo|lechal/i, take: 1 },
      ],
    },
  ],
  // ---- CARNE cumpleaños (una sola línea con desplegable variado) ----
  // Eliges UNA cosa para cocinar; el desplegable ofrece variedad apta para
  // picar y niños (empanados, hamburguesas, alitas).
  'carne:cumple': [
    {
      id: 'principal',
      label: 'Carne para picar',
      share: 1,
      unit: 'kg',
      n: 8,
      mix: [
        { cats: ['Carne', 'Congelados'], inc: /empanad|nugget|varitas|lagrimitas|san jacobo|fingers|tiras de pollo/i, exc: /pizza|base|masa/i, take: 3 },
        { cats: ['Carne'], inc: /hamburguesa|salchicha/i, take: 2 },
        { cats: ['Carne'], inc: /alas.*pollo|jamoncit/i, take: 2 },
      ],
    },
  ],
  // ---- CARNE cena de amigos (tabla de picoteo) ----
  'carne:amigos': [
    { id: 'iberico', label: 'Ibéricos y embutido', share: 0.5, cats: ['Charcutería y quesos', 'Carne'], inc: /ibérico|salchichón|lomo embuchado|fuet|cecina|jamón (serrano|ibérico)|chorizo (vela|sarta)/i, unit: 'kg', n: 6 },
    { id: 'queso', label: 'Quesos', share: 0.5, cat: 'embutido', cats: ['Charcutería y quesos'], inc: /queso (curado|viejo|manchego|mezcla|semicurado|añejo|ibérico)|cuña|tabla de queso/i, exc: /rallado|crema|untable|batido|fresco|0%/i, unit: 'kg', n: 6 },
  ],
  // ---- CARNE Nochebuena (festivo) ----
  'carne:nochebuena': [
    { id: 'cordero', label: 'Cordero / lechal', share: 0.35, cats: ['Carne'], inc: /cordero|lechal|paletilla|cabrito/i, unit: 'kg', n: 6 },
    { id: 'marisco', label: 'Marisco y pescado', share: 0.35, cat: 'pescado', cats: ['Marisco y pescado', 'Congelados'], inc: /langostino|gambón|gamba|marisco|mejillón|almeja|pulpo|merluza|bacalao|dorada|lubina/i, unit: 'kg', n: 6 },
    { id: 'iberico_premium', label: 'Ibérico y solomillo', share: 0.3, cats: ['Carne'], inc: /presa|secreto|solomillo|ibérico|entrecot/i, unit: 'kg', n: 6 },
  ],
  // ---- ENTRANTES Nochebuena (ensalada festiva + marisco; tabla va a embutido) ----
  'ensalada:nochebuena': [
    { id: 'hoja', label: 'Ensalada festiva', share: 0.4, cats: ['Fruta y verdura'], inc: /lechuga|ensalada|brotes|canónigos|rúcula|escarola|aguacate/i, exc: /tomate/i, unit: 'kg', n: 6 },
    { id: 'marisco_entrante', label: 'Marisco para entrante', share: 0.6, cat: 'entrante', cats: ['Marisco y pescado', 'Congelados'], inc: /langostino|gambón|salpicón|salmón ahumado|gulas|cóctel de marisco/i, unit: 'kg', n: 6 },
    { id: 'tabla', label: 'Tabla de ibéricos y queso', share: 0.5, cat: 'embutido', cats: ['Charcutería y quesos'], inc: /ibérico|jamón|queso (curado|viejo|manchego|mezcla)|paté|cuña/i, exc: /rallado|batido|fresco|0%/i, unit: 'kg', n: 6 },
  ],
  // ---- APERITIVO / SNACKS por evento ----
  'snacks:cumple': [
    { id: 'patatas_fritas', label: 'Patatas fritas y chips', share: 0.4, cats: ['Aperitivos'], inc: /patatas fritas|chips|nachos/i, unit: 'kg', n: 6 },
    { id: 'palomitas', label: 'Palomitas y gusanitos', share: 0.35, cats: ['Aperitivos'], inc: /palomita|gusanito|ganchito|cortez/i, unit: 'kg', n: 6 },
    { id: 'frutos_secos', label: 'Frutos secos', share: 0.25, cats: ['Aperitivos'], inc: /cacahuete|cóctel|frutos secos/i, unit: 'kg', n: 6 },
  ],
  'snacks:nochebuena': [
    { id: 'frutos_secos', label: 'Frutos secos premium', share: 0.4, cats: ['Aperitivos'], inc: /almendra|nuez|nueces|pistacho|anacardo|cóctel/i, unit: 'kg', n: 6 },
    { id: 'aceitunas', label: 'Aceitunas y encurtidos', share: 0.3, cats: ['Aperitivos', 'Conservas, caldos y cremas'], inc: /aceituna|banderilla|encurtido|pepinillo/i, unit: 'kg', n: 6 },
    { id: 'picos', label: 'Picos y regañás', share: 0.3, cats: ['Panadería y pastelería', 'Aperitivos'], inc: /picos|regaña|colines|pan tostado/i, unit: 'kg', n: 6 },
  ],
  // ---- CARNE barbacoa (variada) ----
  'carne:barbacoa': [
    { id: 'embutido_bbq', label: 'Para la parrilla (chorizo, salchichas)', share: 0.3, cats: ['Carne', 'Charcutería y quesos'], inc: /chorizo (parrilla|criollo|fresco|oreado)|salchicha (fresca|parrilla|criolla)|butifarra|longaniza/i, unit: 'kg', n: 6 },
    { id: 'panceta', label: 'Panceta y secreto', share: 0.2, cats: ['Carne'], inc: /panceta|secreto|costilla|churrasco/i, unit: 'kg', n: 6 },
    { id: 'pollo_bbq', label: 'Pollo (alas, muslos)', share: 0.25, cats: ['Carne'], inc: /alas.*pollo|muslo|contramuslo|jamoncit|brocheta/i, unit: 'kg', n: 6 },
    { id: 'chuletas_bbq', label: 'Chuletas y cinta', share: 0.25, cats: ['Carne'], inc: /chuleta|cinta de lomo|lomo de cerdo|aguja/i, unit: 'kg', n: 6 },
  ],
  // ---- BEBIDA SIN ALCOHOL ----
  bebida_sin: [
    { id: 'agua', label: 'Agua', share: 0.4, cats: ['Agua y refrescos'], inc: /agua mineral/i, unit: 'L', n: 6 },
    { id: 'cola', label: 'Refresco de cola', share: 0.25, cats: ['Agua y refrescos'], inc: /cola/i, exc: /gambón|rape|colas de/i, unit: 'L', n: 6 },
    { id: 'naranja_limon', label: 'Refresco naranja / limón', share: 0.2, cats: ['Agua y refrescos'], inc: /naranja|limón|gaseosa|tónica|seven|sprite|fanta/i, unit: 'L', n: 6 },
    { id: 'zumo', label: 'Zumo', share: 0.15, cats: ['Zumos'], inc: /zumo|néctar/i, unit: 'L', n: 6 },
  ],
  // ---- BEBIDA CON ALCOHOL ----
  bebida_con: [
    { id: 'cerveza', label: 'Cerveza', share: 0.6, cats: ['Bodega'], inc: /cerveza/i, exc: /sin alcohol|0,0|0\.0/i, unit: 'L', n: 6 },
    { id: 'vino', label: 'Vino', share: 0.4, cats: ['Bodega'], inc: /vino (tinto|blanco|rosado)/i, unit: 'L', n: 6 },
  ],
  // ---- PAN ----
  pan: [
    { id: 'pan', label: 'Pan', share: 1, cats: ['Panadería y pastelería'], inc: /barra|baguet|chapata|hogaza|pan de pueblo|pan rústic|pan candeal|pan gallego|payés/i, unit: 'kg', n: 6 },
  ],
  // ---- ENSALADA / VERDURA ----
  ensalada: [
    { id: 'hoja', label: 'Lechuga / bolsa de ensalada', share: 0.45, cats: ['Fruta y verdura'], inc: /lechuga|ensalada|brotes|canónigos|rúcula|escarola/i, exc: /tomate/i, unit: 'kg', n: 6 },
    { id: 'tomate', label: 'Tomate', share: 0.3, cats: ['Fruta y verdura'], inc: /tomate/i, unit: 'kg', n: 6 },
    { id: 'crudites', label: 'Crudités (zanahoria, pepino, aguacate)', share: 0.25, cats: ['Fruta y verdura'], inc: /zanahoria|pepino|pimiento|aguacate|apio/i, unit: 'kg', n: 6 },
  ],
  // ---- GUARNICIÓN (patata + pasta/arroz, muy socorrido en casa rural) ----
  guarnicion: [
    { id: 'patata', label: 'Patatas', share: 0.5, cats: ['Fruta y verdura', 'Congelados'], inc: /patata/i, exc: /chips|snack|onduladas|sabor/i, unit: 'kg', n: 6 },
    { id: 'pasta_arroz', label: 'Pasta y arroz', share: 0.5, cats: ['Arroz, legumbres y pasta'], inc: /espagueti|macarr|tallarin|penne|fusilli|espiral|hélice|pasta|^arroz|fideo/i, exc: /sésamo|tahini|integral en|salsa|queso en polvo/i, unit: 'kg', n: 6 },
  ],
  'guarnicion:barbacoa': [
    { id: 'patata', label: 'Patatas para asar', share: 0.6, cats: ['Fruta y verdura', 'Congelados'], inc: /patata/i, exc: /chips|snack|onduladas|sabor/i, unit: 'kg', n: 6 },
    { id: 'ensaladilla', label: 'Ensaladilla y guarnición', share: 0.4, cats: ['Congelados', 'Fruta y verdura', 'Conservas, caldos y cremas'], inc: /ensaladilla|maíz|menestra|pimiento asado/i, unit: 'kg', n: 6 },
  ],
  // Guarnición de cumpleaños = patata de verdad (las palomitas/chips van en
  // SNACKS, su sitio natural, no como "guarnición").
  'guarnicion:cumple': [
    { id: 'patata', label: 'Patatas', share: 1, cats: ['Fruta y verdura', 'Congelados'], inc: /patata/i, exc: /chips|snack|onduladas|sabor|fritas/i, unit: 'kg', n: 6 },
  ],
  'guarnicion:nochebuena': [
    { id: 'asar', label: 'Patatas panaderas / asar', share: 0.6, cats: ['Fruta y verdura', 'Congelados'], inc: /patata/i, exc: /chips|snack|onduladas|sabor|fritas/i, unit: 'kg', n: 6 },
    { id: 'guarnicion_festiva', label: 'Guarnición festiva', share: 0.4, cats: ['Congelados', 'Fruta y verdura'], inc: /espárrago|champiñón|setas|menestra|pimiento del piquillo|puré/i, unit: 'kg', n: 6 },
  ],
  // ---- POSTRE (general) ----
  postre: [
    { id: 'postre', label: 'Postre', share: 1, cats: ['Postres y yogures', 'Panadería y pastelería'], inc: /tarta|tiramis|brownie|natilla|flan|mousse|cheesecake|profiterol/i, exc: /steak|tartar/i, unit: 'kg', n: 6 },
  ],
  // ---- POSTRE barbacoa (fruta y refrescante) ----
  'postre:barbacoa': [
    { id: 'fruta', label: 'Fruta de postre', share: 0.5, cats: ['Fruta y verdura'], inc: /sandía|melón|piña|uva|fresa|cereza|melocotón/i, unit: 'kg', n: 6 },
    { id: 'dulce', label: 'Tarta o helado', share: 0.5, cats: ['Postres y yogures', 'Panadería y pastelería'], inc: /tarta|helado|tiramis|brownie/i, exc: /steak|tartar/i, unit: 'kg', n: 6 },
  ],
  // ---- POSTRE cena de amigos (tarta de queso, algo ligero) ----
  'postre:amigos': [
    { id: 'tarta_queso', label: 'Tarta de queso / tiramisú', share: 0.6, cats: ['Postres y yogures', 'Panadería y pastelería'], inc: /tarta de queso|cheesecake|tiramis|brownie|mousse/i, unit: 'kg', n: 6 },
    { id: 'fruta_dulce', label: 'Fruta y dulces', share: 0.4, cats: ['Fruta y verdura'], inc: /uva|fresa|frambuesa|arándano|cereza/i, unit: 'kg', n: 6 },
  ],
  // ---- ENSALADA barbacoa (fresca, con maíz y variado) ----
  'ensalada:barbacoa': [
    { id: 'hoja', label: 'Lechuga / bolsa de ensalada', share: 0.5, cats: ['Fruta y verdura'], inc: /lechuga|ensalada|brotes|canónigos|rúcula|escarola/i, exc: /tomate/i, unit: 'kg', n: 6 },
    { id: 'maiz_tomate', label: 'Tomate, maíz y aguacate', share: 0.5, cats: ['Fruta y verdura', 'Conservas, caldos y cremas'], inc: /tomate|maíz|aguacate|cebolla/i, unit: 'kg', n: 6 },
  ],
  // ---- POSTRE para cumpleaños (tarta protagonista) ----
  'postre:cumple': [
    { id: 'tarta', label: 'Tarta de cumpleaños', share: 0.7, cats: ['Postres y yogures', 'Panadería y pastelería', 'Congelados'], inc: /tarta|cheesecake|red velvet/i, exc: /steak|tartar/i, unit: 'kg', n: 6 },
    { id: 'dulces', label: 'Dulces y chuches', share: 0.3, cats: ['Aperitivos', 'Postres y yogures'], inc: /gominola|chuche|caramelo|galleta|magdalena|bizcocho|donut/i, unit: 'kg', n: 6 },
  ],
  // ---- SNACKS / APERITIVO ----
  snacks: [
    { id: 'patatas_fritas', label: 'Patatas fritas y chips', share: 0.35, cats: ['Aperitivos'], inc: /patatas fritas|chips|nachos|tortilla chip/i, unit: 'kg', n: 6 },
    { id: 'aceitunas', label: 'Aceitunas y encurtidos', share: 0.25, cats: ['Aperitivos', 'Conservas, caldos y cremas'], inc: /aceituna|banderilla|encurtido|pepinillo/i, unit: 'kg', n: 6 },
    { id: 'frutos_secos', label: 'Frutos secos', share: 0.2, cats: ['Aperitivos'], inc: /cacahuete|almendra|pistacho|anacardo|cóctel|frutos secos/i, unit: 'kg', n: 6 },
    { id: 'dips', label: 'Para mojar (hummus, guacamole)', share: 0.2, cats: ['Pizzas y platos preparados', 'Aceite, especias y salsas', 'Aperitivos'], inc: /hummus|guacamole|babaganoush|paté vegetal/i, exc: /nachos|sabor guacamole/i, unit: 'kg', n: 6 },
  ],
  // ---- LÁCTEOS ----
  lacteos: [
    { id: 'leche', label: 'Leche', share: 0.6, cats: ['Huevos, leche y mantequilla'], inc: /leche (entera|semi|desnatada)/i, exc: /sin lactosa|condensada/i, unit: 'L', n: 6 },
    { id: 'yogur', label: 'Yogur', share: 0.4, cats: ['Postres y yogures'], inc: /yogur/i, unit: 'kg', n: 6 },
  ],
  // ---- EMBUTIDO Y QUESO ----
  embutido: [
    { id: 'embutido', label: 'Jamón y embutido', share: 0.6, cats: ['Charcutería y quesos', 'Carne'], inc: /jamón (serrano|cocido|york)|chorizo|salchichón|lomo|mortadela|pavo lonchas|fuet/i, unit: 'kg', n: 6 },
    { id: 'queso', label: 'Queso', share: 0.4, cats: ['Charcutería y quesos'], inc: /queso/i, exc: /rallado|crema/i, unit: 'kg', n: 6 },
  ],
  // ---- DESAYUNO (galletas y bollería) ----
  desayuno: [
    { id: 'bolleria', label: 'Galletas y bollería', share: 1, cats: ['Panadería y pastelería'], inc: /galleta|magdalena|bizcocho|napolitana|sobao|croissant|donut|palmera|tostada de desayuno|bollo/i, exc: /salada|salado|sésamo|orégano|arroz|integral en|soluble|achicoria|cracker/i, unit: 'kg', n: 6 },
  ],
  // ---- FRUTA (variada: varias piezas, no una sola) ----
  fruta: [
    { id: 'melon_sandia', label: 'Melón / sandía', share: 0.3, cats: ['Fruta y verdura'], inc: /sandía|melón|piña/i, unit: 'kg', n: 6 },
    { id: 'manzana_pera', label: 'Manzana / pera', share: 0.25, cats: ['Fruta y verdura'], inc: /manzana|pera/i, exc: /tomate/i, unit: 'kg', n: 6 },
    { id: 'platano', label: 'Plátano', share: 0.2, cats: ['Fruta y verdura'], inc: /plátano|banana/i, unit: 'kg', n: 6 },
    { id: 'citricos_uva', label: 'Naranja, uva y otras', share: 0.25, cats: ['Fruta y verdura'], inc: /naranja|mandarina|uva|kiwi|fresa|ciruela/i, unit: 'kg', n: 6 },
  ],

  // ---- CASA RURAL "cocinar poco": platos listos / precocinados ----
  'carne:rural_easy': [
    { id: 'platos_listos', label: 'Platos listos (pizza, lasaña, tortilla)', share: 0.5, cats: ['Congelados', 'Pizzas y platos preparados'], inc: /pizza|lasaña|canelones|musaka|tortilla de patata|fideuá|paella de|tortellini|raviol/i, exc: /placas|verdura|para paella|masa|base|harina|queso rallado/i, unit: 'kg', n: 6 },
    { id: 'empanados_listos', label: 'Empanados y fritos (solo calentar)', share: 0.5, cats: ['Congelados', 'Carne'], inc: /croqueta|san jacobo|empanadilla|varitas|nugget|fingers|flamenquín|albóndiga|libritos/i, unit: 'kg', n: 6 },
  ],
  'guarnicion:rural_easy': [
    { id: 'ensaladilla_prefritas', label: 'Ensaladilla, arroz y patatas listas', share: 1, cats: ['Congelados', 'Fruta y verdura', 'Pizzas y platos preparados'], inc: /ensaladilla|arroz tres delicias|patatas prefritas|patatas (para horno|gajo|risoladas)/i, unit: 'kg', n: 6 },
  ],
};

// Productos para las sustituciones por restricción (sin gluten, vegano, etc.).
const SPECIAL_SPECS = {
  sin_gluten: { cats: ['Panadería y pastelería'], inc: /pan.*sin gluten|molde sin gluten|pan redondo sin gluten/i, exc: /empanad|nugget|san jacobo|lagrimitas|filetes|croqueta|salchicha/i, unit: 'kg', n: 6 },
  legumbres: { cats: ['Arroz, legumbres y pasta', 'Congelados'], inc: /garbanzo cocido|lenteja|alubia|judía blanca|tofu|soja texturizada/i, exc: /snack|harina|crema/i, unit: 'kg', n: 6 },
  bebida_vegetal: { cats: ['Huevos, leche y mantequilla'], inc: /bebida de (avena|soja|almendra|arroz|coco)|bebida vegetal/i, unit: 'L', n: 6 },
  embutido_veg: { cats: ['Aperitivos', 'Conservas, caldos y cremas', 'Charcutería y quesos', 'Pizzas y platos preparados', 'Aceite, especias y salsas'], inc: /hummus|guacamole|paté vegetal|sobrasada vegana|veggie/i, exc: /nachos|sabor guacamole/i, unit: 'kg', n: 6 },
  lacteos_sl: { cats: ['Huevos, leche y mantequilla'], inc: /leche.*sin lactosa|sin lactosa/i, exc: /café/i, unit: 'L', n: 6 },
  embutido_pavo: { cats: ['Charcutería y quesos', 'Carne'], inc: /pavo.*loncha|jamón de pavo|fiambre de pavo|pechuga de pavo cocida/i, unit: 'kg', n: 6 },
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
  huevos: /^huevos/i,
};

const toOption = (x) => ({
  id: String(x.external_id),
  name: x.name,
  price: Number(x.price.toFixed(2)),
  unit: x.unit,
  packPrice: x.pack_price != null ? Number(Number(x.pack_price).toFixed(2)) : null,
  image: x.image_url || null,
});

// Selecciona productos de UNA familia (cats + inc/exc + unit), los más baratos.
function pickFrom(products, sub, unit, take) {
  let pool = products.filter(
    (x) =>
      sub.cats.includes(x.category) &&
      x.unit === unit &&
      typeof x.price === 'number' &&
      x.price > 0 &&
      sub.inc.test(x.name) &&
      !(sub.exc && sub.exc.test(x.name)),
  );
  const seen = new Set();
  pool = pool.filter((x) => (seen.has(x.name) ? false : seen.add(x.name)));
  pool.sort((a, b) => a.price - b.price);
  return pool.slice(0, take ?? pool.length);
}

function pickOptions(products, spec) {
  // spec.mix: varias familias (pollo, cerdo, pescado...) → un desplegable
  // con variedad de TIPOS, pero una sola línea en la cesta.
  if (spec.mix) {
    let picked = [];
    for (const sub of spec.mix) picked.push(...pickFrom(products, sub, spec.unit, sub.take ?? 2));
    const seen = new Set();
    picked = picked.filter((x) => (seen.has(x.name) ? false : seen.add(x.name)));
    picked.sort((a, b) => a.price - b.price);
    return picked.slice(0, spec.n || 8).map(toOption);
  }
  return pickFrom(products, spec, spec.unit, spec.n || 3).map(toOption);
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

  // Productos especiales por restricción (sin gluten, legumbres, sin lactosa...).
  const special = {};
  for (const [kind, spec] of Object.entries(SPECIAL_SPECS)) {
    const options = pickOptions(raw, spec);
    report.push(`special · ${kind}: ${options.length} opciones${options.length ? ' → ' + options[0].name : ' ⚠️ SIN RESULTADOS'}`);
    if (options.length) special[kind] = options;
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
    `\nexport const SPECIAL: Record<string, ProductOption[]> = ${JSON.stringify(special, null, 2)};\n` +
    `\nexport const BASICS: Record<string, BasicProduct> = ${JSON.stringify(basics, null, 2)};\n`;

  await writeFile(join(APP_ROOT, 'src', 'lib', 'catalog.ts'), header + body, 'utf8');
  console.log(report.join('\n'));
  console.log('\n✅ Catálogo escrito en src/lib/catalog.ts');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
