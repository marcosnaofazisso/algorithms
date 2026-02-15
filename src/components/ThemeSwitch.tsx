import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { themeAtom } from '@/store/theme';
import { cn } from '@/lib/utils';

function applyThemeToDOM(theme: 'dark' | 'light') {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
}

export function ThemeSwitch({ className }: { className?: string }) {
  const [theme, setTheme] = useAtom(themeAtom);
  const isDark = theme === 'dark';

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const handleClick = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-[#0f1117] text-gray-700 dark:text-gray-200',
        'hover:bg-gray-100 dark:hover:bg-[#1a1d24] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer',
        className
      )}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
