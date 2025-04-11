import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGoals } from '../redux/goalSlice';
import { fetchTasksByGoalId } from '../redux/taskSlice';
import './TaskSidebar.css';

const TaskSidebar = () => {
  const dispatch = useDispatch();
  const { goals, status: goalsStatus } = useSelector(state => state.goals);
  const { tasks, status: tasksStatus } = useSelector(state => state.tasks);
  
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    if (goalsStatus === 'idle') {
      dispatch(fetchGoals());
    }
  }, [goalsStatus, dispatch]);

  useEffect(() => {
    if (selectedGoal) {
      dispatch(fetchTasksByGoalId(selectedGoal._id));
    }
  }, [selectedGoal, dispatch]);

  // Add timeout to retry API call if it fails
  useEffect(() => {
    if (goalsStatus === 'failed') {
      const timer = setTimeout(() => {
        dispatch(fetchGoals());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [goalsStatus, dispatch]);

  const handleGoalClick = (goal) => {
    setSelectedGoal(goal);
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('task', JSON.stringify(task));
    e.dataTransfer.setData('goalColor', selectedGoal ? selectedGoal.color : '#808080');
  };

  const goalColors = {
    "Be fit": "#f4a142",
    "Academics": "#42f48f",
    "LEARN": "#4286f4",
    "Sports": "#f44242"
  };

  // Sample data for demonstration
  const sampleGoals = [
    { _id: "1", title: "Be fit", color: goalColors["Be fit"] },
    { _id: "2", title: "Academics", color: goalColors["Academics"] },
    { _id: "3", title: "LEARN", color: goalColors["LEARN"] },
    { _id: "4", title: "Sports", color: goalColors["Sports"] }
  ];

  const sampleTasks = {
    "1": [
      { _id: "101", title: "Daily workout", completed: false },
      { _id: "102", title: "Jogging", completed: false },
    ],
    "2": [
      { _id: "201", title: "Study session", completed: false },
      { _id: "202", title: "Research", completed: false }
    ],
    "3": [
      { _id: "301", title: "AI based agents", completed: false },
      { _id: "302", title: "MLE", completed: false },
      { _id: "303", title: "DE related", completed: false },
      { _id: "304", title: "Basics", completed: false }
    ],
    "4": [
      { _id: "401", title: "Practice", completed: false },
      { _id: "402", title: "Game day", completed: false }
    ]
  };

  // Use actual data if available, otherwise use sample data
  const displayGoals = goals.length > 0 ? goals : sampleGoals;
  const displayTasks = tasks.length > 0 ? tasks : 
                       (selectedGoal ? sampleTasks[selectedGoal._id] || [] : []);
  
  // Navigation logic
  const totalPages = Math.ceil(displayGoals.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleGoals = displayGoals.slice(startIndex, startIndex + itemsPerPage);
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(0); // Loop back to start
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-section">
        <h3>GOALS</h3>
        <div className="goals-list">
          {goalsStatus === 'loading' ? (
            <p className="loading-text">Loading...</p>
          ) : visibleGoals.length > 0 ? (
            <ul>
              {visibleGoals.map(goal => (
                <li 
                  key={goal._id} 
                  onClick={() => handleGoalClick(goal)}
                  className={`goal-item ${selectedGoal && selectedGoal._id === goal._id ? 'selected' : ''}`}
                  style={{ backgroundColor: selectedGoal && selectedGoal._id === goal._id ? goal.color + '20' : '#fff8f0' }}
                >
                  <span className="goal-icon">🏛️</span>
                  <span className="goal-title">{goal.title}</span>
                  {goal._id === "3" && <div className="goal-border"></div>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-message">No goals found</p>
          )}
          <div className="navigation-controls">
            <button onClick={nextPage} className="nav-arrow">→</button>
          </div>
        </div>
      </div>
      
      <div className="sidebar-section">
        <h3>TASKS</h3>
        <div className="tasks-list">
          {!selectedGoal ? (
            <p className="hint-message">Select a goal to see tasks</p>
          ) : tasksStatus === 'loading' ? (
            <p className="loading-text">Loading tasks...</p>
          ) : displayTasks.length > 0 ? (
            <ul>
              {displayTasks.map(task => (
                <li 
                  key={task._id}
                  className="task-item"
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, task)}
                >
                  <div className="task-content">
                    <span className="task-icon">🏛️</span>
                    <span className="task-title">{task.title}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-message">No tasks for this goal</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskSidebar;