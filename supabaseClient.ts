import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient<Database> | null =
  supabaseUrl && supabaseAnonKey ? createClient<Database>(supabaseUrl, supabaseAnonKey) : null;

export const supabaseInitializationError: string | null = !supabase
  ? "Supabase credentials are not configured in this environment. To run this app, create a Supabase project and add your Project URL and anon key as VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
  : null;