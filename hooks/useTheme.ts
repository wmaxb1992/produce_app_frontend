import { useEffect } from 'react';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';
import { SeasonType } from '@/constants/theme';

export function useTheme() {
  const themeStore = useThemeStore();
  
  // Initialize theme if needed
  useEffect(() => {
    if (!themeStore.theme) {
      themeStore.getThemeValues();
    }
  }, []);
  
  // Get theme safely with fallback to default colors
  const theme = themeStore.theme || { colors: defaultColors.light };
  const colors = theme.colors || defaultColors.light;
  
  return {
    theme: themeStore.themeType,
    season: themeStore.seasonType,
    colors,
    isUsingSeasonalTheme: themeStore.useSeasonalTheme,
    toggleTheme: themeStore.toggleTheme,
    setThemeType: themeStore.setThemeType,
    setSeason: themeStore.setSeasonType,
    toggleSeasonalTheme: themeStore.toggleSeasonalTheme
  };
} 