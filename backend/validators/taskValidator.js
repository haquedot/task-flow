import { body, validationResult } from 'express-validator';

export const validateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),

  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be Pending, In Progress, or Completed'),

  body('priority')
    .trim()
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),

  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid date format')
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(value);
      if (inputDate < today) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),

  // Middleware to handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Gather all error messages and combine them or return the first one
      const errorMsg = errors.array().map(err => err.msg).join(', ');
      return res.status(400).json({
        success: false,
        message: errorMsg || 'Validation Error',
        errors: errors.array(), // detailed list for frontend forms
      });
    }
    next();
  },
];
