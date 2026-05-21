import type { Recipe } from '../types/recipe';
import { useRecipes } from '../context/RecipeContext';
import { ArrowUpRight, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { setSelectedRecipe } = useRecipes();

  // Create ingredients list string preview (first 4 items)
  const previewLimit = 4;
  const previewIngredients = recipe.ingredients.slice(0, previewLimit).map(i => i.item).join(', ');
  const remainingCount = recipe.ingredients.length - previewLimit;
  const ingredientsString = remainingCount > 0 
    ? `${previewIngredients} + ${remainingCount} more` 
    : previewIngredients;

  const handleOpenRecipe = () => {
    setSelectedRecipe(recipe);
  };

  return (
    <div 
      className="recipe-card" 
      onClick={handleOpenRecipe}
      id={`recipe-card-${recipe.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleOpenRecipe();
        }
      }}
    >
      <div className="recipe-card-meta">
        <span className="recipe-card-category">{recipe.category}</span>
      </div>

      <h3 className="recipe-card-title">{recipe.title}</h3>
      
      <p className="recipe-card-ingredients-preview">
        {ingredientsString}
      </p>

      <div className="recipe-card-footer">
        <span className="recipe-card-ing-count">
          <ChefHat size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          {recipe.ingredients.length} Ingredients
        </span>
        <span className="recipe-card-link">
          View Recipe <ArrowUpRight size={14} />
        </span>
      </div>
    </div>
  );
};
