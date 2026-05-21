---
name: sushmas-kitchen-dev
description: |
  A specialized skill for developing, debugging, and extending the "Sushma's Kitchen" React + TypeScript web application.
  This skill guides the creation of a premium recipe blog interface powered by local JSON recipe data.

  Trigger immediately for:
  - Scaffolding the React + TypeScript app in the workspace.
  - Developing recipe lists, search filters, and detail pages.
  - Implementing premium Vanilla CSS themes (glassmorphism, micro-animations, HSL custom properties, dark mode).
  - Building interactive features like interactive cooking mode checklists.
---

# Skill: Developing "Sushma's Kitchen" Recipe Blog

This skill provides comprehensive instructions, technical patterns, and visual design standards for building "Sushma's Kitchen" — a premium, state-of-the-art React + TypeScript recipe blog.

---

## 1. Project Scaffolding & Setup

When initializing a new React + TypeScript application in this workspace, follow these setup rules to ensure clean scaffolding:

### Non-Interactive App Creation
To scaffold the application using Vite without prompting the user, execute:
```bash
# Verify the template options first if needed
npx create-vite@latest --help

# Create the project in a subdirectory or root (adjust target directory as needed)
# To create inside a folder named 'sushmas-kitchen-web':
npx -y create-vite@latest sushmas-kitchen-web --template react-ts
```

### Dependency Installation
Use lightweight, robust libraries only when necessary. Avoid styling frameworks like TailwindCSS (unless explicitly requested).
```bash
npm install lucide-react   # For premium minimalist icons
```

---

## 2. Directory & Architecture Conventions

Organize the React + TypeScript codebase systematically using standard semantic folders:

```
sushmas-kitchen-web/
├── public/
│   └── recipes.json        # Unified recipe dataset
├── src/
│   ├── assets/             # Generated premium UI images & icons
│   ├── types/
│   │   └── recipe.ts       # TypeScript interfaces
│   ├── styles/
│   │   ├── variables.css   # HSL custom properties, typography & theme tokens
│   │   ├── reset.css       # Custom reset & base styles
│   │   ├── layout.css      # Grid, masonry & flex utility layouts
│   │   └── components.css  # Card, modal, list, and navbar component styles
│   ├── components/
│   │   ├── RecipeCard.tsx  # Glassmorphic card displaying title, tag, ingredients
│   │   ├── Explorer.tsx    # Category carousel filter
│   │   └── RecipeDetail.tsx# Detail drawer/modal with cooking checklist
│   ├── context/
│   │   └── RecipeContext.tsx # Centralized React Context for filter state, favorites & list
│   ├── App.tsx
│   └── main.tsx
```

---

## 3. Data Integration & Type Definitions

The application consumes recipe data loaded from `recipes.json`. Implement full type safety with the following TypeScript definitions:

### `src/types/recipe.ts`
```typescript
export interface Ingredient {
  item: string;
  quantity: string;
}

export interface Recipe {
  title: string;
  category: string;
  ingredients: Ingredient[];
  method: string;
  // Added helper properties for interactive states
  id: string;          // Auto-generated hash or slug from title
  prepTime?: string;   // Optional metadata if parsed or estimated
  difficulty?: 'Easy' | 'Medium' | 'Complex'; // Deduced from ingredient/step count
}


```

### Recipe Schema Parsing Helper
Ensure every recipe is assigned a stable unique ID upon load by slugifying the title. Retain all recipes in the master list, standardizing empty or null categories to `'Uncategorized'`. When generating unique category list pills, exclude the `'Uncategorized'` category so that these recipes are only visible under the `'All'` view. For instance, in your `RecipeContext`:
```typescript
import rawRecipes from '../../recipes.json';

const recipes: Recipe[] = (rawRecipes as any[]).map((r, index) => ({
  ...r,
  category: r.category && r.category.trim() !== '' ? r.category : 'Uncategorized',
  id: r.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `recipe-${index}`,
  difficulty: r.ingredients.length > 12 ? 'Complex' : r.ingredients.length > 6 ? 'Medium' : 'Easy'
}));
```

---

## 4. Premium Visual Design System

"Sushma's Kitchen" must look and feel exceptionally premium, modern, and responsive. Implement a high-fidelity visual theme using **Vanilla CSS Custom Properties**.

### Design Principles
1. **Mobile-First Responsiveness**: All styling must be written mobile-first! Base styles must define layout and presentation for mobile viewports (e.g. single-column stack, large tap targets, optimized padding). Progressively enhance layout scaling using `min-width` media queries (e.g., `@media (min-width: 768px)` for tablet, `@media (min-width: 1024px)` for desktop). Avoid using `max-width` queries to downscale desktop-first designs.
2. **Glassmorphism**: Use sophisticated frosted glass panels (`backdrop-filter: blur(16px)`) with thin, glowing semi-transparent borders for cards and overlays.
3. **Harmonious Palette**: Warm, inviting tones inspired by Indian spices, combined with ultra-modern dark modes.
4. **Smooth Typography**: Rely on clean modern fonts: `Outfit` (for luxury headers) and `Inter` (for readable, crisp body text).

### `src/styles/variables.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap');

:root {
  /* Color Palette - Light Mode */
  --bg-primary: #fcfbfa;
  --bg-secondary: #f4f1eb;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.4);
  
  --text-main: #2b2723;
  --text-muted: #6b6359;
  
  /* Indian Spice Colors */
  --accent-saffron: #f28b30;     /* Saffron gold */
  --accent-saffron-glow: rgba(242, 139, 48, 0.15);
  --accent-cardamom: #4e8062;    /* Cardamom green */
  --accent-tamarind: #c44b38;    /* Warm sienna */
  
  --border-radius-sm: 8px;
  --border-radius-md: 16px;
  --border-radius-lg: 24px;
  --shadow-premium: 0 8px 32px 0 rgba(43, 39, 35, 0.06);
  --transition-smooth: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Color Palette - Dark Mode */
    --bg-primary: #12100f;
    --bg-secondary: #1a1715;
    --glass-bg: rgba(26, 23, 21, 0.6);
    --glass-border: rgba(255, 255, 255, 0.08);
    
    --text-main: #f5f2ee;
    --text-muted: #aba398;
    
    --accent-saffron: #ffa14a;
    --accent-saffron-glow: rgba(255, 161, 74, 0.2);
    --accent-cardamom: #6cb088;
    --accent-tamarind: #e0634e;
    
    --shadow-premium: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  }
}
```

### Example Glassmorphic Card & Mobile-First Grid Styling
```css
/* --- Mobile-First Layout Scaffolding --- */

/* Base Styles: Single-Column Layout for Mobile */
.recipe-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
}

/* Tablet Layout (768px and up) */
@media (min-width: 768px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 1.5rem;
  }
}

/* Desktop Layout (1024px and up) */
@media (min-width: 1024px) {
  .recipe-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

/* Glassmorphic Component Styles */
.recipe-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  padding: 1.25rem; /* Cozy touch targets for mobile */
  box-shadow: var(--shadow-premium);
  transition: var(--transition-smooth);
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

/* Progressive hover effects for pointer-capable devices */
@media (hover: hover) {
  .recipe-card {
    padding: 1.5rem; /* Slightly roomier styling on desktop */
  }
  
  .recipe-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--accent-saffron), var(--accent-tamarind));
    opacity: 0;
    transition: var(--transition-smooth);
  }

  .recipe-card:hover {
    transform: translateY(-6px);
    border-color: var(--accent-saffron);
    box-shadow: 0 12px 40px var(--accent-saffron-glow);
  }

  .recipe-card:hover::before {
    opacity: 1;
  }
}
```

---

## 5. Core Interface & Interaction Requirements

The application must deliver an immersive user experience, avoiding a basic list-and-display layout. Ensure the following rich features are fully built:

### A. The Header Search & Recipe Explorer
* **Header Search Bar**: Premium fuzzy search input integrated directly into the top bar for maximum accessibility and modern aesthetic. It filters recipes instantly on recipe title only.
* **Category Carousel**: Display categories (Chaats, Curries, Rice Items, Breakfast, Traditional, Salads and Soups, etc.) as clean glassmorphic pills with counts in the Explorer panel.



### C. Step-by-Step Interactive Cooking Mode
* Instead of showing the `method` as a block of text, parse sentences or break down by punctuation (e.g., splitting by periods `.`) to present a clean checklist.
* Allow users to click/tap a step to mark it as completed, shifting focus, applying an elegant strike-through, and highlighting the *current* active step with a subtle warm saffron border.
* Provide an optional "Focus Mode" that hides all other UI elements, showing one step at a time in massive, legible typography.



---

## 6. SEO & Performance Rules

Automatically implement best practices on all pages:
* **Unique IDs**: Attach explicit unique IDs to all interactive elements (`#search-input`, `#recipe-tab-traditional`) to ease automation, manual testing, and assistive technologies.
* **Semantic Markups**: Use `<header>`, `<main>`, `<article>`, `<aside>`, and `<footer>` appropriately.
* **Autofocus and Accessibility**: Add keyboard navigational hooks (tabs) for standard modals, and clear contrast levels matching WCAG AA standards.
* **Performant Images**: Optimize image loads and implement SVGs or generated gradient placeholders for fallback representations where recipes have no direct assets.
