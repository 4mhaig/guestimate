// =============================================================
// CONEXIÓN A SUPABASE
// =============================================================
// Crea el cliente de Supabase usando las claves del archivo .env
// Si no hay claves configuradas, devuelve null (modo "solo local").
// =============================================================

import { createClient } from '@supabase/supabase-js';

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key || url.includes('TU-PROYECTO')) {
    return null;
  }
  return createClient(url, key);
}
