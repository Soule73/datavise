import { create } from 'zustand';

export type ThemeMode = "system" | "light" | "dark";

interface ThemeStore {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.theme as ThemeMode) || 'system';
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      if (theme === 'system') {
        localStorage.removeItem('theme');
      } else {
        localStorage.theme = theme;
      }
    }
  },
}));
