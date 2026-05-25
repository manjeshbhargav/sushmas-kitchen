import React, { useState } from 'react';
import type { Recipe } from '../types/recipe';
import { UtensilsCrossed } from 'lucide-react';
import { useVisibilityRef } from '../hooks/useVisibilityRef';

interface RecipeThumbnailProps {
  recipe: Recipe;
  lazy?: boolean;
  className?: string;
  imageClassName?: string;
  fallbackIconSize?: number;
}

export const RecipeThumbnail: React.FC<RecipeThumbnailProps> = ({
  recipe,
  lazy = true,
  className = 'recipe-card-image-wrapper',
  imageClassName = 'recipe-card-image',
  fallbackIconSize = 28,
}) => {
  const [prevId, setPrevId] = useState(recipe.id);
  const [imgFailed, setImgFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (recipe.id !== prevId) {
    setPrevId(recipe.id);
    setImgFailed(false);
    setIsLoading(true);
  }

  // Hook must be called unconditionally to comply with Rules of Hooks
  const [cardRef, isVisible] = useVisibilityRef<HTMLDivElement>(recipe.id);
  const showImage = lazy ? isVisible : true;

  // Dynamically resolve image URL
  let imageUrl = null;
  try {
    imageUrl = new URL(`../assets/recipes/${recipe.id}.webp`, import.meta.url).href;
  } catch {
    // If not found, resolves to null
  }

  return (
    <div ref={lazy ? cardRef : null} className={className}>
      {!imgFailed && imageUrl ? (
        <>
          {showImage && (
            <img
              src={imageUrl}
              alt={recipe.title}
              className={`${imageClassName} ${isLoading ? 'is-loading' : 'is-loaded'}`}
              loading={lazy ? 'lazy' : 'eager'}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setImgFailed(true);
                setIsLoading(false);
              }}
            />
          )}
          {showImage && isLoading && (
            <div className="recipe-card-loader-container">
              <div className="circular-loader" aria-label="Loading image" />
            </div>
          )}
        </>
      ) : (
        <div className="recipe-card-fallback-logo">
          <div className="fallback-logo-icon-wrapper">
            <UtensilsCrossed size={fallbackIconSize} className="fallback-logo-icon" />
          </div>
        </div>
      )}
    </div>
  );
};

