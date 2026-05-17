import { Moon, Sun, Menu } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700
                       flex items-center justify-between px-6 gap-4">
      {/* Mobile brand */}
      <div className="flex items-center gap-2 md:hidden">
        <Menu size={20} className="text-gray-500 dark:text-gray-400" />
        <span className="font-bold text-gray-900 dark:text-white">SmartLeads</span>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* User info (desktop complement to sidebar) */}
        <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
          {user?.email}
        </span>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
