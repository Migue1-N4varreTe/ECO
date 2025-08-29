-- Enable RLS and add minimal policies aligned with backend (service role bypasses RLS)

-- PRODUCTS
alter table if exists public.products enable row level security;
create policy if not exists p_products_select_authenticated
  on public.products for select
  to authenticated
  using (is_active is true);

-- CATEGORIES
alter table if exists public.categories enable row level security;
create policy if not exists p_categories_select_authenticated
  on public.categories for select
  to authenticated
  using (is_active is true);

-- CARTS (JSON cart by user)
alter table if exists public.carts enable row level security;
create policy if not exists p_carts_select_own
  on public.carts for select
  to authenticated
  using (user_id = auth.uid());
create policy if not exists p_carts_update_own
  on public.carts for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy if not exists p_carts_insert_self
  on public.carts for insert
  to authenticated
  with check (user_id = auth.uid());

-- CUSTOMERS (reads allowed from client; writes via service role)
alter table if exists public.customers enable row level security;
create policy if not exists p_customers_select_authenticated
  on public.customers for select
  to authenticated
  using (is_active is true);

-- ORDERS (reads by cashier only; writes via service role)
alter table if exists public.orders enable row level security;
create policy if not exists p_orders_select_cashier
  on public.orders for select
  to authenticated
  using (cashier_id = auth.uid());

-- ORDER ITEMS (read items of cashier's orders)
alter table if exists public.order_items enable row level security;
create policy if not exists p_order_items_select_cashier
  on public.order_items for select
  to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_id and o.cashier_id = auth.uid()
  ));

-- COUPONS (reads valid ones; writes via service role)
alter table if exists public.coupons enable row level security;
create policy if not exists p_coupons_select_valid
  on public.coupons for select
  to authenticated
  using (is_active is true and (valid_until is null or valid_until >= now()));

-- AUDIT LOGS (service role only)
alter table if exists public.audit_logs enable row level security;
-- no policies => only service role can access

-- TEMPORARY PERMISSIONS (service role only)
alter table if exists public.temporary_permissions enable row level security;
-- no policies => only service role can access

-- PROFILES / USER PROFILES (optional read)
alter table if exists public.profiles enable row level security;
create policy if not exists p_profiles_select_own
  on public.profiles for select
  to authenticated
  using (user_id = auth.uid());
