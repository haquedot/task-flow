import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiFilter,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiPlus,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiSliders,
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  fetchTasksThunk,
  fetchTaskStatsThunk,
} from '../features/tasks/taskThunk';
import {
  selectTasks,
  selectTasksLoading,
  selectFilters,
  selectSorting,
  selectPagination,
  selectTaskStats,
  setSearch,
  setStatusFilter,
  setPriorityFilter,
  setSorting,
  setPage,
  resetFilters,
  openCreateModal,
} from '../features/tasks/taskSlice';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import TaskForm from '../components/TaskForm';
import DeleteModal from '../components/DeleteModal';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Redux Selectors
  const tasks = useAppSelector(selectTasks);
  const loading = useAppSelector(selectTasksLoading);
  const filters = useAppSelector(selectFilters);
  const sorting = useAppSelector(selectSorting);
  const pagination = useAppSelector(selectPagination);
  const stats = useAppSelector(selectTaskStats);

  // Local state for debounced search input
  const [localSearch, setLocalSearch] = useState(filters.search);

  // 1. Debounce Search logic (500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearch(localSearch));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, dispatch]);

  // Sync local search state with redux state (e.g. if filters are reset)
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  // 2. Fetch Tasks when filters/sorting/page change
  useEffect(() => {
    const fetchParams = {
      search: filters.search,
      status: filters.status,
      priority: filters.priority,
      sortBy: sorting.sortBy,
      order: sorting.order,
      page: pagination.currentPage,
      limit: pagination.limit,
    };
    dispatch(fetchTasksThunk(fetchParams));
  }, [filters, sorting, pagination.currentPage, pagination.limit, dispatch]);

  // 3. Fetch stats on component load
  useEffect(() => {
    dispatch(fetchTaskStatsThunk());
  }, [dispatch]);

  // 4. Keyboard Shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if the user is typing in form inputs
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        dispatch(openCreateModal());
      } else if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        dispatch(resetFilters());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  // Handle Sort Change from Select dropdown
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sortBy = 'createdAt';
    let order: 'asc' | 'desc' = 'desc';

    if (value === 'newest') {
      sortBy = 'createdAt';
      order = 'desc';
    } else if (value === 'oldest') {
      sortBy = 'createdAt';
      order = 'asc';
    } else if (value === 'dueAsc') {
      sortBy = 'dueDate';
      order = 'asc';
    } else if (value === 'dueDesc') {
      sortBy = 'dueDate';
      order = 'desc';
    }

    dispatch(setSorting({ sortBy, order }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      dispatch(setPage(newPage));
    }
  };

  const activeSortValue = () => {
    if (sorting.sortBy === 'dueDate') {
      return sorting.order === 'asc' ? 'dueAsc' : 'dueDesc';
    }
    return sorting.order === 'asc' ? 'oldest' : 'newest';
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl my-0">
            Task Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-neutral-400">
            Organize, prioritize, and track your projects in real-time.
          </p>
        </div>
        
        <button
          onClick={() => dispatch(openCreateModal())}
          className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition-all shadow-lg bg-primary-600 hover:bg-primary-700 shadow-primary-500/20 hover:shadow-primary-500/30 rounded-2xl hover:-translate-y-0.5 active:translate-y-0"
        >
          <FiPlus className="w-5 h-5" />
          Create New Task
        </button>
      </div>

      {/* Dashboard Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Tasks Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800/80 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400">Total Tasks</span>
              <div className="p-2 text-primary-600 bg-primary-50 dark:bg-primary-950/20 dark:text-primary-400 rounded-xl">
                <FiTrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
              <span className="text-xs font-medium text-gray-400">tasks active</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-neutral-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-primary-500 h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
          </motion.div>

          {/* Completed Tasks Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800/80 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400">Completed</span>
              <div className="p-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl">
                <FiCheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.statusCounts.Completed}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {stats.percentages.Completed}% of total
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-neutral-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.percentages.Completed}%` }}
              ></div>
            </div>
          </motion.div>

          {/* In Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800/80 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400">In Progress</span>
              <div className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400 rounded-xl">
                <FiClock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.statusCounts['In Progress']}
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {stats.percentages['In Progress']}% of total
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-neutral-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.percentages['In Progress']}%` }}
              ></div>
            </div>
          </motion.div>

          {/* Pending Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800/80 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400">Pending</span>
              <div className="p-2 text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 rounded-xl">
                <FiAlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.statusCounts.Pending}
              </span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                {stats.percentages.Pending}% of total
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-neutral-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.percentages.Pending}%` }}
              ></div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="p-4 bg-white border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800 rounded-2xl shadow-sm flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400 dark:text-neutral-500 w-4 h-4" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by title or description... (Press '/' to focus)"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Filter / Sort Actions Wrapper */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-gray-700 dark:text-white appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <FiFilter className="absolute right-3 top-3.5 text-gray-400 pointer-events-none w-3.5 h-3.5" />
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
              className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-gray-700 dark:text-white appearance-none cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <FiSliders className="absolute right-3 top-3.5 text-gray-400 pointer-events-none w-3.5 h-3.5" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={activeSortValue()}
              onChange={handleSortChange}
              className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-gray-700 dark:text-white appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueAsc">Due Date: Asc</option>
              <option value="dueDesc">Due Date: Desc</option>
            </select>
            <FiSliders className="absolute right-3 top-3.5 text-gray-400 pointer-events-none w-3.5 h-3.5" />
          </div>

          {/* Reset Filters button */}
          <button
            onClick={() => dispatch(resetFilters())}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-gray-200 hover:border-gray-300 dark:border-neutral-700 dark:hover:border-neutral-600 text-xs font-semibold text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-all bg-white dark:bg-neutral-900 rounded-xl"
            title="Reset Filters"
          >
            <FiRefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Task Grid / Content */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <Loader type="skeletons" count={6} />
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No Tasks Found"
            message={
              filters.search || filters.status || filters.priority
                ? 'No tasks match your selected query criteria. Try clearing some filters.'
                : 'You have no active tasks currently. Click the create button above to start!'
            }
            onReset={
              filters.search || filters.status || filters.priority
                ? () => dispatch(resetFilters())
                : undefined
            }
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && tasks.length > 0 && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 bg-white border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800 rounded-2xl shadow-sm">
          <div className="text-sm text-gray-500 dark:text-neutral-400">
            Showing Page <span className="font-semibold text-gray-900 dark:text-white">{pagination.currentPage}</span>{' '}
            of <span className="font-semibold text-gray-900 dark:text-white">{pagination.totalPages}</span> (
            <span className="font-medium">{pagination.totalTasks} total tasks</span>)
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="flex items-center justify-center w-9 h-9 border border-gray-200 dark:border-neutral-700 dark:text-neutral-400 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: pagination.totalPages }).map((_, idx) => {
              const pNum = idx + 1;
              const isActive = pagination.currentPage === pNum;
              return (
                <button
                  key={pNum}
                  onClick={() => handlePageChange(pNum)}
                  className={`w-9 h-9 text-sm font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                      : 'border border-gray-200 dark:border-neutral-700 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {pNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="flex items-center justify-center w-9 h-9 border border-gray-200 dark:border-neutral-700 dark:text-neutral-400 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global Modals Mounted */}
      <TaskForm />
      <DeleteModal />
    </div>
  );
};

export default Home;
