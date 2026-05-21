import React from 'react';
import { useRecipes } from '../context/RecipeContext';

export const Explorer: React.FC = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory
  } = useRecipes();

  return (
    <section className="explorer-header" id="recipe-explorer-panel">
      {/* 1. Category Carousel */}
      <div className="carousel-outer" id="category-carousel">
        <ul className="category-list">
          {categories.map((cat) => (
            <li key={cat.name}>
              <button
                className={`category-pill ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
                id={`category-pill-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat.name}
                <span className="pill-count">{cat.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

