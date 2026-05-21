import React, { useState } from 'react';
import { RecipeProvider, useRecipes } from './context/RecipeContext';
import { CategoryDrawer } from './components/CategoryDrawer';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetail } from './components/RecipeDetail';
import { UtensilsCrossed, Search, Menu } from 'lucide-react';

// Unified imports for our Vanilla CSS styling layers
import './styles/variables.css';
import './styles/reset.css';
import './styles/layout.css';
import './styles/components.css';

const MainAppFrame: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    recipes,
    selectedCategory,
    searchQuery,
    setSearchQuery,
  } = useRecipes();

  // Filtering Engine - Category & Search Queries
  const filteredRecipes = recipes.filter(recipe => {
    const isUncategorized = recipe.category === 'Uncategorized';

    // 1. Uncategorized restriction:
    // Uncategorized recipes are ONLY visible under 'All' or 'Uncategorized' filters.
    // They are completely excluded from all other specific category filters (e.g. Breakfast).
    if (isUncategorized) {
      if (selectedCategory !== 'All' && selectedCategory !== 'Uncategorized') {
        return false;
      }
    }

    // 2. Category Filter for standard categorized recipes
    if (!isUncategorized) {
      if (selectedCategory !== 'All' && recipe.category !== selectedCategory) {
        return false;
      }
    }

    // 3. Search Query Filter (Matches title only)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (!recipe.title.toLowerCase().includes(query)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="app-layout">
      {/* Navbar Header */}
      <nav className="navbar" id="app-nav">
        <div className="container navbar-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="navbar-menu-btn" 
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open categories drawer"
              id="navbar-menu-btn"
            >
              <Menu size={22} />
            </button>
            <div className="logo" id="app-logo">
              <UtensilsCrossed size={22} style={{ color: 'var(--accent-saffron)', flexShrink: 0 }} />
              <span className="logo-text">Sushma's Kitchen</span>
            </div>
          </div>
          
          {/* Top Search Bar */}
          <div className="search-wrapper navbar-search" id="navbar-search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search by recipe title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="search-input"
            />
            <Search size={18} className="search-icon" />
          </div>
          

        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="main-content">
        <div className="container">

          {/* Recipe Grid Layout */}
          <section style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {selectedCategory === 'All' ? 'All Recipes' : selectedCategory}
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing {filteredRecipes.length} recipes
              </span>
            </div>

            {filteredRecipes.length > 0 ? (
              <div className="recipe-grid" id="recipe-cards-grid">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'var(--glass-bg)',
                borderRadius: 'var(--border-radius-lg)',
                border: '1px dashed var(--glass-border)',
                color: 'var(--text-muted)'
              }} id="no-recipes-fallback">
                <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  No recipes found matching your filters
                </p>
                <p style={{ fontSize: '0.85rem' }}>
                  Try refining your search query or removing some ingredient filters!
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal Drawer Overlays */}
      <CategoryDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <RecipeDetail />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <RecipeProvider>
      <MainAppFrame />
    </RecipeProvider>
  );
};

export default App;
