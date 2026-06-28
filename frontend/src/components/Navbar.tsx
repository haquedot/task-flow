import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiCheckSquare, FiCommand } from 'react-icons/fi';

interface NavbarProps {
  onCreateClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCreateClick }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }
      if (e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setDarkMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <nav className="sticky top-0 z-30 w-full transition-all duration-300 border-b border-gray-200/50 dark:border-neutral-800/50 glass">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-10 h-10 transition-transform rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-500/30 group-hover:scale-105">
                <FiCheckSquare className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:block">
                Task<span className="text-primary-600 dark:text-primary-400">Flow</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Stats Badge (completed percentage could go here, handled in Home) */}
            <button
              onClick={() => onCreateClick()}
              className="hidden px-4 py-2 text-sm font-medium text-white transition-all shadow-md sm:flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Add Task
            </button>

            {/* Keyboard Shortcuts Trigger */}
            <button
              onClick={() => setShowShortcuts(true)}
              className="flex items-center justify-center w-10 h-10 transition-all text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-xl"
              title="Keyboard Shortcuts"
            >
              <FiCommand className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center justify-center w-10 h-10 transition-all text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-xl"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 overflow-hidden transition-all shadow-2xl bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-neutral-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FiCommand className="text-primary-500" /> Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-500 dark:text-neutral-400">Open Create Task Modal</span>
                <kbd className="px-2.5 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700">C</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-500 dark:text-neutral-400">Focus Search Bar</span>
                <kbd className="px-2.5 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700">/</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-500 dark:text-neutral-400">Toggle Dark Mode</span>
                <kbd className="px-2.5 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700">D</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-500 dark:text-neutral-400">Reset Filters</span>
                <kbd className="px-2.5 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700">R</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-500 dark:text-neutral-400">Close Modals / Cancel</span>
                <kbd className="px-2.5 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700">Esc</kbd>
              </div>
            </div>
            
            <button
              onClick={() => setShowShortcuts(false)}
              className="w-full mt-6 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700 rounded-xl transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
