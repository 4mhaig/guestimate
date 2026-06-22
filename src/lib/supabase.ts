import { createClient } from "@supabase/supabase-js";

const url = "https://zdpirtkbfsebivsgngct.supabase.co";
const anonKey = "sb_publishable_z0dzqFL_r7rYHV8iZzg_LQ_5zCIVfPL";

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});