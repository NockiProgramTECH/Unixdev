# Guide d'installation

## 1. Créer un compte Supabase (gratuit)

1. Va sur [supabase.com](https://supabase.com)
2. Clique sur **"Start your project"**
3. Connecte-toi avec ton compte GitHub
4. Crée un **nouveau projet** :
   - Nom : `unixdev`
   - Database Password : choisis un mot de passe fort
   - Region : **West Europe** (le plus proche)
5. Attends ~2 minutes que la base de données soit créée

## 2. Récupérer les clés Supabase

1. Dans le dashboard Supabase, va dans **Project Settings → API**
2. Note ces 3 valeurs :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Exécuter la migration SQL

1. Dans Supabase, va dans **SQL Editor**
2. Clique sur **"New query"**
3. Copie tout le contenu du fichier `supabase/migration.sql`
4. Exécute la requête (clique sur **Run**)
5. ✅ Les tables `projects`, `project_files`, `orders` sont créées

## 4. Créer les buckets de stockage (fichiers)

1. Dans Supabase, va dans **Storage**
2. Crée un bucket nommé **`executables`** (public : **non**)
3. Crée un bucket nommé **`documentation`** (public : **non**)
4. Va dans **Storage → Policies** et ajoute ces règles :

### Bucket "executables"

```sql
-- Les acheteurs peuvent télécharger
create policy "Download by purchasers"
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

-- Les admins peuvent uploader
create policy "Upload by admins"
on storage.objects for insert
with check (
  bucket_id = 'executables'
  and auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
);
```

Applique la même chose pour le bucket **`documentation`**.

## 5. Activer l'authentification

1. Dans Supabase, va dans **Authentication → Providers**
2. Vérifie que **Email** est activé
3. **Disable "Confirm email"** si tu veux que les utilisateurs soient connectés immédiatement après inscription (optionnel)

## 6. Configurer les variables d'environnement

1. Copie `.env.template` vers `.env`
2. Remplis toutes les valeurs :
   ```
   VITE_SUPABASE_URL=https://ton-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=ton-anon-key
   SUPABASE_SERVICE_ROLE_KEY=ton-service-role-key
   VITE_ADMIN_EMAIL=ton-email@gmail.com
   ```
3. **Ne commite jamais le fichier `.env`** (il est déjà dans `.gitignore`)

## 7. Déploiement sur Vercel

1. Pousse le code sur GitHub
2. Va sur [vercel.com](https://vercel.com)
3. Importe le dépôt
4. Ajoute les variables d'environnement dans **Settings → Environment Variables**
   (les mêmes que dans `.env`)
5. Déploie ✅

## 8. Ajouter des projets

Option A : **Via l'interface admin**
- Va sur ton site → `/admin` (connecte-toi avec ton email admin)
- Clique sur "Nouveau projet"
- Remplis les informations

Option B : **Directement dans Supabase**
- Va dans **Table Editor** → table `projects`
- Clique sur **Insert row**
- Ajoute un projet (titre, slug, prix, etc.)

Prochainement : interface admin complète avec upload de fichiers.
