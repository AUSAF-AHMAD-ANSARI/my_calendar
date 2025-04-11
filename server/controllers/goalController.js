const Goal = require('../models/Goal');

// Get all goals
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single goal
exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new goal
exports.createGoal = async (req, res) => {
  const goal = new Goal(req.body);
  
  try {
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update goal
exports.updateGoal = async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};