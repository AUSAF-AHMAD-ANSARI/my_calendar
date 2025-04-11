const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', eventController.getEvents);

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', eventController.getEventById);

// @route   POST /api/events
// @desc    Create a new event
// @access  Public
router.post('/', eventController.createEvent);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Public
router.put('/:id', eventController.updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Public
router.delete('/:id', eventController.deleteEvent);

module.exports = router;