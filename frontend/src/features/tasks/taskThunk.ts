import { createAsyncThunk } from '@reduxjs/toolkit';
import * as taskService from '../../services/taskService';

// Async Thunk: Fetch Tasks
export const fetchTasksThunk = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: taskService.FetchTasksParams, { rejectWithValue }) => {
    try {
      const response = await taskService.fetchTasks(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

// Async Thunk: Create Task
export const createTaskThunk = createAsyncThunk(
  'tasks/createTask',
  async (taskData: taskService.TaskData, { dispatch, rejectWithValue }) => {
    try {
      const response = await taskService.createTask(taskData);
      // Automatically refresh statistics after a change
      dispatch(fetchTaskStatsThunk());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Async Thunk: Update Task
export const updateTaskThunk = createAsyncThunk(
  'tasks/updateTask',
  async (
    { id, taskData }: { id: string; taskData: taskService.TaskData },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await taskService.updateTask(id, taskData);
      dispatch(fetchTaskStatsThunk());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Async Thunk: Delete Task
export const deleteTaskThunk = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await taskService.deleteTask(id);
      dispatch(fetchTaskStatsThunk());
      return response.data; // contains { id }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

// Async Thunk: Fetch Task by ID
export const fetchTaskByIdThunk = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await taskService.getTaskById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch task details');
    }
  }
);

// Async Thunk: Fetch Dashboard Stats
export const fetchTaskStatsThunk = createAsyncThunk(
  'tasks/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskService.getTaskStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch stats');
    }
  }
);
