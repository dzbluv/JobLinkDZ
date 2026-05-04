// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Placeholder - we keep this prepared for later. Do NOT call during mock mode.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)