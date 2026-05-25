import React from 'react';
import type { Recipe } from '../types/recipe';
import { useRecipes } from '../context/RecipeContext';
import { RecipeThumbnail } from './RecipeThumbnail';
import { RecipeCardContent } from './RecipeCardContent';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { setSelectedRecipe } = useRecipes();

  const handleOpenRecipe = () => {
    setSelectedRecipe(recipe);
  };

  return (
    <div
      className="recipe-card"
      onClick={handleOpenRecipe}
      id={`recipe-card-${recipe.id}`}
      role="button"
    >
      <RecipeThumbnail recipe={recipe} />
      <RecipeCardContent recipe={recipe} />
    </div>
  );
};
