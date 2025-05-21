import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme, ThemeType, SeasonType, getCurrentSeason } from '@/constants/theme';
import defaultColors from '@/constants/colors';
import { ThemeColors } from '@/types';

interface ThemeState {
  themeType: ThemeType;
  seasonType: SeasonType;
  theme: ReturnType<typeof getTheme> | null;
  useSeasonalTheme: boolean;
  
  // Actions
  setThemeType: (type: ThemeType) => void;
  setSeasonType: (season: SeasonType) => void;
  toggleSeasonalTheme: () => void;
  getThemeValues: () => ReturnType<typeof getTheme>;
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeType: 'light' as ThemeType,
      seasonType: getCurrentSeason(),
      theme: null,
      useSeasonalTheme: false,
      
      setThemeType: (type) => {
        const { seasonType, useSeasonalTheme } = get();
        const season = useSeasonalTheme ? seasonType : undefined;
        const newTheme = getTheme(type, season);
        set({ themeType: type, theme: newTheme });
      },
      
      setSeasonType: (season) => {
        const { themeType, useSeasonalTheme } = get();
        if (useSeasonalTheme) {
          const newTheme = getTheme(themeType, season);
          set({ seasonType: season, theme: newTheme });
        } else {
          set({ seasonType: season });
        }
      },
      
      toggleSeasonalTheme: () => {
        const { themeType, seasonType, useSeasonalTheme } = get();
        const newUseSeasonalTheme = !useSeasonalTheme;
        const season = newUseSeasonalTheme ? seasonType : undefined;
        const newTheme = getTheme(themeType, season);
        set({ useSeasonalTheme: newUseSeasonalTheme, theme: newTheme });
      },
      
      getThemeValues: () => {
        const { theme, themeType, seasonType, useSeasonalTheme } = get();
        // If theme is not initialized yet, initialize it with the current themeType
        if (!theme) {
          const season = useSeasonalTheme ? seasonType : undefined;
          const newTheme = getTheme(themeType, season);
          set({ theme: newTheme });
          return newTheme;
        }
        return theme;
      },
      
      toggleTheme: () => {
        const { themeType, seasonType, useSeasonalTheme } = get();
        const newType = themeType === 'light' ? 'dark' : 'light';
        const season = useSeasonalTheme ? seasonType : undefined;
        const newTheme = getTheme(newType, season);
        set({ themeType: newType, theme: newTheme });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useThemeStore;