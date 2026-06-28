import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  closeDeleteModal,
  selectActiveTaskId,
  selectIsDeleteOpen,
} from '../features/tasks/taskSlice';
import { deleteTaskThunk } from '../features/tasks/taskThunk';

export const DeleteModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsDeleteOpen);
  const taskId = useAppSelector(selectActiveTaskId);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    if (isDeleting) return; // Prevent closing while deleting
    dispatch(closeDeleteModal());
  };

  const handleConfirm = async () => {
    if (!taskId) return;
    setIsDeleting(true);
    
    // Create a loading toast
    const toastId = toast.loading('Deleting task...');
    
    try {
      const result = await dispatch(deleteTaskThunk(taskId)).unwrap();
      if (result) {
        toast.success('Task deleted successfully!', { id: toastId });
        dispatch(closeDeleteModal());
      }
    } catch (err: any) {
      toast.error(err || 'Failed to delete task', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md p-6 overflow-hidden bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl shadow-2xl z-10"
          >
            {/* Header / Icon */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 rounded-2xl">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Delete Task
                </h3>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  This action is irreversible.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-neutral-300">
                Are you sure you want to delete this task? All of its data will be permanently removed from the system.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-950 dark:text-neutral-400 dark:hover:text-white transition-all bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 shadow-lg shadow-rose-500/20 dark:shadow-rose-950/40 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <FiTrash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
