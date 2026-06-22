// =============================================================
// SCRAPER DE MERCADONA — API interna no oficial
// =============================================================
// Mercadona expone una API pública (sin login) que su propia web
// usa por debajo. Es mucho más limpia que leer el HTML.
//
//   GET https://tienda.mercadona.es/api/categories/        -> árbol de categorías
//   GET https://tienda.mercadona.es/api/categories/<id>/   -> productos de una categoría
//
// La API devuelve precios según la zona (almacén), por eso se pasa
// un código postal.
// =============================================================

const BASE_URL = 'https://tienda.mercadona.es/api';

// Categorías que nos interesan para eventos. Los nombres se
// comparan en minúsculas contra el árbol de categorías real.
export const RELEVANT_CATEGORIES = [
  // Carne fresca y derivados (las secciones de Mercadona no llevan
  // la palabra "carne", por eso hay que listarlas por su nombre real)
  'carne',
  'aves',
  'pollo',
  'cerdo',
  'vacuno',
  'ternera',
  'cordero',
  'conejo',
  'hamburguesas',
  'picada',
  'embutido',
  'bacón',
  'bacon',
  'salchicha',
  'jamón',
  'jamon',
  'charcutería',
  // Pescado y marisco
  'pescado',
  'marisco',
  // Bebidas
  'refresco',
  'agua',
  'cerveza',
  'vino',
  'zumo',
  // Pan y bollería
  'panadería',
  'bollería',
  'pan',
  // Fruta y verdura
  'fruta',
  'verdura',
  'hortalizas',
  'lechuga',
  // Lácteos y huevos
  'leche',
  'yogur',
  'queso',
  'huevos',
  // Aperitivos y postres
  'aperitivos',
  'snacks',
  'postres',
  'aceituna',
  'encurtid',
  // Despensa básica (para casa rural y condimentos)
  'aceite',
  'especia',
  'salsa',
  'azúcar',
  'café',
  'infusi',
  // Pasta, arroz y legumbres (muy socorrido, sobre todo en casa rural)
  'arroz',
  'pasta',
  'legumbre',
  'fideo',
  // Limpieza / hogar (papel de cocina, bolsas de basura)
  'papel',
  'celulosa',
  'basura',
  'limpieza',
];

async function api(path, postalCode) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Guestimate scraper)',
      // La cookie de almacén se deriva del código postal en la web real.
      // La API acepta el parámetro lang; el almacén por defecto suele
      // funcionar. Guardamos el CP para futuras mejoras.
      'X-Postal-Code': postalCode || '',
    },
  });
  if (!res.ok) {
    throw new Error(`Mercadona API ${res.status} en ${path}`);
  }
  return res.json();
}

// Descarga el árbol completo de categorías.
export async function fetchCategories(postalCode) {
  const data = await api('/categories/', postalCode);
  return data.results || [];
}

// Aplana el árbol de categorías a una lista de hojas {id, name}.
function flattenCategories(categories, acc = []) {
  for (const cat of categories) {
    if (cat.categories && cat.categories.length) {
      flattenCategories(cat.categories, acc);
    } else {
      acc.push({ id: cat.id, name: cat.name });
    }
  }
  return acc;
}

// Descarga los productos de una categoría concreta.
export async function fetchProductsByCategory(categoryId, postalCode) {
  const data = await api(`/categories/${categoryId}/`, postalCode);
  const products = [];
  for (const sub of data.categories || []) {
    for (const p of sub.products || []) {
      products.push(normalizeProduct(p));
    }
  }
  return products;
}

// Convierte un producto de la API de Mercadona al formato de
// nuestra tabla `products` de Supabase.
function normalizeProduct(p) {
  const pi = p.price_instructions || {};
  // bulk_price = precio por unidad de referencia (€/kg o €/L) → el bueno
  // para calcular cuánto cuesta una cantidad. unit_price = precio del
  // paquete entero (lo que pagas en caja por una unidad de producto).
  const refPrice = Number(pi.bulk_price) || Number(pi.unit_price) || null;
  const refFormat = (pi.reference_format || pi.size_format || 'ud').toUpperCase();
  return {
    external_id: p.id,
    name: p.display_name || p.name,
    price: refPrice,                            // €/kg, €/L o €/ud (referencia)
    unit: refFormat === 'L' ? 'L' : refFormat.toLowerCase(), // "kg" | "L" | "ud"
    pack_price: Number(pi.unit_price) || null,  // precio del paquete entero
    pack_size: pi.unit_size ?? null,            // tamaño del paquete (p.ej. 5)
    pack_format: pi.size_format || null,        // "kg" | "l" | "ud"
    category: p.categories?.[0]?.name || null,
    supermarket: 'mercadona',
    image_url: p.thumbnail || null,
  };
}

/**
 * Descarga todos los productos de las categorías relevantes.
 * Devuelve una lista lista para insertar en Supabase.
 *
 * @param {string} postalCode
 * @param {(msg: string) => void} [log] - callback opcional para mostrar progreso
 */
export async function scrapeRelevantProducts(postalCode, log = () => {}) {
  log('Descargando árbol de categorías...');
  const tree = await fetchCategories(postalCode);
  const leaves = flattenCategories(tree);

  // Nos quedamos con las hojas cuyo nombre encaja con lo que nos interesa.
  const wanted = leaves.filter((c) =>
    RELEVANT_CATEGORIES.some((kw) => c.name.toLowerCase().includes(kw))
  );
  log(`${wanted.length} categorías relevantes de ${leaves.length} totales.`);

  const all = [];
  const seen = new Set();
  for (const cat of wanted) {
    try {
      const products = await fetchProductsByCategory(cat.id, postalCode);
      for (const prod of products) {
        if (seen.has(prod.external_id)) continue;
        seen.add(prod.external_id);
        all.push(prod);
      }
      log(`  ✓ ${cat.name}: ${products.length} productos`);
      // Pequeña pausa para no machacar la API
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      log(`  ✗ ${cat.name}: ${err.message}`);
    }
  }

  log(`Total: ${all.length} productos únicos.`);
  return all;
}
