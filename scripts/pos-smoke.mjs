import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const API_URL = process.env.API_URL || process.env.VITE_API_URL || 'http://localhost:5000';

const TEST_EMAIL = process.env.TEST_EMAIL || 'le.tester+123@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'LaEco123!';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureAuthUser() {
  // Try sign-in first
  const signin = await supabase.auth.signInWithPassword({ email: TEST_EMAIL, password: TEST_PASSWORD });
  if (signin.data?.session?.access_token) {
    return signin.data.session.access_token;
  }

  if (!SUPABASE_SERVICE_KEY) {
    throw new Error('Sign-in failed and SUPABASE_SERVICE_KEY not set to create the user');
  }

  // Create user via admin
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  const meta = { role: 'LEVEL_1_CASHIER', level: 1, is_active: true, first_name: 'LE', last_name: 'Tester' };
  const { data, error } = await admin.auth.admin.createUser({ email: TEST_EMAIL, password: TEST_PASSWORD, email_confirm: true, user_metadata: meta });
  if (error && !String(error.message || '').toLowerCase().includes('already')) {
    throw error;
  }
  // Try sign-in again
  const signin2 = await supabase.auth.signInWithPassword({ email: TEST_EMAIL, password: TEST_PASSWORD });
  if (!signin2.data?.session?.access_token) {
    throw new Error('Failed to sign in test user after creation');
  }
  return signin2.data.session.access_token;
}

async function ensureCategory(name = 'Pruebas') {
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  let { data: cats } = await admin.from('categories').select('id,name').eq('name', name).limit(1);
  if (cats && cats[0]) return cats[0].id;
  const { data: created, error } = await admin.from('categories').insert([{ name, description: 'Categoría de pruebas', color: '#3b82f6', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]).select('id').single();
  if (error) throw new Error('No se pudo crear categoría: ' + error.message);
  return created.id;
}

async function ensureProduct() {
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  const sku = 'POS-SMOKE-001';
  const { data: existing } = await admin.from('products').select('id, sku').eq('sku', sku).limit(1);
  if (existing && existing[0]) return existing[0].id;
  const category_id = await ensureCategory();
  const { data: created, error } = await admin.from('products').insert([{ name: 'Refresco 600ml (SMOKE)', description: 'Producto de prueba para POS', price: 25.5, cost: 18.0, sku, barcode: '7500000000001', category_id, stock_quantity: 50, min_stock: 5, unit: 'pieza', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]).select('id').single();
  if (error) throw new Error('No se pudo crear producto: ' + error.message);
  return created.id;
}

async function api(path, opts = {}) {
  const res = await fetch(`${API_URL}${path}`, opts);
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}: ${txt}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

async function run() {
  console.log('> POS smoke: ensuring auth user...');
  const token = await ensureAuthUser();
  console.log('> POS smoke: ensuring product...');
  const productId = await ensureProduct();

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  console.log('> POS smoke: clearing cart...');
  await api('/api/sales/cart/clear', { method: 'DELETE', headers });

  console.log('> POS smoke: adding item to cart...');
  await api('/api/sales/cart/add-item', { method: 'POST', headers, body: JSON.stringify({ product_id: productId, quantity: 2 }) });

  console.log('> POS smoke: reading current cart...');
  const current = await api('/api/sales/cart/current', { headers });
  console.log('Cart summary:', current.cart?.summary || current.summary || current);

  console.log('> POS smoke: checkout...');
  const sale = await api('/api/sales/checkout', { method: 'POST', headers, body: JSON.stringify({ payment_method: 'efectivo' }) });
  const saleId = sale.sale?.id || sale.id || sale.sale_id;
  console.log('Sale:', sale);

  console.log('> POS smoke: fetching receipt (html)...');
  const html = await api(`/api/sales/receipt/${saleId}?format=html`, { headers });
  console.log('Receipt HTML length:', (html || '').length);

  console.log('OK');
}

run().catch((e) => {
  console.error('POS smoke failed:', e);
  process.exit(1);
});
