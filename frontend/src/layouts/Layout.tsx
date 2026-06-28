import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useAppDispatch } from '../hooks/redux';
import { openCreateModal } from '../features/tasks/taskSlice';

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleCreateClick = () => {
    dispatch(openCreateModal());
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
      <Navbar onCreateClick={handleCreateClick} />
      
      <main className="flex-1 w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Global Toast Notification Handler */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass dark:text-white',
          style: {
            borderRadius: '16px',
            fontSize: '14px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;
