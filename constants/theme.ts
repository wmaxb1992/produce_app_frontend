import { Platform } from 'react-native';
import colors from './colors';

export type ThemeType = 'light' | 'dark';
export type SeasonType = 'spring' | 'summer' | 'fall' | 'winter';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const shadows = {
  light: Platform.select({
    ios: {
      sm: {
        shadowColor: colors.light.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      md: {
        shadowColor: colors.light.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      lg: {
        shadowColor: colors.light.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    },
    android: {
      sm: { elevation: 2 },
      md: { elevation: 4 },
      lg: { elevation: 8 },
    },
    default: {
      sm: {
        shadowColor: colors.light.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      md: {
        shadowColor: colors.light.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      lg: {
        shadowColor: colors.light.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    },
  }),
  dark: Platform.select({
    ios: {
      sm: {
        shadowColor: colors.dark.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      md: {
        shadowColor: colors.dark.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      lg: {
        shadowColor: colors.dark.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    },
    android: {
      sm: { elevation: 2 },
      md: { elevation: 4 },
      lg: { elevation: 8 },
    },
    default: {
      sm: {
        shadowColor: colors.dark.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      md: {
        shadowColor: colors.dark.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      lg: {
        shadowColor: colors.dark.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    },
  }),
};

// Function to determine current season based on date
export const getCurrentSeason = (): SeasonType => {
  const now = new Date();
  const month = now.getMonth();
  
  // Northern hemisphere seasons
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

export const getTheme = (themeType: ThemeType, season?: SeasonType) => {
  // Get current season if not provided
  const currentSeason = season || getCurrentSeason();
  
  // Get base theme
  const baseTheme = {
    colors: { ...colors[themeType] }, // Create a copy to avoid mutating the original
    spacing,
    fontSizes,
    fontWeights,
    borderRadius,
    shadows: shadows[themeType],
    themeType,
    season: currentSeason,
  };
  
  // Apply seasonal accent color if using seasonal theme
  if (currentSeason && baseTheme.colors) {
    // Set the seasonal color based on the current season
    baseTheme.colors.seasonal = baseTheme.colors[currentSeason];
  }
  
  return baseTheme;
};