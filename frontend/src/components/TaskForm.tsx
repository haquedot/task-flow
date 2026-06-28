import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  closeCreateModal,
  closeEditModal,
  selectActiveTask,
  selectIsCreateOpen,
  selectIsEditOpen,
  selectValidationErrors,
} from '../features/tasks/taskSlice';
import { createTaskThunk, updateTaskThunk } from '../features/tasks/taskThunk';
import type { TaskData } from '../services/taskService';

export const TaskForm: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const isCreateOpen = useAppSelector(selectIsCreateOpen);
  const isEditOpen = useAppSelector(selectIsEditOpen);
  const activeTask = useAppSelector(selectActiveTask);
  const serverValidationErrors = useAppSelector(selectValidationErrors);
  
  const isOpen = isCreateOpen || isEditOpen;
  const isEditMode = !!activeTask;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TaskData>({
    defaultValues: {
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      dueDate: '',
    },
  });

  // Sync modal form with active task in edit mode
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && activeTask) {
        // Format date string to YYYY-MM-DD
        const formattedDate = activeTask.dueDate
          ? new Date(activeTask.dueDate).toISOString().split('T')[0]
          : '';
        reset({
          title: activeTask.title,
          description: activeTask.description,
          status: activeTask.status,
          priority: activeTask.priority,
          dueDate: formattedDate,
        });
      } else {
        // Reset to default empty values in create mode
        reset({
          title: '',
          description: '',
          status: 'Pending',
          priority: 'Medium',
          dueDate: '',
        });
      }
    }
  }, [isOpen, isEditMode, activeTask, reset]);

  // Bind server validation errors to the fields
  useEffect(() => {
    if (serverValidationErrors && Array.isArray(serverValidationErrors)) {
      serverValidationErrors.forEach((err: any) => {
        const fieldName = err.path as keyof TaskData;
        if (fieldName) {
          setError(fieldName, {
            type: 'server',
            message: err.msg,
          });
        }
      });
    }
  }, [serverValidationErrors, setError]);

  const handleClose = () => {
    if (isSubmitting) return;
    if (isEditMode) {
      dispatch(closeEditModal());
    } else {
      dispatch(closeCreateModal());
    }
  };

  const onSubmit: SubmitHandler<TaskData> = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading(isEditMode ? 'Updating task...' : 'Creating task...');

    try {
      if (isEditMode && activeTask) {
        const result = await dispatch(
          updateTaskThunk({ id: activeTask._id, taskData: data })
        ).unwrap();
        if (result) {
          toast.success('Task updated successfully!', { id: toastId });
          dispatch(closeEditModal());
        }
      } else {
        const result = await dispatch(createTaskThunk(data)).unwrap();
        if (result) {
          toast.success('Task created successfully!', { id: toastId });
          dispatch(closeCreateModal());
        }
      }
    } catch (err: any) {
      // If error is not server validation error, display direct warning
      if (!err.errors) {
        toast.error(err.message || 'An error occurred. Please try again.', { id: toastId });
      } else {
        toast.error('Please fix the validation errors.', { id: toastId });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard shortcut listener to close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting]);

  // Today's date string for min date validation in browser picker
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg p-6 bg-white border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800 rounded-3xl shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-neutral-800/60">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit Task' : 'Create Task'}
              </h3>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-1.5 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Task title"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 transition-all text-sm bg-gray-50 border rounded-xl dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 dark:text-white ${
                    errors.title ? 'border-rose-500 focus:ring-rose-500/10' : 'border-gray-200 dark:border-neutral-700'
                  }`}
                  {...register('title', {
                    required: 'Title is required',
                    minLength: { value: 3, message: 'Title must be at least 3 characters' },
                    maxLength: { value: 100, message: 'Title cannot exceed 100 characters' },
                  })}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide a detailed description of the task..."
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 transition-all text-sm bg-gray-50 border rounded-xl dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 dark:text-white ${
                    errors.description ? 'border-rose-500 focus:ring-rose-500/10' : 'border-gray-200 dark:border-neutral-700'
                  }`}
                  {...register('description', {
                    required: 'Description is required',
                    minLength: { value: 10, message: 'Description must be at least 10 characters' },
                  })}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 transition-all text-sm bg-gray-50 border border-gray-200 dark:border-neutral-700 rounded-xl dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 dark:text-white"
                    {...register('status', { required: 'Status is required' })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                    Priority
                  </label>
                  <select
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 transition-all text-sm bg-gray-50 border border-gray-200 dark:border-neutral-700 rounded-xl dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 dark:text-white"
                    {...register('priority', { required: 'Priority is required' })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  Due Date
                </label>
                <input
                  type="date"
                  disabled={isSubmitting}
                  min={todayStr}
                  className={`w-full px-4 py-2.5 transition-all text-sm bg-gray-50 border rounded-xl dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 dark:text-white ${
                    errors.dueDate ? 'border-rose-500 focus:ring-rose-500/10' : 'border-gray-200 dark:border-neutral-700'
                  }`}
                  {...register('dueDate', {
                    required: 'Due date is required',
                    validate: (value) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const inputDate = new Date(value);
                      return inputDate >= today || 'Due date cannot be in the past';
                    },
                  })}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.dueDate.message}</p>
                )}
              </div>

              {/* Footer buttons */}
              <div className="flex items-center gap-3 justify-end pt-4 border-t border-gray-50 dark:border-neutral-800/60 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-950 dark:text-neutral-400 dark:hover:text-white transition-all bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 shadow-lg shadow-primary-500/20 dark:shadow-primary-950/40 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  {isSubmitting ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskForm;
