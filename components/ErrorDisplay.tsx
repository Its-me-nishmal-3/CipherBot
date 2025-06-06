import React from 'react';

interface ErrorDisplayProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, className = '', onDismiss }) => {
  if (!message) return null;

  return (
    <div 
      className={`bg-[var(--error-bg)] border border-[var(--error-border)] text-[var(--error-text-primary)] px-4 py-3 rounded-lg relative shadow-md ${className}`} 
      role="alert"
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 mr-2 text-[var(--error-text-icon)]">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-4.707l-3-3a1 1 0 011.414-1.414L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <strong className="font-bold mr-1">Error:</strong>
        <span className="block sm:inline">{message}</span>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss} 
          className="absolute top-0 bottom-0 right-0 px-4 py-3 text-[var(--error-dismiss-text)] hover:text-[var(--error-dismiss-hover-text)]"
          aria-label="Dismiss error"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  );
};