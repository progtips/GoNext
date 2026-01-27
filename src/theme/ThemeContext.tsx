import { createContext, useContext } from 'react';

type ThemeContextValue = {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useThemeController = () => {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useThemeController must be used within ThemeContext.Provider');
  }
  return value;
};

export default ThemeContext;
