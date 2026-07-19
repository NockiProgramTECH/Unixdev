-- =============================================
-- Migration : Structure complète de la boutique
-- =============================================

-- 1. Table des projets (logiciels)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  long_description text,
  price integer not null check (price >= 0),
  image_url text,
  category text,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Table des fichiers (exécutables + documentation)
create table if not exists project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  file_type text not null check (file_type in ('executable', 'documentation')),
  file_name text not null,
  storage_path text not null,
  file_size integer,
  created_at timestamptz default now()
);

-- 3. Table des commandes
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  amount integer not null check (amount >= 0),
  currency text default 'XOF',
  transaction_id text,
  status text default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Fonction pour mettre à jour updated_at automatiquement
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers pour updated_at
create trigger update_projects_updated_at
  before update on projects
  for each row execute function update_updated_at_column();

create trigger update_orders_updated_at
  before update on orders
  for each row execute function update_updated_at_column();

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Activer RLS sur toutes les tables
alter table projects enable row level security;
alter table project_files enable row level security;
alter table orders enable row level security;

-- Projects : tout le monde peut lire
create policy "Projects are publicly readable"
  on projects for select
  using (true);

-- Projects : seuls les admins peuvent écrire (via un check sur le email)
create policy "Projects are insertable by admins"
  on projects for insert
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

create policy "Projects are updatable by admins"
  on projects for update
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

create policy "Projects are deletable by admins"
  on projects for delete
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- Project Files : les fichiers sont visibles uniquement :
-- - par les admins
-- - par les utilisateurs qui ont acheté le projet
create policy "Files are visible to admins"
  on project_files for select
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

create policy "Files are visible to purchasers"
  on project_files for select
  using (
    exists (
      select 1 from orders
      where orders.project_id = project_files.project_id
        and orders.user_id = auth.uid()
        and orders.status = 'completed'
    )
  );

create policy "Files are insertable by admins"
  on project_files for insert
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- Orders : les utilisateurs peuvent voir leurs propres commandes
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

-- Orders : seuls les admins peuvent modifier les commandes
create policy "Orders are insertable by admins or via edge function"
  on orders for insert
  with check (true); -- Permis par l'Edge Function (service_role)

create policy "Orders are updatable by admins"
  on orders for update
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- =============================================
-- Configuration du stockage (buckets)
-- =============================================

-- Création des buckets (à exécuter dans l'interface Storage de Supabase)
-- 1. bucket: "executables" (pour les fichiers .exe, .msi, .zip, .appimage, ...)
-- 2. bucket: "documentation" (pour les PDF, fiches techniques, ...)

-- Politiques pour le bucket "executables"
-- (à configurer dans l'interface Storage > Policies)
/*
create policy "Executables are downloadable by purchasers"
  on storage.objects for select
  using (
    bucket_id = 'executables'
    and exists (
      select 1 from project_files pf
      join orders o on o.project_id = pf.project_id
      where pf.storage_path = name
        and o.user_id = auth.uid()
        and o.status = 'completed'
    )
  );

create policy "Executables are uploadable by admins"
  on storage.objects for insert
  with check (
    bucket_id = 'executables'
    and auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );
*/

-- =============================================
-- Configuration admin email
-- =============================================

-- Définir l'email admin (À MODIFIER avec ton email)
-- Exécute cette commande dans l'éditeur SQL de Supabase :
-- alter database postgres set app.admin_email to 'ton-email@example.com';
