import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/events';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const addEvent = createAsyncThunk(
  'events/addEvent',
  async (eventData) => {
    const response = await axios.post(API_URL, eventData);
    return response.data;
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async (eventData) => {
    const response = await axios.put(`${API_URL}/${eventData._id}`, eventData);
    return response.data;
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (eventId) => {
    await axios.delete(`${API_URL}/${eventId}`);
    return eventId;
  }
);

const initialState = {
  events: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Normalize dates from strings to Date objects
        state.events = action.payload.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Add event
      .addCase(addEvent.fulfilled, (state, action) => {
        const newEvent = {
          ...action.payload,
          start: new Date(action.payload.start),
          end: new Date(action.payload.end)
        };
        state.events.push(newEvent);
      })
      
      // Update event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const updatedEvent = {
          ...action.payload,
          start: new Date(action.payload.start),
          end: new Date(action.payload.end)
        };
        const index = state.events.findIndex(event => event._id === updatedEvent._id);
        if (index !== -1) {
          state.events[index] = updatedEvent;
        }
      })
      
      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(event => event._id !== action.payload);
      });
  },
});

export default eventSlice.reducer;