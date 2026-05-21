import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Recipe } from '../types/recipe';
import rawRecipes from '../../recipes.json';

interface RecipeContextType {
  recipes: Recipe[];
  categories: { name: string; count: number }[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeIngredients: string[];
  addIngredientFilter: (ingredient: string) => void;
  removeIngredientFilter: (ingredient: string) => void;
  clearIngredientFilters: () => void;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) throw new Error('useRecipes must be used within a RecipeProvider');
  return context;
};

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize recipes with IDs and difficulties (retaining all recipes)
  const [recipes] = useState<Recipe[]>(() => {
    return (rawRecipes as any[]).map((r, index) => {
      let category = r.category && r.category.trim() !== '' ? r.category.trim() : 'Uncategorized';
      if (category.toLowerCase() === 'uncategorized') {
        category = 'Uncategorized';
      }
      // Normalize duplicate title to Uncategorized category
      if (r.title.toLowerCase().replace(/[^a-z0-9]+/g, '') === 'kattusarulemonrasam') {
        category = 'Uncategorized';
      }
      return {
        ...r,
        category,
        id: `${r.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `recipe-${index}`}-${index}`,
        difficulty: r.ingredients.length > 12 ? 'Complex' : r.ingredients.length > 6 ? 'Medium' : 'Easy',
        prepTime: r.ingredients.length > 10 ? '45 mins' : r.ingredients.length > 5 ? '30 mins' : '15 mins',
      };
    });
  });

  // 2. Extract unique categories and counts (excluding "Uncategorized" category pill)
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  useEffect(() => {
    const counts: Record<string, number> = {};
    recipes.forEach(r => {
      const cat = r.category ? r.category.trim() : '';
      if (cat !== '') {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    const list = Object.entries(counts).map(([name, count]) => ({ name, count }));
    // Sort categories alphabetically
    list.sort((a, b) => a.name.localeCompare(b.name));
    setCategories([{ name: 'All', count: recipes.length }, ...list]);
  }, [recipes]);

  // 3. Helper for slugifying category names
  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const findCategoryBySlug = (slug: string) => {
    if (!slug || slug === 'all') return 'All';
    const allCategories = Array.from(new Set(recipes.map(r => r.category)));
    const matched = allCategories.find(cat => slugify(cat) === slug);
    return matched || 'All';
  };

  // 4. States for filters (initialized from URL pathname synchronously)
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    if (segments.length >= 1) {
      const slug = segments[0];
      if (slug === 'all') return 'All';
      const allCategories = Array.from(new Set(recipes.map(r => r.category)));
      const matched = allCategories.find(cat => {
        return cat.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug;
      });
      return matched || 'All';
    }
    return 'All';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeIngredients, setActiveIngredients] = useState<string[]>([]);
  
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(() => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    if (segments.length >= 2) {
      const recipeId = segments[1];
      return recipes.find(r => r.id === recipeId) || null;
    }
    return null;
  });

  // Clear search query when selected category changes
  useEffect(() => {
    setSearchQuery('');
  }, [selectedCategory]);

  // Sync URL to React state on Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const segments = window.location.pathname.split('/').filter(Boolean);
      let cat = 'All';
      let rec: Recipe | null = null;

      if (segments.length === 1) {
        cat = findCategoryBySlug(segments[0]);
      } else if (segments.length >= 2) {
        cat = findCategoryBySlug(segments[0]);
        const recipeId = segments[1];
        rec = recipes.find(r => r.id === recipeId) || null;
      }

      setSelectedCategory(cat);
      setSelectedRecipe(rec);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [recipes]);

  // Sync React state to URL (pushState) with infinite-loop prevention guard
  useEffect(() => {
    const catSlug = slugify(selectedCategory);
    let newPath = `/${catSlug}`;
    if (selectedRecipe) {
      newPath += `/${selectedRecipe.id}`;
    }

    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  }, [selectedCategory, selectedRecipe]);



  // Filter actions
  const addIngredientFilter = (ing: string) => {
    const clean = ing.trim().toLowerCase();
    if (clean && !activeIngredients.includes(clean)) {
      setActiveIngredients(prev => [...prev, clean]);
    }
  };

  const removeIngredientFilter = (ing: string) => {
    setActiveIngredients(prev => prev.filter(x => x !== ing));
  };

  const clearIngredientFilters = () => {
    setActiveIngredients([]);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeIngredients,
        addIngredientFilter,
        removeIngredientFilter,
        clearIngredientFilters,
        selectedRecipe,
        setSelectedRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
