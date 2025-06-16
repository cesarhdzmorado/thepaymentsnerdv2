// web/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// These variables are pulled from your .env.local file.
// They are safe to use in the browser because we've enabled Row Level Security
// on our table, and the anon key has limited permissions.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// The '!' tells TypeScript that we are sure these variables will not be null.
// This is safe because Next.js loads .env.local for us.

export const supabase = createClient(supabaseUrl, supabaseAnonKey)