import React from 'react';

interface LoaderProps {
  type?: 'spinner' | 'skeletons';
  count?: number;
}

export const Loader: React.FC<LoaderProps> = ({ type = 'spinner', count = 3 }) => {
  if (type === 'skeletons') {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col h-56 p-6 border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm animate-pulse"
          >
            {/* Badges row */}
            <div className="flex justify-between items-center mb-4">
              <div className="w-20 h-5 bg-gray-200 dark:bg-neutral-800 rounded-full"></div>
              <div className="w-16 h-5 bg-gray-200 dark:bg-neutral-800 rounded-full"></div>
            </div>

            {/* Title */}
            <div className="w-3/4 h-6 mb-2 bg-gray-200 dark:bg-neutral-800 rounded-lg"></div>

            {/* Description */}
            <div className="flex-1 space-y-2">
              <div className="w-full h-4 bg-gray-200 dark:bg-neutral-800 rounded"></div>
              <div className="w-5/6 h-4 bg-gray-200 dark:bg-neutral-800 rounded"></div>
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-neutral-800">
              <div className="w-24 h-4 bg-gray-200 dark:bg-neutral-800 rounded"></div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
                <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-primary-200 dark:border-neutral-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 dark:text-neutral-400">
        Loading task data...
      </p>
    </div>
  );
};

export default Loader;
