
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Build time fallback to prevent crash if variables are missing
// This allows the build to succeed, but runtime will fail if variables are still missing
const url = supabaseUrl || 'https://example.com';
const key = supabaseAnonKey || 'example-key';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Missing Supabase environment variables! The app will not function correctly.');
}

export const supabase = createClient(url, key);
