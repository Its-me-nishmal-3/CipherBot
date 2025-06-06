import React, { createContext, useState, useEffect, useCallback } from 'react';

export interface ThemeColors {
  '--bg-primary': string;
  '--bg-secondary': string;
  '--bg-tertiary': string;
  '--text-primary': string;
  '--text-secondary': string;
  '--text-tertiary': string;
  '--accent-primary': string;
  '--accent-primary-hover': string;
  '--accent-secondary': string;
  '--accent-secondary-hover': string;
  '--border-primary': string;
  '--border-secondary': string;
  '--header-bg': string;
  '--header-border': string;
  '--header-text-from': string;
  '--header-text-to': string;
  '--chat-bg-gradient-from': string;
  '--chat-bg-gradient-to': string;
  '--message-user-bg': string;
  '--message-user-text': string;
  '--message-bot-bg': string;
  '--message-bot-text': string;
  '--message-bot-icon-bg': string;
  '--message-user-icon-bg': string;
  '--message-typing-indicator': string;
  '--input-area-bg': string;
  '--input-area-border': string;
  '--input-field-bg': string;
  '--input-field-border': string;
  '--input-field-text': string;
  '--input-field-placeholder': string;
  '--input-send-button-bg': string;
  '--input-send-button-hover-bg': string;
  '--input-send-button-text': string;
  '--code-block-header-bg': string;
  '--code-block-header-text': string;
  '--code-block-header-hover-text': string;
  '--code-block-bg': string;
  '--code-block-text': string;
  '--inline-code-bg': string;
  '--inline-code-text': string;
  '--list-bullet-color': string;
  '--blockquote-border-color': string;
  '--blockquote-text-color': string;
  '--error-bg': string;
  '--error-border': string;
  '--error-text-primary': string;
  '--error-text-icon': string;
  '--error-dismiss-text': string;
  '--error-dismiss-hover-text': string;
  '--scrollbar-thumb-bg': string;
  '--scrollbar-track-bg': string;
  '--scrollbar-thumb-hover-bg': string;
}

export interface ThemeSyntaxColors {
  keyword: string;
  string: string;
  comment: string;
  number: string;
  function: string;
  operator: string;
  punctuation: string;
  className: string;
  tag: string;
  attr: string;
  value: string;
}

export interface Theme {
  name: string;
  displayName: string;
  colors: ThemeColors;
  syntax: ThemeSyntaxColors;
}

const cipherDefaultColors: ThemeColors = {
  '--bg-primary': '#0f172a', '--bg-secondary': '#1e293b', '--bg-tertiary': '#020617',
  '--text-primary': '#f8fafc', '--text-secondary': '#cbd5e1', '--text-tertiary': '#94a3b8',
  '--accent-primary': '#0ea5e9', '--accent-primary-hover': '#0284c7',
  '--accent-secondary': '#10b981', '--accent-secondary-hover': '#059669',
  '--border-primary': '#334155', '--border-secondary': '#475569',
  '--header-bg': 'rgba(30, 41, 59, 0.5)', '--header-border': '#334155',
  '--header-text-from': '#38bdf8', '--header-text-to': '#34d399',
  '--chat-bg-gradient-from': '#0f172a', '--chat-bg-gradient-to': '#334155',
  '--message-user-bg': '#0ea5e9', '--message-user-text': '#ffffff',
  '--message-bot-bg': '#334155', '--message-bot-text': '#f1f5f9',
  '--message-bot-icon-bg': '#10b981', '--message-user-icon-bg': '#0ea5e9',
  '--message-typing-indicator': '#94a3b8',
  '--input-area-bg': 'rgba(30, 41, 59, 0.7)', '--input-area-border': '#334155',
  '--input-field-bg': '#334155', '--input-field-border': '#475569',
  '--input-field-text': '#ffffff', '--input-field-placeholder': '#94a3b8',
  '--input-send-button-bg': '#0ea5e9', '--input-send-button-hover-bg': '#0284c7', '--input-send-button-text': '#ffffff',
  '--code-block-header-bg': 'rgba(15, 23, 42, 0.85)', '--code-block-header-text': '#94a3b8', '--code-block-header-hover-text': '#7dd3fc',
  '--code-block-bg': '#020617', '--code-block-text': '#cbd5e1',
  '--inline-code-bg': '#475569', '--inline-code-text': '#5eead4',
  '--list-bullet-color': '#38bdf8', '--blockquote-border-color': '#64748b', '--blockquote-text-color': '#cbd5e1',
  '--error-bg': 'rgba(239, 68, 68, 0.2)', '--error-border': '#b91c1c', '--error-text-primary': '#fecaca', '--error-text-icon': '#f87171',
  '--error-dismiss-text': '#fda4af', '--error-dismiss-hover-text': '#fee2e2',
  '--scrollbar-thumb-bg': '#475569', '--scrollbar-track-bg': '#1e293b', '--scrollbar-thumb-hover-bg': '#94a3b8',
};

const cipherDefaultSyntax: ThemeSyntaxColors = {
  keyword: '#569cd6', string: '#ce9178', comment: '#6a9955', number: '#b5cea8',
  function: '#dcdcaa', operator: '#d4d4d4', punctuation: '#d4d4d4',
  className: '#4ec9b0', tag: '#569cd6', attr: '#9cdcfe', value: '#ce9178',
};

export const themes: Record<string, Theme> = {
  cipherDefault: {
    name: 'cipherDefault', displayName: 'Cipher Default',
    colors: cipherDefaultColors,
    syntax: cipherDefaultSyntax,
  },
  terminalGreen: {
    name: 'terminalGreen', displayName: 'Terminal Green',
    colors: {
      ...cipherDefaultColors,
      '--bg-primary': '#0D0D0D', '--bg-secondary': '#1A1A1A', '--bg-tertiary': '#000000',
      '--text-primary': '#39FF14', '--text-secondary': '#80FF72', '--text-tertiary': '#2AFFD1',
      '--accent-primary': '#39FF14', '--accent-primary-hover': '#80FF72',
      '--accent-secondary': '#2AFFD1', '--accent-secondary-hover': '#72FFEE',
      '--border-primary': '#20C20E', '--border-secondary': '#14F500',
      '--header-bg': 'rgba(0,0,0,0.7)', '--header-border': '#20C20E',
      '--header-text-from': '#39FF14', '--header-text-to': '#2AFFD1',
      '--chat-bg-gradient-from': '#0D0D0D', '--chat-bg-gradient-to': '#1A1A1A',
      '--message-user-bg': '#1A1A1A', '--message-user-text': '#39FF14',
      '--message-bot-bg': '#202020', '--message-bot-text': '#80FF72',
      '--message-bot-icon-bg': '#2AFFD1', '--message-user-icon-bg': '#39FF14',
      '--message-typing-indicator': '#2AFFD1',
      '--input-area-bg': 'rgba(0,0,0,0.8)', '--input-area-border': '#20C20E',
      '--input-field-bg': '#101010', '--input-field-border': '#14F500',
      '--input-field-text': '#39FF14', '--input-field-placeholder': '#2AFFD1',
      '--input-send-button-bg': '#14F500', '--input-send-button-hover-bg': '#20C20E', '--input-send-button-text': '#000000',
      '--code-block-header-bg': 'rgba(0,0,0,0.9)', '--code-block-header-text': '#2AFFD1', '--code-block-header-hover-text': '#80FF72',
      '--code-block-bg': '#000000', '--code-block-text': '#39FF14',
      '--inline-code-bg': '#1A1A1A', '--inline-code-text': '#2AFFD1',
      '--list-bullet-color': '#39FF14', '--blockquote-border-color': '#20C20E', '--blockquote-text-color': '#80FF72',
      '--error-bg': 'rgba(57, 255, 20, 0.2)', '--error-border': '#20C20E', '--error-text-primary': '#80FF72', '--error-text-icon': '#39FF14',
      '--error-dismiss-text': '#2AFFD1', '--error-dismiss-hover-text': '#80FF72',
      '--scrollbar-thumb-bg': '#14F500', '--scrollbar-track-bg': '#0D0D0D', '--scrollbar-thumb-hover-bg': '#20C20E',
    },
    syntax: {
      keyword: '#39FF14', string: '#80FF72', comment: '#2AFFD1', number: '#72FFEE',
      function: '#39FF14', operator: '#80FF72', punctuation: '#80FF72',
      className: '#2AFFD1', tag: '#39FF14', attr: '#72FFEE', value: '#80FF72',
    },
  },
  arcanePurple: {
    name: 'arcanePurple', displayName: 'Arcane Purple',
    colors: {
      ...cipherDefaultColors,
      '--bg-primary': '#2c1338', '--bg-secondary': '#431c58', '--bg-tertiary': '#1e0a29',
      '--text-primary': '#e0d2fa', '--text-secondary': '#c0b0ea', '--text-tertiary': '#a090da',
      '--accent-primary': '#ff00ff', '--accent-primary-hover': '#cc00cc',
      '--accent-secondary': '#00FFFF', '--accent-secondary-hover': '#00cccc',
      '--border-primary': '#5d2e72', '--border-secondary': '#774290',
      '--header-bg': 'rgba(44, 19, 56, 0.7)', '--header-border': '#5d2e72',
      '--header-text-from': '#ff00ff', '--header-text-to': '#00FFFF',
      '--chat-bg-gradient-from': '#2c1338', '--chat-bg-gradient-to': '#431c58',
      '--message-user-bg': '#774290', '--message-user-text': '#e0d2fa',
      '--message-bot-bg': '#5d2e72', '--message-bot-text': '#c0b0ea',
      '--message-bot-icon-bg': '#00FFFF', '--message-user-icon-bg': '#ff00ff',
      '--message-typing-indicator': '#a090da',
      '--input-area-bg': 'rgba(30,10,40,0.8)', '--input-area-border': '#5d2e72',
      '--input-field-bg': '#431c58', '--input-field-border': '#774290',
      '--input-field-text': '#e0d2fa', '--input-field-placeholder': '#a090da',
      '--input-send-button-bg': '#ff00ff', '--input-send-button-hover-bg': '#cc00cc', '--input-send-button-text': '#ffffff',
      '--code-block-header-bg': 'rgba(30,10,40,0.9)', '--code-block-header-text': '#a090da', '--code-block-header-hover-text': '#00FFFF',
      '--code-block-bg': '#1e0a29', '--code-block-text': '#e0d2fa',
      '--inline-code-bg': '#5d2e72', '--inline-code-text': '#00FFFF',
      '--list-bullet-color': '#ff00ff', '--blockquote-border-color': '#774290', '--blockquote-text-color': '#c0b0ea',
      '--scrollbar-thumb-bg': '#774290', '--scrollbar-track-bg': '#2c1338', '--scrollbar-thumb-hover-bg': '#5d2e72',
    },
    syntax: {
      keyword: '#ff00ff', string: '#00FFFF', comment: '#a090da', number: '#c0b0ea',
      function: '#e0d2fa', operator: '#c0b0ea', punctuation: '#c0b0ea',
      className: '#00FFFF', tag: '#ff00ff', attr: '#e0d2fa', value: '#00FFFF',
    },
  },
  classicLight: {
    name: 'classicLight', displayName: 'Classic Light',
    colors: {
      ...cipherDefaultColors,
      '--bg-primary': '#ffffff', '--bg-secondary': '#f0f0f0', '--bg-tertiary': '#e0e0e0',
      '--text-primary': '#333333', '--text-secondary': '#555555', '--text-tertiary': '#777777',
      '--accent-primary': '#007bff', '--accent-primary-hover': '#0056b3',
      '--accent-secondary': '#28a745', '--accent-secondary-hover': '#1e7e34',
      '--border-primary': '#dddddd', '--border-secondary': '#cccccc',
      '--header-bg': 'rgba(240,240,240,0.8)', '--header-border': '#dddddd',
      '--header-text-from': '#007bff', '--header-text-to': '#28a745',
      '--chat-bg-gradient-from': '#ffffff', '--chat-bg-gradient-to': '#f0f0f0',
      '--message-user-bg': '#007bff', '--message-user-text': '#ffffff',
      '--message-bot-bg': '#e9ecef', '--message-bot-text': '#333333',
      '--message-bot-icon-bg': '#28a745', '--message-user-icon-bg': '#007bff',
      '--message-typing-indicator': '#777777',
      '--input-area-bg': 'rgba(220,220,220,0.7)', '--input-area-border': '#cccccc',
      '--input-field-bg': '#ffffff', '--input-field-border': '#cccccc',
      '--input-field-text': '#333333', '--input-field-placeholder': '#777777',
      '--input-send-button-bg': '#007bff', '--input-send-button-hover-bg': '#0056b3', '--input-send-button-text': '#ffffff',
      '--code-block-header-bg': 'rgba(220,220,220,0.9)', '--code-block-header-text': '#777777', '--code-block-header-hover-text': '#0056b3',
      '--code-block-bg': '#f8f9fa', '--code-block-text': '#333333',
      '--inline-code-bg': '#e0e0e0', '--inline-code-text': '#d63384', /* A common pink for inline code in light themes */
      '--list-bullet-color': '#007bff', '--blockquote-border-color': '#cccccc', '--blockquote-text-color': '#555555',
      '--scrollbar-thumb-bg': '#cccccc', '--scrollbar-track-bg': '#f0f0f0', '--scrollbar-thumb-hover-bg': '#bbbbbb',
      '--error-bg': 'rgba(220, 53, 69, 0.1)', '--error-border': '#dc3545', '--error-text-primary': '#721c24', '--error-text-icon': '#dc3545',
      '--error-dismiss-text': '#721c24', '--error-dismiss-hover-text': '#5a161e',
    },
    syntax: { // Light theme friendly syntax colors
      keyword: '#007bff', string: '#28a745', comment: '#6c757d', number: '#17a2b8',
      function: '#ffc107', operator: '#343a40', punctuation: '#343a40',
      className: '#fd7e14', tag: '#007bff', attr: '#6f42c1', value: '#28a745',
    },
  },
};


interface ThemeContextType {
  currentTheme: string;
  setTheme: (themeName: string) => void;
  currentThemeDetails: Theme | null;
  themeLoaded: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'cipherDefault',
  setTheme: () => {},
  currentThemeDetails: themes.cipherDefault,
  themeLoaded: false,
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentThemeState] = useState<string>('cipherDefault');
  const [currentThemeDetails, setCurrentThemeDetailsState] = useState<Theme | null>(null);
  const [themeLoaded, setThemeLoaded] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('cipherBotTheme');
    const initialThemeName = storedTheme && themes[storedTheme] ? storedTheme : 'cipherDefault';
    setCurrentThemeState(initialThemeName);
    setCurrentThemeDetailsState(themes[initialThemeName]);
    setThemeLoaded(true);
  }, []);

  const setTheme = useCallback((themeName: string) => {
    if (themes[themeName]) {
      localStorage.setItem('cipherBotTheme', themeName);
      setCurrentThemeState(themeName);
      setCurrentThemeDetailsState(themes[themeName]);
    } else {
      console.warn(`Theme ${themeName} not found. Defaulting to cipherDefault.`);
      localStorage.setItem('cipherBotTheme', 'cipherDefault');
      setCurrentThemeState('cipherDefault');
      setCurrentThemeDetailsState(themes.cipherDefault);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, currentThemeDetails, themeLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};
