import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController.js';
import { validateTask } from '../validators/taskValidator.js';

const router = express.Router();

// Route: /api/tasks
router.route('/')
  .get(getTasks)
  .post(validateTask, createTask);

// Route: /api/tasks/stats (Must be before /:id)
router.route('/stats')
  .get(getTaskStats);

// Route: /api/tasks/:id
router.route('/:id')
  .get(getTaskById)
  .put(validateTask, updateTask)
  .delete(deleteTask);

export default router;
