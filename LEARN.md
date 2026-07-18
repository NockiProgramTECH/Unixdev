# 📚 Fiche d'apprentissage — Unixdev

Ce fichier recense les concepts, outils et bonnes pratiques que tu es en train d'apprendre ou que tu ne maîtrises pas encore. L'objectif est de centraliser tout ce qu'il faut connaître pour devenir autonome sur ce projet.

---

## 🎨 Tailwind CSS v4 — Nouveautés

La version 4 de Tailwind CSS change pas mal de choses par rapport à la v3 que tu as peut-être déjà vue.

### Syntaxe d'import (fini les `@tailwind`)

**Avant (v3) :**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Maintenant (v4) :**
```css
@import "tailwindcss";
```

### Plugins (daisyUI, etc.)

**Avant (v3) :** dans `tailwind.config.js`
```js
plugins: [require("daisyui")]
```

**Maintenant (v4) :** directement dans le CSS
```css
@plugin "daisyui";
```

**Configurer des thèmes :**
```css
@plugin "daisyui" {
  theme: ["colors", "dark"]
}
```

### Fini `tailwind.config.js`

Dans Tailwind v4, tout se fait via CSS ou avec le fichier `@theme` :
```css
@theme {
  --color-red-500: #ef4444;
  --font-family-sans: "Inter", sans-serif;
}
```

> ⚠️ **À retenir :** il n'y a PAS de fichier `tailwind.config.js` dans ce projet. Toute personnalisation se fait dans `index.css` avec `@theme`.

---

## 🔥 daisyUI v5

daisyUI est une bibliothèque de composants CSS qui fonctionne **par-dessus** Tailwind.

### Composants disponibles
- `btn`, `navbar`, `card`, `hero`, `input`, `modal`, `dropdown`, etc.
- Voir la doc officielle : https://daisyui.com/components/

### Exemples utilisés ici
```tsx
<button className="btn bg-red-500">Bouton</button>
<div className="navbar bg-base-100 shadow-sm">...</div>
```

### Classes de thème utiles
- `bg-base-100` → fond principal
- `bg-base-200` → fond secondaire
- `text-base-content` → texte principal
- `bg-primary`, `text-primary`, etc.

> ⚠️ daisyUI en v5 ne fonctionne que si Tailwind v4 est bien configuré. Vérifie que `@plugin "daisyui"` est bien dans `index.css`.

---

## ⚛️ React — Hooks essentiels

### `useState` — Gérer un état local

```tsx
import { useState } from "react";

const [count, setCount] = useState(0);
setCount(count + 1);       // méthode directe
setCount(prev => prev + 1); // méthode fonctionnelle (recommandée si tu dépends de l'état précédent)
```

**Ton projet utilise `useState`** dans `TypeWriter.tsx` que je viens d'ajouter.

### `useEffect` — Effets de bord

```tsx
useEffect(() => {
  // code exécuté APRÈS le rendu
  const timer = setTimeout(() => setCount(count + 1), 1000);
  return () => clearTimeout(timer); // nettoyage
}, [count]); // dépendances : se relance quand count change
```

> ⚠️ Toujours **nettoyer** les timers, event listeners et abonnements dans le `return` du `useEffect` pour éviter les fuites mémoire.

### `useCallback` — Éviter de recréer une fonction

```tsx
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []); // [] = la fonction est créée une seule fois
```

Utilisé dans `TypeWriter.tsx` pour stabilité de la fonction `tick`.

---

## 🧠 TypeScript — Les bases pour ce projet

### Interfaces et types

```tsx
// Interface (pour les objets, props)
interface CardProps {
  icon: ReactNode;
  paragraph: string;
  title?: string; // ? = optionnel
}

// Type alias (pour les unions, primitives)
type Status = "actif" | "inactif" | "en-attente";
```

### Bonnes pratiques

✅ **Les noms d'interfaces en PascalCase** : `CardProps` pas `carprobs`
✅ **Typage des composants** :
```tsx
export default function Card({ icon, paragraph }: CardProps) { ... }
```

### Types et interfaces intégrés utiles

| Type | Utilité |
|------|---------|
| `ReactNode` | Tout ce que React peut afficher |
| `React.FC<Props>` | Type pour un composant fonctionnel |
| `JSX.Element` | Un élément JSX rendu |
| `React.MouseEvent` | Événement de clic typé |

---

## 🧱 Structure de projet et bonnes pratiques

### Organisation des fichiers

```
src/
├── components/    ← Tes composants React (navbar, card, TypeWriter...)
├── App.tsx        ← Composant racine
├── main.tsx       ← Point d'entrée (render React)
├── index.css      ← Styles globaux + config Tailwind/daisyUI
```

### Séparation des responsabilités

**Avant (tout dans App.tsx) :**
```tsx
// App.tsx contient Navbar + Hero + Section Expertise + Footer...
```

**Après (idéal) :**
```
src/
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx        ← Nouveau : toute la section hero
│   ├── TypeWriter.tsx   ← Nouveau
│   ├── ExpertiseSection.tsx ← Nouveau : "Nos domaines d'expertise"
│   └── Card.tsx
```

> 🎯 **Objectif :** chaque fichier fait **une seule chose** et la fait bien.

---

## 📸 Images et assets

### Chemin des images dans Vite

Les fichiers dans `/public` sont servis à la **racine**.

✅ **Correct :**
```tsx
<img src="/back.png" alt="" />
```

❌ **Incorrect :**
```tsx
<img src="/public/back.png" alt="" />  // NE MARCHE PAS !!!
```

### `public/` vs `src/assets/`

| Dossier | Usage | Accès dans le code |
|---------|-------|-------------------|
| `public/` | Images statiques, favicons, fichiers qui ne changent pas | `/image.png` |
| `src/assets/` | Images importées dans le JS | `import img from "./assets/img.png"` |

### Attribut `alt` obligatoire

Toujours mettre un `alt` descriptif pour l'accessibilité :
```tsx
<img src="/back.png" alt="Illustration hero Unixdev" />
```

---

## 🎬 Animations CSS

### `@keyframes`

```css
@keyframes nom-animation {
  0%   { opacity: 0; transform: translateY(-10px); }
  50%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(10px); }
}
```

### Animation sur un élément

```css
.mon-element {
  animation: nom-animation 2s ease-in-out infinite;
}
```

### L'animation que j'ai ajoutée

```css
@keyframes blink {
  0%, 50%  { opacity: 1; }   /* curseur visible */
  51%, 100% { opacity: 0; }  /* curseur invisible */
}
```

### Propriétés d'animation à connaître

| Propriété | Rôle | Exemple |
|-----------|------|---------|
| `animation-name` | Nom du `@keyframes` | `blink` |
| `animation-duration` | Durée d'un cycle | `0.8s` |
| `animation-timing-function` | Accélération | `step-end`, `ease-in-out` |
| `animation-iteration-count` | Répétitions | `infinite`, `3` |
| `animation-delay` | Délai avant début | `1s` |

---

## 🖌️ Astuces CSS/Tailwind utiles

### Texte avec dégradé (gradient text)

```tsx
<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500">
  Texte arc-en-ciel
</span>
```

### Transformation `hover` fluide

```tsx
<button className="hover:-translate-y-1 transition duration-300">
```

### Verre dépoli (glassmorphism)

```tsx
<div className="backdrop-blur-xs bg-white/10 border border-white/20">
```

---

## 🔧 Outils et config

### Vite

Ton projet utilise **Vite 8** comme bundler. Commandes utiles :

```bash
npm run dev       # Lancement en développement
npm run build     # Construction pour production
npm run preview   # Prévisualisation du build
npm run lint      # Vérification du code
```

### ESLint

Le projet est configuré avec ESLint + TypeScript. Les règles sont dans `eslint.config.js`.

Pour que ESLint s'active dans VS Code : installe l'extension **ESLint** et assure-toi que `eslint.validate` inclut `typescript` et `typescriptreact`.

---

## 🧪 Suggestions d'améliorations pour le projet

- [ ] **Corriger les chemins d'images** : `src="/back.png"` au lieu de `src="/public/back.png"`
- [ ] **Renommer `carprobs` → `CardProps`** en PascalCase
- [ ] **Corriger `Exemple` → `Example`** (orthographe)
- [ ] **Extraire le Hero** dans un composant séparé `Hero.tsx`
- [ ] **Ajouter des `aria-label`** sur les boutons et liens pour l'accessibilité
- [ ] **Utiliser des balises HTML sémantiques** (`<header>`, `<main>`, `<section>`, `<footer>`)

---

## 📖 Ressources

| Sujet | Lien |
|-------|------|
| Tailwind CSS v4 (doc officielle) | https://tailwindcss.com/docs |
| daisyUI v5 composants | https://daisyui.com/components/ |
| React 19 doc | https://react.dev/learn |
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/ |
| Vite guide | https://vite.dev/guide/ |
| Lucide Icons | https://lucide.dev/icons/ |

---

> **Note :** Ce fichier est amené à évoluer. Ajoute au fur et à mesure les concepts que tu découvres. Tu peux aussi ouvrir une issue ou me demander de compléter une section précise.
