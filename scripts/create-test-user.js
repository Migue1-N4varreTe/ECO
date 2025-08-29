#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = process.env.TEST_EMAIL || 'le.tester+123@example.com';
const password = process.env.TEST_PASSWORD || 'LaEco123!';

async function ensureUser() {
  try {
    const meta = {
      name: 'LE Tester',
      first_name: 'LE',
      last_name: 'Tester',
      role: 'LEVEL_1_CASHIER',
      level: 1,
      is_active: true,
    };

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: meta,
    });

    if (error) {
      if (String(error.message || '').toLowerCase().includes('already')) {
        // Try to locate existing user by iterating pages
        let page = 1;
        let found = null;
        while (!found) {
          const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
          if (listErr) throw listErr;
          found = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
          if (!found && list.users.length < 1000) break;
          page += 1;
        }
        if (found) {
          await supabase.auth.admin.updateUserById(found.id, {
            password,
            user_metadata: meta,
          });
          console.log('Updated existing user:', email);
          return;
        }
        throw error;
      }
      throw error;
    }

    console.log('Created user:', data.user?.email);
  } catch (e) {
    console.error('Failed to ensure user:', e);
    process.exit(1);
  }
}

ensureUser();
