const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Public
router.get('/', taskController.getTasks);

// @route   GET /api/tasks/goal/:goalId
// @desc    Get tasks by goal ID
// @access  Public
router.get('/goal/:goalId', taskController.getTasksByGoalId);

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Public
router.get('/:id', taskController.getTaskById);

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Public
router.post('/', taskController.createTask);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Public
router.put('/:id', taskController.updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Public
router.delete('/:id', taskController.deleteTask);

module.exports = router;