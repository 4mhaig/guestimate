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

// Envía un "enlace mágico" al email: el usuario lo abre y entra (sin contraseña).
export function signInWithEmail(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });
}

export function signOut() {
  return supabase.auth.signOut();
}