import { createClient } from "@supabase/supabase-js";

const url = "https://zdpirtkbfsebivsgngct.supabase.co";
const anonKey = "sb_publishable_z0dzqFL_r7rYHV8iZzg_LQ_5zCIVfPL";

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true, // mantener la sesión al recargar
    autoRefreshToken: true,
    detectSessionInUrl: true, // procesar el redirect de Google al volver
  },
});

// Inicia sesión con Google (redirige a Google y vuelve a la app).
export function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
}

export function signOut() {
  return supabase.auth.signOut();
}