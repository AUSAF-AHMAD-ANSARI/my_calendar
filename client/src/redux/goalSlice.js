import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/events';
export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const addGoal = createAsyncThunk(
  'goals/addGoal',
  async (goalData) => {
    const response = await axios.post(API_URL, goalData);
    return response.data;
  }
);

export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async (goalData) => {
    const response = await axios.put(`${API_URL}/${goalData._id}`, goalData);
    return response.data;
  }
);

export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (goalId) => {
    await axios.delete(`${API_URL}/${goalId}`);
    return goalId;
  }
);

const initialState = {
  goals: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch goals
      .addCase(fetchGoals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Add goal
      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      
      // Update goal
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(goal => goal._id === action.payload._id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      
      // Delete goal
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter(goal => goal._id !== action.payload);
      });
  },
});

export default goalSlice.reducer;