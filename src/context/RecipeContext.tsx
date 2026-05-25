import { createContext, useContext } from 'react';
import type { Recipe } from '../types/recipe';

export interface RecipeContextType {
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

export const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) throw new Error('useRecipes must be used within a RecipeProvider');
  return context;
};

