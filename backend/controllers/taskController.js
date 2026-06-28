import Task from '../models/taskModel.js';

// @desc    Get all tasks (with searching, filtering, sorting, pagination)
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy, order, page = 1, limit = 6 } = req.query;

    const query = {};

    // Search query - title or description matching search keyword case-insensitively
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting options
    let sortOptions = {};
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOptions[sortBy] = sortOrder;
    } else {
      sortOptions['createdAt'] = -1; // Default: Newest first
    }

    const totalTasks = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalTasks / limitNum);

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        tasks,
        pagination: {
          totalTasks,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Public
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`,
      });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`,
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for tasks
// @route   GET /api/tasks/stats
// @access  Public
export const getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } },
          mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'Medium'] }, 1, 0] } },
          lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'Low'] }, 1, 0] } },
        },
      },
    ]);

    const result = stats[0] || {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
    };

    const total = result.total;
    const completedPercent = total > 0 ? Math.round((result.completed / total) * 100) : 0;
    const inProgressPercent = total > 0 ? Math.round((result.inProgress / total) * 100) : 0;
    const pendingPercent = total > 0 ? Math.round((result.pending / total) * 100) : 0;

    res.status(200).json({
      success: true,
      message: 'Task statistics retrieved successfully',
      data: {
        total,
        statusCounts: {
          Pending: result.pending,
          'In Progress': result.inProgress,
          Completed: result.completed,
        },
        priorityCounts: {
          Low: result.lowPriority,
          Medium: result.mediumPriority,
          High: result.highPriority,
        },
        percentages: {
          Pending: pendingPercent,
          'In Progress': inProgressPercent,
          Completed: completedPercent,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
