import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Calendar from './components/Calendar';
import TaskSidebar from './components/TaskSidebar';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <TaskSidebar />
        <Calendar />
      </div>
    </Provider>
  );
}

export default App;