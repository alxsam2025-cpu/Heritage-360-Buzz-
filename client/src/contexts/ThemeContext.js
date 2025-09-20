import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Predefined theme options
export const THEME_OPTIONS = {
  heritage: {
    name: 'Heritage Gold',
    primary: 'heritage-gold',
    secondary: 'heritage-darkGold',
    accent: 'heritage-bronze',
    background: 'heritage-cream',
    colors: {
      primary: '#FFD700',
      secondary: '#B8860B',
      accent: '#CD7F32',
      background: '#F5F5DC',
      text: '#1f2937',
    }
  },
  ocean: {
    name: 'Ocean Blue',
    primary: 'blue-600',
    secondary: 'blue-800',
    accent: 'teal-500',
    background: 'slate-50',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#14b8a6',
      background: '#f8fafc',
      text: '#1f2937',
    }
  },
  forest: {
    name: 'Forest Green',
    primary: 'emerald-600',
    secondary: 'emerald-800',
    accent: 'lime-500',
    background: 'green-50',
    colors: {
      primary: '#059669',
      secondary: '#065f46',
      accent: '#84cc16',
      background: '#f0fdf4',
      text: '#1f2937',
    }
  },
  sunset: {
    name: 'Sunset Orange',
    primary: 'orange-500',
    secondary: 'orange-700',
    accent: 'yellow-500',
    background: 'orange-50',
    colors: {
      primary: '#f97316',
      secondary: '#c2410c',
      accent: '#eab308',
      background: '#fff7ed',
      text: '#1f2937',
    }
  },
  royal: {
    name: 'Royal Purple',
    primary: 'purple-600',
    secondary: 'purple-800',
    accent: 'pink-500',
    background: 'purple-50',
    colors: {
      primary: '#9333ea',
      secondary: '#6b21a8',
      accent: '#ec4899',
      background: '#faf5ff',
      text: '#1f2937',
    }
  },
  midnight: {
    name: 'Midnight Dark',
    primary: 'slate-600',
    secondary: 'slate-800',
    accent: 'indigo-400',
    background: 'slate-900',
    colors: {
      primary: '#475569',
      secondary: '#1e293b',
      accent: '#818cf8',
      background: '#0f172a',
      text: '#f1f5f9',
    }
  },
  rose: {
    name: 'Rose Garden',
    primary: 'rose-500',
    secondary: 'rose-700',
    accent: 'pink-400',
    background: 'rose-50',
    colors: {
      primary: '#f43f5e',
      secondary: '#be123c',
      accent: '#f472b6',
      background: '#fff1f2',
      text: '#1f2937',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('heritage');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('heritage-theme');
    const savedDarkMode = localStorage.getItem('heritage-dark-mode') === 'true';
    
    if (savedTheme && THEME_OPTIONS[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    setIsDarkMode(savedDarkMode);
  }, []);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const theme = THEME_OPTIONS[currentTheme];
    
    // Remove all theme classes
    Object.keys(THEME_OPTIONS).forEach(themeName => {
      root.classList.remove(`theme-${themeName}`);
    });
    
    // Add current theme class
    root.classList.add(`theme-${currentTheme}`);
    
    // Set CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Handle dark mode
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('heritage-theme', currentTheme);
    localStorage.setItem('heritage-dark-mode', isDarkMode.toString());
  }, [currentTheme, isDarkMode]);

  const changeTheme = (themeName) => {
    if (THEME_OPTIONS[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    currentTheme,
    theme: THEME_OPTIONS[currentTheme],
    isDarkMode,
    changeTheme,
    toggleDarkMode,
    themeOptions: THEME_OPTIONS,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};