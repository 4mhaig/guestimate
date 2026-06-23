// =============================================================
// SCRIPT: descargar precios de Mercadona
// =============================================================
// Cómo se usa (desde la terminal, dentro de la carpeta del proyecto):
//
//   npm run scrape
//
// Qué hace:
//   1. Descarga los productos relevantes de la API de Mercadona.
//   2. Los guarda en data/products.json (siempre).
//   3. Si tienes Supabase configurado en .env, también los sube a
//      la tabla `products`.
// =============================================================

import 'dotenv/config';
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { scrapeRelevantProducts } from '../src/scraper/mercadona.js';
import { getSupabase } from '../src/supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

async function main() {
  const postalCode = process.env.MERCADONA_POSTAL_CODE || '28001';
  console.log(`🛒 Guestimate — scraper de Mercadona (CP ${postalCode})\n`);

  const products = await scrapeRelevantProducts(postalCode, (msg) => console.log(msg));

  // 1) Guardar siempre en local (creamos la carpeta data/ si no existe)
  const outPath = join(ROOT, 'data', 'products.json');
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(products, null, 2), 'utf8');
  console.log(`\n💾 Guardado en ${outPath}`);

  // 2) Subir a Supabase si está configurado
  const supabase = getSupabase();
  if (!supabase) {
    console.log('\nℹ️  Supabase no configurado (.env). Solo se guardó en local.');
    console.log('   Cuando crees tu proyecto Supabase, rellena .env y vuelve a ejecutar.');
    return;
  }

  console.log('\n⬆️  Subiendo productos a Supabase...');
  // Limpiamos los de Mercadona y volvemos a insertar (datos frescos)
  await supabase.from('products').delete().eq('supermarket', 'mercadona');

  const rows = products.map((p) => ({
    name: p.name,
    price: p.price,
    unit: p.unit,
    category: p.category,
    supermarket: p.supermarket,
    image_url: p.image_url,
    updated_at: new Date().toISOString(),
  }));

  // Insertamos por lotes para no exceder límites
  const BATCH = 500;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { error } = await supabase.from('products').insert(chunk);
    if (error) {
      console.error('   ✗ Error subiendo lote:', error.message);
    } else {
      console.log(`   ✓ Subidos ${Math.min(i + BATCH, rows.length)}/${rows.length}`);
    }
  }
  console.log('\n✅ Listo.');
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
