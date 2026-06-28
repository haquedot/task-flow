import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskStatsResponse } from '../../services/taskService';
import {
  fetchTasksThunk,
  createTaskThunk,
  updateTaskThunk,
  deleteTaskThunk,
  fetchTaskStatsThunk,
  fetchTaskByIdThunk,
} from './taskThunk';

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  limit: number;
}

interface FilterState {
  search: string;
  status: string;
  priority: string;
}

interface SortingState {
  sortBy: string;
  order: 'asc' | 'desc';
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  validationErrors: any | null;
  stats: TaskStatsResponse['data'] | null;
  statsLoading: boolean;
  filters: FilterState;
  sorting: SortingState;
  pagination: PaginationState;
  // UI states for modals
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  activeTask: Task | null;
  activeTaskId: string | null;
  // Temporary cache for optimistic updates
  previousTasks: Task[] | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  validationErrors: null,
  stats: null,
  statsLoading: false,
  filters: {
    search: '',
    status: '',
    priority: '',
  },
  sorting: {
    sortBy: 'createdAt',
    order: 'desc',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    limit: 6,
  },
  isCreateOpen: false,
  isEditOpen: false,
  isDeleteOpen: false,
  activeTask: null,
  activeTaskId: null,
  previousTasks: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1; // reset page when search changes
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
      state.pagination.currentPage = 1;
    },
    setPriorityFilter: (state, action: PayloadAction<string>) => {
      state.filters.priority = action.payload;
      state.pagination.currentPage = 1;
    },
    setSorting: (state, action: PayloadAction<SortingState>) => {
      state.sorting = action.payload;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.filters = { search: '', status: '', priority: '' };
      state.sorting = { sortBy: 'createdAt', order: 'desc' };
      state.pagination.currentPage = 1;
    },
    clearErrors: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
    openCreateModal: (state) => {
      state.isCreateOpen = true;
      state.validationErrors = null;
    },
    closeCreateModal: (state) => {
      state.isCreateOpen = false;
      state.validationErrors = null;
    },
    openEditModal: (state, action: PayloadAction<Task>) => {
      state.isEditOpen = true;
      state.activeTask = action.payload;
      state.validationErrors = null;
    },
    closeEditModal: (state) => {
      state.isEditOpen = false;
      state.activeTask = null;
      state.validationErrors = null;
    },
    openDeleteModal: (state, action: PayloadAction<string>) => {
      state.isDeleteOpen = true;
      state.activeTaskId = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteOpen = false;
      state.activeTaskId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.pagination.currentPage = action.payload.pagination.currentPage;
        state.pagination.totalPages = action.payload.pagination.totalPages;
        state.pagination.totalTasks = action.payload.pagination.totalTasks;
        state.pagination.limit = action.payload.pagination.limit;
      })
      .addCase(fetchTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Task by ID
      .addCase(fetchTaskByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.activeTask = null;
      })
      .addCase(fetchTaskByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTask = action.payload;
      })
      .addCase(fetchTaskByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Task
      .addCase(createTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(createTaskThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Prepend new task to the list for instant visual update
        state.tasks = [action.payload, ...state.tasks].slice(0, state.pagination.limit);
        state.pagination.totalTasks += 1;
      })
      .addCase(createTaskThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create task';
        state.validationErrors = action.payload?.errors || null;
      })

      // Update Task
      .addCase(updateTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Update task inside local array
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
      })
      .addCase(updateTaskThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update task';
        state.validationErrors = action.payload?.errors || null;
      })

      // Delete Task (Optimistic UI Update)
      .addCase(deleteTaskThunk.pending, (state, action) => {
        // Cache previous tasks for rollback on failure
        state.previousTasks = [...state.tasks];
        // Optimistically remove the task from the list
        const taskId = action.meta.arg;
        state.tasks = state.tasks.filter((task) => task._id !== taskId);
        state.pagination.totalTasks -= 1;
      })
      .addCase(deleteTaskThunk.fulfilled, (state) => {
        state.previousTasks = null; // Clear rollback cache on success
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        // Rollback state since delete failed
        if (state.previousTasks) {
          state.tasks = state.previousTasks;
          state.pagination.totalTasks += 1;
          state.previousTasks = null;
        }
        state.error = action.payload as string;
      })

      // Fetch Stats
      .addCase(fetchTaskStatsThunk.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchTaskStatsThunk.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTaskStatsThunk.rejected, (state) => {
        state.statsLoading = false;
      });
  },
});

export const {
  setSearch,
  setStatusFilter,
  setPriorityFilter,
  setSorting,
  setPage,
  resetFilters,
  clearErrors,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openDeleteModal,
  closeDeleteModal,
} = taskSlice.actions;

// Selectors
export const selectTasks = (state: { tasks: TaskState }) => state.tasks.tasks;
export const selectTasksLoading = (state: { tasks: TaskState }) => state.tasks.loading;
export const selectTasksError = (state: { tasks: TaskState }) => state.tasks.error;
export const selectValidationErrors = (state: { tasks: TaskState }) => state.tasks.validationErrors;
export const selectTaskStats = (state: { tasks: TaskState }) => state.tasks.stats;
export const selectStatsLoading = (state: { tasks: TaskState }) => state.tasks.statsLoading;
export const selectFilters = (state: { tasks: TaskState }) => state.tasks.filters;
export const selectSorting = (state: { tasks: TaskState }) => state.tasks.sorting;
export const selectPagination = (state: { tasks: TaskState }) => state.tasks.pagination;

export const selectIsCreateOpen = (state: { tasks: TaskState }) => state.tasks.isCreateOpen;
export const selectIsEditOpen = (state: { tasks: TaskState }) => state.tasks.isEditOpen;
export const selectIsDeleteOpen = (state: { tasks: TaskState }) => state.tasks.isDeleteOpen;
export const selectActiveTask = (state: { tasks: TaskState }) => state.tasks.activeTask;
export const selectActiveTaskId = (state: { tasks: TaskState }) => state.tasks.activeTaskId;

export default taskSlice.reducer;
