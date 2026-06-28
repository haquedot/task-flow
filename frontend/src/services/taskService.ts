import api from './api';

export interface TaskData {
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
}

export interface Task extends TaskData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchTasksParams {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface FetchTasksResponse {
  success: boolean;
  message: string;
  data: {
    tasks: Task[];
    pagination: {
      totalTasks: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface TaskStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    statusCounts: {
      Pending: number;
      'In Progress': number;
      Completed: number;
    };
    priorityCounts: {
      Low: number;
      Medium: number;
      High: number;
    };
    percentages: {
      Pending: number;
      'In Progress': number;
      Completed: number;
    };
  };
}

export const fetchTasks = async (params: FetchTasksParams): Promise<FetchTasksResponse> => {
  const response = await api.get('/tasks', { params });
  return response.data;
};

export const getTaskById = async (id: string): Promise<{ success: boolean; data: Task }> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (taskData: TaskData): Promise<{ success: boolean; data: Task }> => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (id: string, taskData: TaskData): Promise<{ success: boolean; data: Task }> => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id: string): Promise<{ success: boolean; data: { id: string } }> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const getTaskStats = async (): Promise<TaskStatsResponse> => {
  const response = await api.get('/tasks/stats');
  return response.data;
};
