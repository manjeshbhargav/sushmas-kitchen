import React from 'react';
import { useRecipes } from '../context/RecipeContext';
import { X, FolderOpen } from 'lucide-react';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryDrawer: React.FC<CategoryDrawerProps> = ({ isOpen, onClose }) => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory
  } = useRecipes();

  return (
    <div 
      className={`drawer-overlay ${isOpen ? 'open' : ''}`} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div 
        className={`drawer-content ${isOpen ? 'open' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <header className="drawer-header">
          <h2 id="drawer-title" style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderOpen size={18} style={{ color: 'var(--accent-saffron)' }} />
            Categories
          </h2>
          <button 
            className="drawer-close-btn" 
            onClick={onClose}
            aria-label="Close categories menu"
            id="close-category-drawer"
          >
            <X size={18} />
          </button>
        </header>

        <div className="drawer-body">
          <ul className="drawer-category-list">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <li key={cat.name}>
                  <button
                    className={`drawer-category-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      onClose(); // Automatically close drawer on selection
                    }}
                    id={`drawer-pill-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <span className="drawer-category-name">{cat.name}</span>
                    <span className="drawer-category-count">{cat.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
