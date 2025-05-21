import { create } from 'zustand';
import { ThemeType } from '../constants/theme';
import colors from '../constants/colors';

interface ThemeStore {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
