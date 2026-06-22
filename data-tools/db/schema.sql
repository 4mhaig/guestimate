-- =============================================================
-- Guestimate — Schema de base de datos (Supabase / PostgreSQL)
-- =============================================================
-- Cómo usarlo:
--   1. Entra en tu proyecto de Supabase (supabase.com)
--   2. Menú lateral → "SQL Editor" → "New query"
--   3. Pega TODO este archivo y pulsa "Run"
-- =============================================================

-- Extensión para generar UUIDs (suele venir activada en Supabase)
create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- Productos (poblada por el scraper de Mercadona)
-- -------------------------------------------------------------
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price       numeric,
  unit        text,          -- "kg", "ud", "L", "pack"
  category    text,          -- "carne", "bebida", "pan", etc.
  supermarket text default 'mercadona',
  image_url   text,
  updated_at  timestamptz default now()
);

create index if not exists idx_products_category on products (category);
create index if not exists idx_products_supermarket on products (supermarket);

-- -------------------------------------------------------------
-- Eventos
-- -------------------------------------------------------------
create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  type         text not null,   -- barbacoa | comida_familiar | cumpleanos | cena_amigos | nochebuena | casa_rural
  date         date,
  people       jsonb,           -- [{age:35, sex:"M"}, ...] o {hombre:4, mujer:3, ...}
  restrictions jsonb,           -- ["celiaco", "vegano", ...]
  days         int,             -- solo casa_rural
  meals_config jsonb,           -- solo casa_rural
  created_at   timestamptz default now(),
  user_id      uuid             -- nullable: empezamos sin login
);

-- -------------------------------------------------------------
-- Listas de la compra generadas
-- -------------------------------------------------------------
create table if not exists shopping_lists (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid references events(id) on delete cascade,
  items      jsonb,    -- [{product_id, name, quantity, unit, price_mercadona}]
  total      numeric,
  created_at timestamptz default now()
);

-- -------------------------------------------------------------
-- Feedback post-evento (para que la herramienta aprenda)
-- -------------------------------------------------------------
create table if not exists feedback (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid references events(id) on delete cascade,
  rating        int check (rating between 1 and 5),
  food_accuracy text,   -- "sobro_mucho" | "sobro_algo" | "perfecto" | "falto_algo" | "falto_mucho"
  notes         text,
  created_at    timestamptz default now()
);

-- =============================================================
-- Seguridad (RLS)
-- =============================================================
-- Para el MVP sin login, dejamos lectura/escritura pública en las
-- tablas que usa el frontend. Cuando añadas auth, endurece esto.
-- -------------------------------------------------------------
alter table products       enable row level security;
alter table events         enable row level security;
alter table shopping_lists enable row level security;
alter table feedback       enable row level security;

-- Productos: lectura pública (solo el scraper escribe, con service key)
create policy "products_read_public" on products
  for select using (true);

-- Eventos / listas / feedback: acceso público mientras no haya login
create policy "events_all_public" on events
  for all using (true) with check (true);

create policy "shopping_lists_all_public" on shopping_lists
  for all using (true) with check (true);

create policy "feedback_all_public" on feedback
  for all using (true) with check (true);
