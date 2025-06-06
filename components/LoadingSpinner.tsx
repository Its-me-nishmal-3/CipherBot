import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  spinnerColor?: string; // e.g. text-blue-500, or a CSS variable like 'var(--accent-color)'
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  spinnerColor, 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  // Use provided spinnerColor, or default to a CSS variable if spinnerColor is not a CSS var itself
  const colorClass = spinnerColor 
    ? (spinnerColor.startsWith('var(') ? `[${spinnerColor}]` : spinnerColor) 
    : 'text-[var(--accent-primary)]';


  return (
    <svg 
      className={`animate-spin ${sizeClasses[size]} ${colorClass} ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-label="Loading"
      role="status"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};