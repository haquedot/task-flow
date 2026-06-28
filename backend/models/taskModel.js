import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      index: true, // Index title for search optimization
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: 'Status must be Pending, In Progress, or Completed',
      },
      default: 'Pending',
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High',
      },
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
