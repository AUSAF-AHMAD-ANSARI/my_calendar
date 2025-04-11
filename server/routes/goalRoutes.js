const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

// @route   GET /api/goals
// @desc    Get all goals
// @access  Public
router.get('/', goalController.getGoals);

// @route   GET /api/goals/:id
// @desc    Get goal by ID
// @access  Public
router.get('/:id', goalController.getGoalById);

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Public
router.post('/', goalController.createGoal);

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Public
router.put('/:id', goalController.updateGoal);

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Public
router.delete('/:id', goalController.deleteGoal);

module.exports = router;