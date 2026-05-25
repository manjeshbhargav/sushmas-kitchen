import React, { useState, useEffect, useRef } from 'react';
import type { Recipe } from '../types/recipe';
import { useRecipes } from '../context/RecipeContext';
import { ChefHat, Leaf, Nut, UtensilsCrossed } from 'lucide-react';
import { isVegan, containsNuts } from '../utils/dietary';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { setSelectedRecipe } = useRecipes();

  const handleOpenRecipe = () => {
    setSelectedRecipe(recipe);
  };

  const vegan = isVegan(recipe.ingredients);
  const hasNuts = containsNuts(recipe.ingredients);

  // Reset states if recipe ID changes (runs during render)
  const [prevId, setPrevId] = useState(recipe.id);
  const [imgFailed, setImgFailed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (recipe.id !== prevId) {
    setPrevId(recipe.id);
    setImgFailed(false);
    setIsVisible(false);
    setIsLoading(true);
  }

  const cardRef = useRef<HTMLDivElement>(null);

  // Set up intersection observer to lazy-load thumbnail when visible
  useEffect(() => {
    if (isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isVisible, recipe.id]);

  // Dynamically resolve image URL
  let imageUrl = null;
  try {
    imageUrl = new URL(`../assets/recipes/${recipe.id}.webp`, import.meta.url).href;
  } catch {
    // If not found, resolves to null
  }

  return (
    <div
      ref={cardRef}
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
      <div className="recipe-card-image-wrapper">
        {!imgFailed && imageUrl ? (
          <>
            {isVisible && (
              <img
                src={imageUrl}
                alt={recipe.title}
                className={`recipe-card-image ${isLoading ? 'is-loading' : 'is-loaded'}`}
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setImgFailed(true);
                  setIsLoading(false);
                }}
              />
            )}
            {isVisible && isLoading && (
              <div className="recipe-card-loader-container">
                <div className="circular-loader" aria-label="Loading image" />
              </div>
            )}
          </>
        ) : (
          <div className="recipe-card-fallback-logo">
            <div className="fallback-logo-icon-wrapper">
              <UtensilsCrossed size={28} className="fallback-logo-icon" />
            </div>
          </div>
        )}
      </div>

      <div className="recipe-card-content">
        <div className="recipe-card-meta">
          <span className="recipe-card-category">{recipe.category}</span>
        </div>

        <h3 className="recipe-card-title">{recipe.title}</h3>

        <div className="recipe-card-footer">
          <span className="recipe-card-ing-count">
            <ChefHat size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            {recipe.ingredients.length} Ingredients
          </span>
          {(vegan || hasNuts) && (
            <div className="recipe-card-dietary-flags">
              {vegan && (
                <span className="dietary-flag vegan" title="Vegan">
                  <Leaf size={12} className="flag-icon" />
                </span>
              )}
              {hasNuts && (
                <span className="dietary-flag nuts" title="Contains Nuts">
                  <Nut size={12} className="flag-icon" />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


