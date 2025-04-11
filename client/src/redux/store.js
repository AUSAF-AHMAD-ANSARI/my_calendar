import { configureStore } from '@reduxjs/toolkit';
import eventReducer from './eventSlice';
import goalReducer from './goalSlice';
import taskReducer from './taskSlice';

export const store = configureStore({
  reducer: {
    events: eventReducer,
    goals: goalReducer,
    tasks: taskReducer,
  },
});