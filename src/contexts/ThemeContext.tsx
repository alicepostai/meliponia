import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { palettes, AppColorPalette, lightColors } from '@/theme/colors';
type ThemeMode = 'light' | 'dark' | 'system';
interface ThemeContextType {
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  isDarkMode: boolean;
  colors: AppColorPalette;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}
const ASYNC_STORAGE_THEME_KEY = 'app_theme_preference';
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const getInitialTheme = () => Appearance.getColorScheme() || 'light';
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(getInitialTheme);
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = (await AsyncStorage.getItem(
          ASYNC_STORAGE_THEME_KEY,
        )) as ThemeMode | null;
        if (storedTheme) {
          setThemeState(storedTheme);
        }
      } catch (e) {
        console.error('ThemeContext: Falha ao carregar preferência de tema.', e);
      }
    };
    loadThemePreference();
  }, []);
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'system') {
        setEffectiveTheme(colorScheme || 'light');
      }
    });
    return () => subscription.remove();
  }, [theme]);
  useEffect(() => {
    if (theme === 'system') {
      setEffectiveTheme(getInitialTheme());
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);
  const handleSetTheme = useCallback(async (newTheme: ThemeMode) => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_THEME_KEY, newTheme);
      setThemeState(newTheme);
    } catch (e) {
      console.error('ThemeContext: Falha ao salvar preferência de tema.', e);
    }
  }, []);
  const handleToggleTheme = useCallback(() => {
    const nextThemeExplicit = effectiveTheme === 'light' ? 'dark' : 'light';
    handleSetTheme(nextThemeExplicit);
  }, [effectiveTheme, handleSetTheme]);
  const currentColors = useMemo(
    () => (effectiveTheme === 'dark' ? palettes.dark : palettes.light),
    [effectiveTheme],
  );
  const value = useMemo(
    () => ({
      theme,
      effectiveTheme,
      isDarkMode: effectiveTheme === 'dark',
      colors: currentColors,
      setTheme: handleSetTheme,
      toggleTheme: handleToggleTheme,
    }),
    [theme, effectiveTheme, currentColors, handleSetTheme, handleToggleTheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
