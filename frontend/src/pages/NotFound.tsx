import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAlertOctagon } from 'react-icons/fi';

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md p-8 bg-white border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800 rounded-3xl shadow-sm"
      >
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-primary-600 bg-primary-50 dark:bg-primary-950/20 dark:text-primary-400 rounded-2xl">
          <FiAlertOctagon className="w-10 h-10" />
        </div>
        
        <h1 className="text-6xl font-extrabold text-primary-600 dark:text-primary-400 mb-2 tracking-tight my-0">
          404
        </h1>
        
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 my-0">
          Page Not Found
        </h2>
        
        <p className="mb-8 text-sm text-gray-500 dark:text-neutral-400">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
