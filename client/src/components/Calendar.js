import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import EventModal from './EventModal';
import { fetchEvents, updateEvent, deleteEvent } from '../redux/eventSlice';
import './Calendar.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

const Calendar = () => {
  const dispatch = useDispatch();
  const { events, status, error } = useSelector((state) => state.events);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [goalColor, setGoalColor] = useState(null);
  const [currentView, setCurrentView] = useState('week');
  
  // Current date state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showingNav, setShowingNav] = useState('today');
  
  // Calculate calendar height based on window size
  const [calendarHeight, setCalendarHeight] = useState(window.innerHeight - 120); // subtract header height
  
  useEffect(() => {
    // Set up resize listener to adjust calendar height
    const handleResize = () => {
      setCalendarHeight(window.innerHeight - 120);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end
    });
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
    setDraggedTask(null);
    setGoalColor(null);
  };

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    dispatch(updateEvent(updatedEvent));
  };

  const handleEventResize = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    dispatch(updateEvent(updatedEvent));
  };

  const handleDeleteEvent = (eventId) => {
    dispatch(deleteEvent(eventId));
    handleCloseModal();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    
    try {
      const task = JSON.parse(event.dataTransfer.getData('task'));
      const goalColor = event.dataTransfer.getData('goalColor');
      
      if (task) {
        setDraggedTask(task);
        setGoalColor(goalColor);
        
        // Create a slot based on where the task was dropped
        const calendarRect = event.currentTarget.getBoundingClientRect();
        const calendarHours = 12; // Assuming 12 hours displayed
        const hourHeight = calendarRect.height / calendarHours;
        
        const relativeY = event.clientY - calendarRect.top;
        const hour = Math.floor(relativeY / hourHeight) + 8; // Assuming calendar starts at 8 AM
        
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour + 1, 0);
        
        setSelectedSlot({
          start,
          end
        });
        
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error processing dragged task:', error);
    }
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: getCategoryColor(event.category),
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  const getCategoryColor = (category) => {
    const colors = {
      exercise: 'var(--event-exercise)',
      eating: 'var(--event-eating)',
      work: 'var(--event-work)',
      relax: 'var(--event-relax)',
      family: 'var(--event-family)',
      social: 'var(--event-social)'
    };
    return colors[category] || colors.work;
  };

  // Navigation functions
  const goToToday = () => {
    setCurrentDate(new Date());
    setShowingNav('today');
  };

  const goToNext = () => {
    let newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
    setShowingNav('next');
  };

  const goToPrevious = () => {
    let newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
    setShowingNav('back');
  };

  // Toggle navigation view
  const toggleNavigation = () => {
    if (showingNav === 'today') {
      setShowingNav('next');
    } else if (showingNav === 'next') {
      setShowingNav('back');
    } else {
      setShowingNav('today');
    }
  };

  return (
    <div 
      className="calendar-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="calendar-header">
      <div className="calendar-navigation">
          <button className="nav-arrow" onClick={goToPrevious}>
            ←
          </button>
          
          {showingNav === 'today' && (
            <button className="nav-button" onClick={goToToday}>
              Today
            </button>
          )}
          
          {showingNav === 'next' && (
            <button className="nav-button" onClick={goToNext}>
              Today
            </button>
          )}
          
          {showingNav === 'back' && (
            <button className="nav-button" onClick={goToPrevious}>
              Back
            </button>
          )}
          
          <button className="nav-arrow" onClick={goToNext}>
            →
          </button>
        </div>
        <div className="calendar-views">
          <button 
            className={currentView === 'month' ? 'active' : ''}
            onClick={() => setCurrentView('month')}
          >
            Month
          </button>
          <button 
            className={currentView === 'week' ? 'active' : ''}
            onClick={() => setCurrentView('week')}
          >
            Week
          </button>
          <button 
            className={currentView === 'day' ? 'active' : ''}
            onClick={() => setCurrentView('day')}
          >
            Day
          </button>
        </div>
        
      </div>

      <div className="calendar-wrapper">
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: calendarHeight }}
          selectable
          resizable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          eventPropGetter={eventStyleGetter}
          step={15}
          timeslots={4}
          defaultView={currentView}
          view={currentView}
          onView={setCurrentView}
          date={currentDate}
          onNavigate={date => setCurrentDate(date)}
          views={['month', 'week', 'day']}
          components={{
            event: EventComponent
          }}
        />
      </div>
      
      {modalOpen && (
        <EventModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          selectedEvent={selectedEvent}
          selectedSlot={selectedSlot}
          onDelete={handleDeleteEvent}
          draggedTask={draggedTask}
          goalColor={goalColor}
        />
      )}
    </div>
  );
};

// Custom Event Component with house emoji
const EventComponent = ({ event }) => {
  return (
    <div className="calendar-event">
      <span className="event-icon">🏠</span>
      <span className="event-title">{event.title}</span>
    </div>
  );
};

export default Calendar;