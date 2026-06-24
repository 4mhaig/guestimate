import { createClient } from "@supabase/supabase-js";

const url = "https://zdpirtkbfsebivsgngct.supabase.co";
const anonKey = "sb_publishable_z0dzqFL_r7rYHV8iZzg_LQ_5zCIVfPL";

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true, // mantener la sesión al recargar
    autoRefreshToken: true,
    detectSessionInUrl: true, // procesar el enlace mágico al volver
    flowType: "implicit", // robusto para magic link aunque se abra en otro navegador
  },
});

// Envía al email un código de 6 dígitos (y también un enlace, según la
// plantilla). El usuario escribe el código en la misma pantalla: así no se
// sale de la web ni se recarga, y no se pierde la lista en curso.
export function signInWithEmail(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });
}

// Verifica el código de 6 dígitos que el usuario ha recibido por email.
export function verifyEmailOtp(email: string, token: string) {
  return supabase.auth.verifyOtp({ email, token, type: "email" });
}

export function signOut() {
  return supabase.auth.signOut();
}