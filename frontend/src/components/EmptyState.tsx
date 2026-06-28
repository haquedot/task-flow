import React from 'react';
import { FiInbox, FiRefreshCw } from 'react-icons/fi';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Tasks Found',
  message = 'Get started by creating your first task, or try adjusting your search filters.',
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800 rounded-3xl shadow-sm">
      <div className="flex items-center justify-center w-16 h-16 mb-4 text-gray-400 bg-gray-50 dark:bg-neutral-800 dark:text-neutral-500 rounded-2xl">
        <FiInbox className="w-8 h-8" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="max-w-sm mb-6 text-sm text-gray-500 dark:text-neutral-400">
        {message}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 transition-all border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-xl"
        >
          <FiRefreshCw className="w-4 h-4" /> Reset Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
