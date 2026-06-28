import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiEdit,
  FiTrash2,
  FiAlertCircle,
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchTaskByIdThunk, deleteTaskThunk } from '../features/tasks/taskThunk';
import {
  selectActiveTask,
  selectTasksLoading,
  selectTasksError,
  openEditModal,
} from '../features/tasks/taskSlice';
import Loader from '../components/Loader';
import TaskForm from '../components/TaskForm';
import toast from 'react-hot-toast';

export const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const task = useAppSelector(selectActiveTask);
  const loading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskByIdThunk(id));
    }
  }, [id, dispatch]);

  const handleEditClick = () => {
    if (task) {
      dispatch(openEditModal(task));
    }
  };

  const handleDeleteClick = async () => {
    if (!id) return;
    
    // Simple custom confirmation prompt for details page to ensure direct routing flow
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task? You will be redirected back to the dashboard.'
    );
    
    if (confirmDelete) {
      const toastId = toast.loading('Deleting task...');
      try {
        await dispatch(deleteTaskThunk(id)).unwrap();
        toast.success('Task deleted successfully!', { id: toastId });
        navigate('/');
      } catch (err: any) {
        toast.error(err || 'Failed to delete task', { id: toastId });
      }
    }
  };

  const formatTaskDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return format(new Date(dateStr), 'eeee, MMMM dd, yyyy h:mm a');
    } catch {
      return 'N/A';
    }
  };

  // Status badges mapping
  const getStatusBadgeStyles = (statusVal?: string) => {
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

  // Priority badges mapping
  const getPriorityBadgeStyles = (priorityVal?: string) => {
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

  if (loading) {
    return (
      <div className="py-24">
        <Loader type="spinner" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800 rounded-3xl shadow-sm py-16">
        <div className="flex items-center justify-center w-16 h-16 mb-4 text-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-2xl">
          <FiAlertCircle className="w-8 h-8" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
          Failed to Load Task
        </h3>
        <p className="max-w-sm mb-6 text-sm text-gray-500 dark:text-neutral-400">
          {error || 'The task you are trying to view does not exist or has been deleted.'}
        </p>
        <Link
          to="/"
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all"
        >
          <FiArrowLeft /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center gap-2">
          {/* Edit */}
          <button
            onClick={handleEditClick}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 rounded-xl transition-all"
          >
            <FiEdit className="w-3.5 h-3.5" />
            Edit
          </button>
          
          {/* Delete */}
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 border border-rose-700 rounded-xl transition-all"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Details Sheet */}
      <div className="bg-white border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800 rounded-3xl shadow-sm overflow-hidden">
        {/* Banner with badges */}
        <div className="p-6 sm:p-8 border-b border-gray-50 dark:border-neutral-800/60 flex flex-wrap items-center gap-3">
          <span className={`px-3-5 py-1 text-xs font-bold border rounded-full ${getStatusBadgeStyles(task.status)}`}>
            {task.status}
          </span>
          <span className={`px-3 py-0.5 text-xs font-semibold border rounded-full ${getPriorityBadgeStyles(task.priority)}`}>
            {task.priority} Priority
          </span>
        </div>

        {/* Core content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl my-0">
              {task.title}
            </h2>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
              Description
            </h4>
            <p className="text-sm sm:text-base text-gray-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          </div>

          {/* Dates metadata panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-50 dark:border-neutral-800/60">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-gray-50 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 rounded-xl">
                <FiCalendar className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                  Due Date
                </h5>
                <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                  {formatTaskDate(task.dueDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-gray-50 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 rounded-xl">
                <FiClock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                  Timeline
                </h5>
                <div className="text-xs text-gray-500 dark:text-neutral-400 space-y-0.5">
                  <p>Created: <span className="font-semibold">{formatTaskDate(task.createdAt)}</span></p>
                  {task.updatedAt && task.updatedAt !== task.createdAt && (
                    <p>Updated: <span className="font-semibold">{formatTaskDate(task.updatedAt)}</span></p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mounting TaskForm for editing state updates */}
      <TaskForm />
    </motion.div>
  );
};

export default TaskDetails;
