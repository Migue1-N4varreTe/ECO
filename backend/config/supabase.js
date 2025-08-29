import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Initialize public and admin clients independently
let supabase = null;
let supabaseAdmin = null;

try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    console.log("✅ Supabase public client initialized");
  }

  if (supabaseUrl && supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log("✅ Supabase admin client initialized");
  }

  if (!supabase && !supabaseAdmin) {
    console.warn(
      "⚠️ Supabase env vars not set (SUPABASE_URL, SUPABASE_ANON_KEY and/or SUPABASE_SERVICE_KEY). Continuing without Supabase.",
    );
  }
} catch (error) {
  console.error("❌ Supabase initialization failed:", error.message);
}

// Prefer service role for backend operations
if (supabaseAdmin) {
  supabase = supabaseAdmin;
  console.log("✅ Using service role client for backend operations");
}

export { supabase, supabaseAdmin };
