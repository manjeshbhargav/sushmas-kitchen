import React, { useState } from 'react';
import { RecipeProvider, useRecipes } from './context/RecipeContext';
import { CategoryDrawer } from './components/CategoryDrawer';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetail } from './components/RecipeDetail';
import { UtensilsCrossed, Search, Menu, Leaf, Nut, X, Ban } from 'lucide-react';
import { isVegan, containsNuts } from './utils/dietary';

// Unified imports for our Vanilla CSS styling layers
import './styles/variables.css';
import './styles/reset.css';
import './styles/layout.css';
import './styles/components.css';

const MainAppFrame: React.FC = () => {
  type DietaryFilter = 'vegan' | 'not-vegan' | 'contains-nuts' | 'nut-free';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<DietaryFilter[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const FILTER_OPTIONS = [
    { id: 'vegan' as DietaryFilter, label: 'Vegan', icon: <Leaf size={14} className="flag-icon vegan" /> },
    {
      id: 'not-vegan' as DietaryFilter,
      label: 'Not Vegan',
      icon: (
        <div style={{ display: 'inline-flex', position: 'relative', width: '14px', height: '14px', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Leaf size={14} className="flag-icon non-vegan" style={{ color: 'currentColor', opacity: 0.5 }} />
          <Ban size={10} style={{ position: 'absolute', color: '#f44336', opacity: 0.9, strokeWidth: 3 }} />
        </div>
      )
    },
    { id: 'contains-nuts' as DietaryFilter, label: 'Contains Nuts', icon: <Nut size={14} className="flag-icon nuts" /> },
    {
      id: 'nut-free' as DietaryFilter,
      label: 'Nut Free',
      icon: (
        <div style={{ display: 'inline-flex', position: 'relative', width: '14px', height: '14px', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Nut size={14} className="flag-icon nut-free" style={{ color: '#4caf50', opacity: 0.5 }} />
          <Ban size={10} style={{ position: 'absolute', color: '#2196f3', opacity: 0.9, strokeWidth: 3 }} />
        </div>
      )
    },
  ];

  const handleAddFilter = (filterId: DietaryFilter) => {
    setActiveFilters(prev => {
      let updated = [...prev];
      if (filterId === 'vegan') {
        updated = updated.filter(f => f !== 'not-vegan');
      } else if (filterId === 'not-vegan') {
        updated = updated.filter(f => f !== 'vegan');
      } else if (filterId === 'contains-nuts') {
        updated = updated.filter(f => f !== 'nut-free');
      } else if (filterId === 'nut-free') {
        updated = updated.filter(f => f !== 'contains-nuts');
      }

      if (!updated.includes(filterId)) {
        updated.push(filterId);
      }
      return updated;
    });
    setIsDropdownOpen(false);
  };

  const handleRemoveFilter = (filterId: DietaryFilter) => {
    setActiveFilters(prev => prev.filter(f => f !== filterId));
  };
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

    // 3. Search Query Filter (Matches title and category)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesTitle = recipe.title.toLowerCase().includes(query);
      const matchesCategory = recipe.category.toLowerCase().includes(query);

      if (!matchesTitle && !matchesCategory) {
        return false;
      }
    }

    // 4. Dietary Pills Filter
    const isVeganRecipe = isVegan(recipe.ingredients);
    const hasNuts = containsNuts(recipe.ingredients);

    for (const filter of activeFilters) {
      if (filter === 'vegan' && !isVeganRecipe) return false;
      if (filter === 'not-vegan' && isVeganRecipe) return false;
      if (filter === 'contains-nuts' && !hasNuts) return false;
      if (filter === 'nut-free' && hasNuts) return false;
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
              placeholder="Search by recipe title or category..."
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                  {selectedCategory === 'All' ? 'All Recipes' : selectedCategory}
                </h2>
                
                <div className="dietary-filter-container">
                  {activeFilters.map(filterId => {
                    const option = FILTER_OPTIONS.find(o => o.id === filterId);
                    if (!option) return null;
                    return (
                      <div key={filterId} className={`dietary-active-pill ${filterId}`} id={`active-pill-${filterId}`}>
                        {option.icon}
                        <span>{option.label}</span>
                        <button 
                          onClick={() => handleRemoveFilter(filterId)} 
                          className="remove-pill-btn" 
                          aria-label={`Remove ${option.label} filter`}
                          id={`remove-pill-${filterId}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    );
                  })}
                  
                  <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <button 
                      className="dietary-add-pill" 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      aria-haspopup="true"
                      aria-expanded={isDropdownOpen}
                      aria-label="Add dietary filter"
                      title="Dietary Restriction"
                      id="add-dietary-filter-btn"
                    >
                      <div style={{ display: 'inline-flex', gap: '3.5px', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {/* Custom Fork SVG */}
                        <svg width="6" height="14" viewBox="0 0 8 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
                          <path d="M4 10v9" />
                          <path d="M1 10V5a3 3 0 0 1 6 0v5" />
                          <path d="M4 5V1" />
                          <path d="M1 1v4" />
                          <path d="M7 1v4" />
                        </svg>
                        {/* Custom Spoon SVG */}
                        <svg width="6" height="14" viewBox="0 0 8 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
                          <path d="M4 11v8" />
                          <rect x="1" y="1" width="6" height="10" rx="3" fill="none" />
                        </svg>
                      </div>
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="dietary-dropdown-menu" role="menu" id="dietary-dropdown-menu">
                        {FILTER_OPTIONS.map(opt => {
                          const isActive = activeFilters.includes(opt.id);
                          return (
                            <button
                              key={opt.id}
                              className={`dietary-dropdown-item ${opt.id} ${isActive ? 'active' : ''}`}
                              onClick={() => handleAddFilter(opt.id)}
                              disabled={isActive}
                              role="menuitem"
                              id={`dropdown-item-${opt.id}`}
                            >
                              {opt.icon}
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
