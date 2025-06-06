import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSend, isLoading, isDisabled }) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading && !isDisabled) {
      onSend();
    }
  };

  const actualDisabled = isLoading || isDisabled;

  return (
    <div className="p-4 md:p-6 bg-[var(--input-area-bg)] backdrop-blur-md border-t border-[var(--input-area-border)] shadow-up">
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={actualDisabled ? "Waiting..." : "Type your message..."}
          className="flex-grow p-3 bg-[var(--input-field-bg)] border border-[var(--input-field-border)] rounded-lg text-[var(--input-field-text)] placeholder-[var(--input-field-placeholder)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={actualDisabled}
          aria-label="Chat message input"
        />
        <button
          onClick={onSend}
          disabled={actualDisabled}
          className="px-6 py-3 bg-[var(--input-send-button-bg)] hover:bg-[var(--input-send-button-hover-bg)] text-[var(--input-send-button-text)] font-semibold rounded-lg shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Send message"
        >
          {isLoading ? (
            <LoadingSpinner size="small" spinnerColor="text-[var(--input-send-button-text)]" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M3.105 3.105a1.5 1.5 0 012.122-.001L19.43 15.65a1.5 1.5 0 01-2.122 2.122L3.105 5.227a1.5 1.5 0 01-.001-2.122zM3.105 16.895L15.65 3.105a1.5 1.5 0 012.122 2.122L5.227 16.895a1.5 1.5 0 01-2.122-2.122z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};