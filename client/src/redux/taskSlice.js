import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/events';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const fetchTasksByGoalId = createAsyncThunk(
  'tasks/fetchTasksByGoalId',
  async (goalId) => {
    const response = await axios.get(`${API_URL}/goal/${goalId}`);
    return response.data;
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (taskData) => {
    const response = await axios.post(API_URL, taskData);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (taskData) => {
    const response = await axios.put(`${API_URL}/${taskData._id}`, taskData);
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId) => {
    await axios.delete(`${API_URL}/${taskId}`);
    return taskId;
  }
);

const initialState = {
  tasks: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Fetch tasks by goal ID
      .addCase(fetchTasksByGoalId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasksByGoalId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByGoalId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Add task
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      
     // Delete task
     .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;