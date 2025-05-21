import { DefaultTheme } from '@react-navigation/native';
import defaultColors from '@/constants/colors';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...defaultColors.light,
    background: defaultColors.light.background,
    text: defaultColors.light.text,
    primary: defaultColors.light.primary,
    border: defaultColors.light.border,
  },
};

export const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...defaultColors.dark,
    background: defaultColors.dark.background,
    text: defaultColors.dark.text,
    primary: defaultColors.dark.primary,
    border: defaultColors.dark.border,
  },
};
