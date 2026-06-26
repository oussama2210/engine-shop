import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || '', {
  auth: { persistSession: false },
});

let _supabaseAdmin;
export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    if (!serviceRoleKey) {
      throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY');
    }
    _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return _supabaseAdmin;
}
