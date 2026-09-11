create extension if not exists "pgcrypto";

create type public.product_category as enum ('men', 'women');
create type public.product_status as enum ('in_stock', 'low_stock', 'out_of_stock', 'coming_soon');
create type public.order_status as enum ('new', 'confirmed', 'shipped', 'delivered', 'cancelled');

create table public.store_settings (
  id boolean primary key default true,
  delivery_fee numeric(12,2) not null default 0,
  whatsapp_number text not null default '',
  about_content jsonb not null default '{}'::jsonb,
  contact_content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  name jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  specifications jsonb not null default '{}'::jsonb,
  images jsonb not null default '[]'::jsonb,
  category public.product_category not null,
  price numeric(12,2) not null check (price >= 0),
  original_price numeric(12,2) check (original_price is null or original_price > price),
  stock integer not null default 0 check (stock >= 0),
  status public.product_status not null default 'out_of_stock',
  new_arrival boolean not null default false,
  featured boolean not null default false,
  bestseller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  pack_id uuid,
  title text not null,
  price numeric(12,2) not null check (price >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true
);

create table public.packs (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  price numeric(12,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer jsonb not null,
  delivery_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null check (total >= 0),
  status public.order_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_snapshot jsonb not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0)
);

insert into public.store_settings (id, whatsapp_number) values (true, '0603821176') on conflict (id) do nothing;

alter table public.store_settings enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.promotions enable row level security;
alter table public.packs enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "public can read catalog" on public.products for select using (true);
create policy "public can read images" on public.product_images for select using (true);
create policy "public can read active promotions" on public.promotions for select using (active = true);
create policy "public can read active packs" on public.packs for select using (active = true);
create policy "public can read settings" on public.store_settings for select using (true);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$ select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false) $$;

create policy "admins manage products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage images" on public.product_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage promotions" on public.promotions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage packs" on public.packs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage settings" on public.store_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read orders" on public.orders for select to authenticated using (public.is_admin());
create policy "admins update orders" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read order items" on public.order_items for select to authenticated using (public.is_admin());

create or replace function public.place_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  order_id uuid;
  order_number text := 'AX-' || upper(substr(encode(gen_random_bytes(5), 'hex'), 1, 8));
  item jsonb;
  current_product public.products;
  requested integer;
  fee numeric := coalesce((select delivery_fee from public.store_settings where id = true), 0);
  subtotal numeric := 0;
  total numeric;
begin
  for item in select * from jsonb_array_elements(payload->'items') loop
    select * into current_product from public.products where id = (item->>'product_id')::uuid for update;
    requested := (item->>'quantity')::integer;
    if current_product.id is null or current_product.status in ('out_of_stock', 'coming_soon') or current_product.stock < requested then
      raise exception 'PRODUCT_UNAVAILABLE:%', item->>'product_id';
    end if;
    subtotal := subtotal + current_product.price * requested;
  end loop;
  total := subtotal + fee;
  insert into public.orders (order_number, customer, delivery_fee, total) values (order_number, payload->'customer', fee, total) returning id into order_id;
  for item in select * from jsonb_array_elements(payload->'items') loop
    select * into current_product from public.products where id = (item->>'product_id')::uuid for update;
    insert into public.order_items (order_id, product_id, product_snapshot, quantity, unit_price) values (order_id, current_product.id, to_jsonb(current_product), (item->>'quantity')::integer, current_product.price);
    update public.products set stock = stock - (item->>'quantity')::integer, status = case when stock - (item->>'quantity')::integer <= 0 then 'out_of_stock'::product_status when stock - (item->>'quantity')::integer <= 2 then 'low_stock'::product_status else 'in_stock'::product_status end, updated_at = now() where id = current_product.id;
  end loop;
  return jsonb_build_object('id', order_id, 'order_number', order_number, 'delivery_fee', fee, 'total', total, 'whatsapp_number', (select whatsapp_number from public.store_settings where id = true));
end;
$$;

grant execute on function public.place_order(jsonb) to anon, authenticated;

-- Admin: upsert store settings (security definer to bypass RLS)
create or replace function public.admin_upsert_store_settings(
  p_delivery_fee numeric,
  p_whatsapp_number text,
  p_about_content jsonb default null,
  p_contact_content jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_about jsonb;
  current_contact jsonb;
begin
  if not public.is_admin() then raise exception 'ADMIN_UNAUTHORIZED'; end if;
  if p_delivery_fee is null or p_delivery_fee < 0 then
    raise exception 'INVALID_DELIVERY_FEE';
  end if;
  if p_whatsapp_number is null or trim(p_whatsapp_number) = '' then
    raise exception 'INVALID_WHATSAPP_NUMBER';
  end if;

  select about_content, contact_content into current_about, current_contact
  from public.store_settings where id = true;

  insert into public.store_settings (id, delivery_fee, whatsapp_number, about_content, contact_content, updated_at)
  values (true, p_delivery_fee, p_whatsapp_number,
          coalesce(p_about_content, current_about, '{}'::jsonb),
          coalesce(p_contact_content, current_contact, '{}'::jsonb),
          now())
  on conflict (id) do update set
    delivery_fee = p_delivery_fee,
    whatsapp_number = p_whatsapp_number,
    about_content = coalesce(p_about_content, current_about, '{}'::jsonb),
    contact_content = coalesce(p_contact_content, current_contact, '{}'::jsonb),
    updated_at = now();

  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function public.admin_upsert_store_settings(numeric, text, jsonb, jsonb) from public, anon;
grant execute on function public.admin_upsert_store_settings(numeric, text, jsonb, jsonb) to authenticated;

-- Admin: insert product (security definer to bypass RLS)
create or replace function public.admin_insert_product(
  p_id uuid,
  p_ref text,
  p_name jsonb,
  p_description jsonb,
  p_specifications jsonb,
  p_images jsonb,
  p_category public.product_category,
  p_price numeric,
  p_original_price numeric,
  p_stock integer,
  p_status public.product_status,
  p_new_arrival boolean,
  p_featured boolean,
  p_bestseller boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'ADMIN_UNAUTHORIZED'; end if;
  if p_ref is null or trim(p_ref) = '' then
    raise exception 'INVALID_REF';
  end if;
  if p_price is null or p_price < 0 then
    raise exception 'INVALID_PRICE';
  end if;
  if p_stock is null or p_stock < 0 then
    raise exception 'INVALID_STOCK';
  end if;
  if p_original_price is not null and p_original_price <= p_price then
    raise exception 'INVALID_ORIGINAL_PRICE';
  end if;

  insert into public.products (id, ref, name, description, specifications, images, category, price, original_price, stock, status, new_arrival, featured, bestseller, created_at, updated_at)
  values (p_id, p_ref, p_name, p_description, p_specifications, p_images, p_category, p_price, p_original_price, p_stock, coalesce(p_status, 'out_of_stock'), coalesce(p_new_arrival, false), coalesce(p_featured, false), coalesce(p_bestseller, false), now(), now());

  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function public.admin_insert_product(uuid, text, jsonb, jsonb, jsonb, jsonb, public.product_category, numeric, numeric, integer, public.product_status, boolean, boolean, boolean) from public, anon;
grant execute on function public.admin_insert_product(uuid, text, jsonb, jsonb, jsonb, jsonb, public.product_category, numeric, numeric, integer, public.product_status, boolean, boolean, boolean) to authenticated;

-- Admin: update product (security definer to bypass RLS)
create or replace function public.admin_update_product(
  p_id uuid,
  p_ref text,
  p_name jsonb,
  p_description jsonb,
  p_specifications jsonb,
  p_images jsonb,
  p_category public.product_category,
  p_price numeric,
  p_original_price numeric,
  p_stock integer,
  p_status public.product_status,
  p_new_arrival boolean,
  p_featured boolean,
  p_bestseller boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'ADMIN_UNAUTHORIZED'; end if;
  if p_ref is null or trim(p_ref) = '' then
    raise exception 'INVALID_REF';
  end if;
  if p_price is null or p_price < 0 then
    raise exception 'INVALID_PRICE';
  end if;
  if p_stock is null or p_stock < 0 then
    raise exception 'INVALID_STOCK';
  end if;
  if p_original_price is not null and p_original_price <= p_price then
    raise exception 'INVALID_ORIGINAL_PRICE';
  end if;

  update public.products
  set ref = p_ref,
      name = p_name,
      description = p_description,
      specifications = p_specifications,
      images = p_images,
      category = p_category,
      price = p_price,
      original_price = p_original_price,
      stock = p_stock,
      status = coalesce(p_status, 'out_of_stock'),
      new_arrival = coalesce(p_new_arrival, false),
      featured = coalesce(p_featured, false),
      bestseller = coalesce(p_bestseller, false),
      updated_at = now()
  where id = p_id;

  if not found then
    raise exception 'PRODUCT_NOT_FOUND';
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function public.admin_update_product(uuid, text, jsonb, jsonb, jsonb, jsonb, public.product_category, numeric, numeric, integer, public.product_status, boolean, boolean, boolean) from public, anon;
grant execute on function public.admin_update_product(uuid, text, jsonb, jsonb, jsonb, jsonb, public.product_category, numeric, numeric, integer, public.product_status, boolean, boolean, boolean) to authenticated;

-- Admin: delete product (security definer to bypass RLS)
create or replace function public.admin_delete_product(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'ADMIN_UNAUTHORIZED'; end if;
  delete from public.products where id = p_id;
  if not found then
    raise exception 'PRODUCT_NOT_FOUND';
  end if;
  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function public.admin_delete_product(uuid) from public, anon;
grant execute on function public.admin_delete_product(uuid) to authenticated;

create or replace function public.admin_update_order_status(p_order_number text, p_status public.order_status)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'ADMIN_UNAUTHORIZED'; end if;
  update public.orders set status = p_status where order_number = p_order_number;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  return jsonb_build_object('ok', true);
end;
$$;
revoke execute on function public.admin_update_order_status(text, public.order_status) from public, anon;
grant execute on function public.admin_update_order_status(text, public.order_status) to authenticated;

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do update set public = true;
create policy "public can read product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "admins manage product images" on storage.objects for all to authenticated using (bucket_id = 'product-images' and public.is_admin()) with check (bucket_id = 'product-images' and public.is_admin());

do $$ begin
  alter publication supabase_realtime add table public.products;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table public.store_settings;
exception when duplicate_object then null;
end $$;
