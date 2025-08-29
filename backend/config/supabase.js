import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Optional: initialize Supabase only if all required envs exist
let supabase = null;
let supabaseAdmin = null;

if (supabaseUrl && supabaseKey && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log("✅ Supabase clients initialized successfully");
  } catch (error) {
    console.error("❌ Supabase initialization failed:", error.message);
  }
} else {
  console.warn(
    "⚠️ Supabase env vars not set (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY). Continuing without Supabase.",
  );
}

export { supabase, supabaseAdmin };
