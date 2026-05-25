import React, { useState, useEffect } from 'react';
import { useRecipes } from '../context/RecipeContext';
import { X, ChefHat, CheckSquare, Layers, Share2, Check } from 'lucide-react';
import { RecipeThumbnail } from './RecipeThumbnail';

export const RecipeDetail: React.FC = () => {
  const {
    selectedRecipe,
    setSelectedRecipe,
  } = useRecipes();

  // Step checkoff tracking (local state so it resets when opening a new recipe)
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Share overlay states
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (selectedRecipe) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedRecipe]);

  // Handle escape key listener for dismissing share sub-modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsShareOpen(false);
      }
    };
    if (isShareOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isShareOpen]);

  useEffect(() => {
    if (shareCopied) {
      const timer = setTimeout(() => setShareCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [shareCopied]);

  if (!selectedRecipe) return null;

  const handleShareClick = async () => {
    const shareData = {
      title: selectedRecipe.title,
      text: `Check out this delicious recipe: ${selectedRecipe.title} on Sushma's Kitchen!`,
      url: window.location.href,
    };

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or failed:', err);
      }
    } else {
      setIsShareOpen(true);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  };

  // Support both the array of strings format and a fallback split for string data
  const formattedSteps = Array.isArray(selectedRecipe.method)
    ? selectedRecipe.method
    : (selectedRecipe.method as unknown as string)
        .split(/\.\s+/)
        .map(step => step.trim())
        .filter(step => step.length > 0);

  const handleStepToggle = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(prev => prev.filter(i => i !== index));
    } else {
      setCompletedSteps(prev => [...prev, index]);
      // Set the next uncompleted step as active automatically
      if (index === activeStepIndex && index < formattedSteps.length - 1) {
        setActiveStepIndex(index + 1);
      }
    }
  };



  return (
    <div 
      className="modal-overlay" 
      onClick={() => setSelectedRecipe(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-recipe-title"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="modal-header">
          <div>
            <span className="recipe-card-category" style={{ fontSize: '0.8rem' }}>
              {selectedRecipe.category}
            </span>
            <h2 id="modal-recipe-title" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {selectedRecipe.title}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              className="modal-share-btn" 
              onClick={handleShareClick}
              aria-label="Share recipe"
              title="Share recipe"
              id="share-recipe-btn"
            >
              <Share2 size={18} />
            </button>
            <button 
              className="modal-close-btn" 
              onClick={() => setSelectedRecipe(null)}
              aria-label="Close details"
              id="close-recipe-modal"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Scroll Body */}
        <div className="modal-body">
          <div className="modal-body-left">
            <RecipeThumbnail
              recipe={selectedRecipe}
              lazy={false}
              className="modal-recipe-image-wrapper"
              imageClassName="modal-recipe-image"
              fallbackIconSize={36}
            />

            {/* Grid Layout - Ingredients */}
            <section className="detail-section">
              <h3 className="detail-section-title">
                <ChefHat size={18} />
                Ingredients
              </h3>
              <ul className="ingredients-list" id="modal-ingredients-list">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="ingredient-item">
                    <span className="ingredient-item-name">{ing.item}</span>
                    {ing.quantity && (
                      <span className="ingredient-item-qty">
                        ({ing.quantity})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Grid Layout - Step Checklist (Cooking Mode) */}
          <section className="detail-section">
            <h3 className="detail-section-title">
              <Layers size={18} />
              Recipe
            </h3>
            <div className="method-checklist" id="modal-method-checklist">
              {formattedSteps.map((step, idx) => {
                const isCompleted = completedSteps.includes(idx);
                const isActive = activeStepIndex === idx;
                
                return (
                  <div
                    key={idx}
                    className={`method-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active-step' : ''}`}
                    onClick={() => handleStepToggle(idx)}
                    role="checkbox"
                    aria-checked={isCompleted}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleStepToggle(idx);
                      }
                    }}
                    id={`method-step-${idx}`}
                  >
                    <div className="method-checkbox">
                      {isCompleted && <CheckSquare size={12} />}
                    </div>
                    <div className="method-step-text">
                      {step}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* Desktop Share Modal Overlay */}
      {isShareOpen && (
        <div 
          className="share-modal-overlay"
          onClick={() => setIsShareOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div 
            className="share-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="share-modal-header">
              <h3 id="share-modal-title">Share Recipe</h3>
              <button 
                className="share-modal-close-btn"
                onClick={() => setIsShareOpen(false)}
                aria-label="Close share panel"
                id="close-share-modal"
              >
                <X size={16} />
              </button>
            </div>
            <p className="share-modal-desc">Copy the link below to share this recipe with others:</p>
            <div className="share-input-group">
              <input 
                type="text" 
                className="share-url-input" 
                value={window.location.href} 
                readOnly 
                onClick={(e) => (e.target as HTMLInputElement).select()}
                id="share-url-input"
              />
              <button 
                className={`share-copy-btn ${shareCopied ? 'copied' : ''}`}
                onClick={handleCopyUrl}
                aria-label="Copy recipe link to clipboard"
                id="share-copy-btn"
              >
                {shareCopied ? (
                  <>
                    <Check size={16} />
                    <span>Copied</span>
                  </>
                ) : (
                  <span>Copy</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
