import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, PostgrestError } from '@supabase/supabase-js';
import { DatabaseSchema } from '@/types/supabase';
import { logger } from '@/utils/logger';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage =
    'Variáveis de ambiente Supabase não encontradas. Verifique seu arquivo .env (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY).';
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

const isClient = typeof window !== 'undefined';

export const supabase = createClient<DatabaseSchema>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isClient ? AsyncStorage : undefined,
    autoRefreshToken: isClient,
    persistSession: isClient,
    detectSessionInUrl: false,
  },
});
export type SupabaseQueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: PostgrestError };
export type SupabaseSingleQueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: PostgrestError };
export type SupabaseCountResult =
  | { count: number; error: null }
  | { count: null; error: PostgrestError };
