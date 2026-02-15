import { atomWithStorage } from 'jotai/utils';

function getInitialTheme(): 'dark' | 'light' {
  if (typeof localStorage === 'undefined' || typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const themeStorage = {
  getItem: (key: string): 'dark' | 'light' => {
    if (typeof localStorage === 'undefined') return 'light';
    const stored = localStorage.getItem(key) as 'dark' | 'light' | null;
    if (stored === 'dark' || stored === 'light') return stored;
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  setItem: (key: string, value: 'dark' | 'light') => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
};

export const themeAtom = atomWithStorage<'dark' | 'light'>('theme', getInitialTheme(), themeStorage);
