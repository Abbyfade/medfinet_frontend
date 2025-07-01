import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeToggle = ({ className = '', showLabel = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 ${className}`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
          {showLabel && <span className="ml-2 text-sm">Dark Mode</span>}
        </>
      ) : (
        <>
          <Sun className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
          {showLabel && <span className="ml-2 text-sm">Light Mode</span>}
        </>
      )}
    </button>
  );
};

export default ThemeToggle;