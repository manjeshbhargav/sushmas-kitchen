import React, { useState, useEffect } from 'react';
import { useRecipes } from '../context/RecipeContext';
import { X, ChefHat, CheckSquare, Layers, Copy, Check } from 'lucide-react';
import rawRecipes from '../../recipes.json';

export const RecipeDetail: React.FC = () => {
  const {
    selectedRecipe,
    setSelectedRecipe,
  } = useRecipes();

  // Step checkoff tracking (local state so it resets when opening a new recipe)
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Copy feedback state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCompletedSteps([]);
    setActiveStepIndex(0);
    setCopied(false);
  }, [selectedRecipe]);

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

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!selectedRecipe) return null;

  const handleCopyJson = async () => {
    const original = (rawRecipes as any[]).find(r => r.title === selectedRecipe.title);
    const jsonToCopy = original ? JSON.stringify(original, null, 2) : JSON.stringify({
      title: selectedRecipe.title,
      category: selectedRecipe.category,
      ingredients: selectedRecipe.ingredients,
      method: selectedRecipe.method
    }, null, 2);

    try {
      await navigator.clipboard.writeText(jsonToCopy);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy JSON: ', err);
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
              className={`modal-copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopyJson}
              aria-label="Copy recipe JSON to clipboard"
              title="Copy recipe JSON"
              id="copy-recipe-json-btn"
            >
              {copied ? <Check size={18} style={{ color: 'var(--accent-cardamom)' }} /> : <Copy size={18} />}
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
    </div>
  );
};
