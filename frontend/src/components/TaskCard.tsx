import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import type { Task } from '../services/taskService';
import { useAppDispatch } from '../hooks/redux';
import { openEditModal, openDeleteModal } from '../features/tasks/taskSlice';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const dispatch = useAppDispatch();
  const { _id, title, description, status, priority, dueDate, createdAt } = task;

  // Format dates safely
  const formatTaskDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  // Status-specific badges configuration
  const getStatusBadgeStyles = (statusVal: string) => {
    switch (statusVal) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30';
      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
    }
  };

  // Priority-specific badges configuration
  const getPriorityBadgeStyles = (priorityVal: string) => {
    switch (priorityVal) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
      case 'Medium':
        return 'bg-purple-50 text-purple-700 border-purple-200/50 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30';
      case 'Low':
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200/50 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700/50';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="flex flex-col h-full overflow-hidden transition-all bg-white border border-gray-100/80 dark:bg-neutral-900 dark:border-neutral-800/80 rounded-2xl shadow-sm hover:shadow-md"
    >
      {/* Top Banner section */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Badges */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusBadgeStyles(status)}`}>
            {status}
          </span>
          <span className={`px-2.5 py-0.5 text-xs font-medium border rounded-full ${getPriorityBadgeStyles(priority)}`}>
            {priority} Priority
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="flex-1 mb-4 text-sm text-gray-500 dark:text-neutral-400 line-clamp-3">
          {description}
        </p>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2 pt-4 mt-auto border-t border-gray-50 dark:border-neutral-800/60 text-xs text-gray-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <FiCalendar className="text-gray-400 dark:text-neutral-500" />
            <span className="truncate">Due: {formatTaskDate(dueDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <FiClock className="text-gray-400 dark:text-neutral-500" />
            <span className="truncate">Added: {formatTaskDate(createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 dark:bg-neutral-900/50 border-t border-gray-100 dark:border-neutral-800/60">
        <Link
          to={`/task/${_id}`}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
        >
          <FiEye className="w-4 h-4" /> View Details
        </Link>

        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <button
            onClick={() => dispatch(openEditModal(task))}
            className="flex items-center justify-center w-8 h-8 transition-colors text-gray-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl"
            title="Edit Task"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
          
          {/* Delete Button */}
          <button
            onClick={() => dispatch(openDeleteModal(_id))}
            className="flex items-center justify-center w-8 h-8 transition-colors text-gray-500 hover:text-rose-600 dark:text-neutral-400 dark:hover:text-rose-400 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl"
            title="Delete Task"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
