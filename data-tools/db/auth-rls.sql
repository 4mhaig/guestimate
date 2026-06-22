-- =============================================================
-- Guestimate — Seguridad por usuario (login con Google)
-- =============================================================
-- Ejecuta TODO esto en Supabase → SQL Editor → New query → Run.
-- Hace que cada usuario solo vea/gestione SUS eventos, listas y feedback.
-- =============================================================

-- 1) Asegurar la columna user_id en events (por si no existe)
alter table events add column if not exists user_id uuid;

-- 2) Quitar las políticas "públicas" antiguas
drop policy if exists "events_all_public" on events;
drop policy if exists "shopping_lists_all_public" on shopping_lists;
drop policy if exists "feedback_all_public" on feedback;

-- 3) EVENTS: cada usuario solo los suyos
create policy "events_own_select" on events
  for select using (auth.uid() = user_id);
create policy "events_own_insert" on events
  for insert with check (auth.uid() = user_id);
create policy "events_own_update" on events
  for update using (auth.uid() = user_id);
create policy "events_own_delete" on events
  for delete using (auth.uid() = user_id);

-- 4) SHOPPING_LISTS: ligadas al dueño del evento
create policy "lists_own_all" on shopping_lists
  for all
  using (exists (select 1 from events e where e.id = shopping_lists.event_id and e.user_id = auth.uid()))
  with check (exists (select 1 from events e where e.id = shopping_lists.event_id and e.user_id = auth.uid()));

-- 5) FEEDBACK: ligado al dueño del evento
create policy "feedback_own_all" on feedback
  for all
  using (exists (select 1 from events e where e.id = feedback.event_id and e.user_id = auth.uid()))
  with check (exists (select 1 from events e where e.id = feedback.event_id and e.user_id = auth.uid()));

-- products: la lectura sigue siendo pública (ya está creada en schema.sql).
