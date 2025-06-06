import React, { useContext, useState } from 'react';
import { ThemeContext, themes } from '../ThemeContext';

const PaletteIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M10 3.5A1.5 1.5 0 0111.5 2h.094a6.046 6.046 0 014.207 1.755C16.299 4.246 16.5 4.856 16.5 5.5c0 .644-.201 1.254-.7 1.745A6.046 6.046 0 0111.594 9H11.5A1.5 1.5 0 0110 7.5V3.5z" />
    <path d="M10 7.5A1.5 1.5 0 018.5 9h-.094a6.046 6.046 0 01-4.207-1.755C3.701 6.754 3.5 6.144 3.5 5.5c0-.644.201-1.254.7-1.745A6.046 6.046 0 018.406 2H8.5A1.5 1.5 0 0110 3.5v4z" />
    <path d="M10 12.5a1.5 1.5 0 011.5-1.5h.094a6.046 6.046 0 014.207 1.755c.499.491.7.1.7.1.745 0 .644.201 1.254.7 1.745A6.046 6.046 0 0111.594 17H11.5a1.5 1.5 0 01-1.5-1.5v-3z" />
    <path d="M10 12.5a1.5 1.5 0 01-1.5-1.5H8.406a6.046 6.046 0 00-4.207 1.755C3.701 13.246 3.5 13.856 3.5 14.5c0 .644.201 1.254.7 1.745A6.046 6.046 0 008.406 18H8.5a1.5 1.5 0 001.5-1.5v-4z" />
  </svg>
);


export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
    setIsOpen(false); // Close sidebar after selection
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 p-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white rounded-full shadow-lg transition-colors"
        aria-label="Toggle theme switcher"
      >
        <PaletteIcon />
      </button>

      <div 
        className={`theme-switcher-panel fixed top-0 right-0 h-full w-64 bg-[var(--bg-secondary)] shadow-xl z-40 p-6 border-l border-[var(--border-primary)] ${isOpen ? 'open' : ''}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">Select Theme</h3>
          <button onClick={toggleSidebar} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]" aria-label="Close theme switcher">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="space-y-3">
          {Object.values(themes).map((themeOption) => (
            <button
              key={themeOption.name}
              onClick={() => handleThemeChange(themeOption.name)}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-all duration-150
                font-medium text-sm
                ${currentTheme === themeOption.name 
                  ? 'bg-[var(--accent-primary)] text-white shadow-md scale-105' 
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-secondary)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              {themeOption.displayName}
            </button>
          ))}
        </div>
      </div>
      {/* Overlay to close sidebar on click outside */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm"
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};
