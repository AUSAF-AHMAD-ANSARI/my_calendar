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
  const { events, status } = useSelector((state) => state.events);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [goalColor, setGoalColor] = useState(null);
  const [currentView, setCurrentView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarHeight, setCalendarHeight] = useState(window.innerHeight - 120);

  useEffect(() => {
    const handleResize = () => {
      setCalendarHeight(window.innerHeight - 120);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    dispatch(updateEvent({ ...event, start, end }));
  };

  const handleEventResize = ({ event, start, end }) => {
    dispatch(updateEvent({ ...event, start, end }));
  };

  const handleDeleteEvent = (eventId) => {
    dispatch(deleteEvent(eventId));
    handleCloseModal();
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const task = JSON.parse(e.dataTransfer.getData('task'));
      const color = e.dataTransfer.getData('goalColor');
      
      if (task) {
        setDraggedTask(task);
        setGoalColor(color);
        
        const rect = e.currentTarget.getBoundingClientRect();
        const hourHeight = rect.height / 12;
        const hour = Math.floor((e.clientY - rect.top) / hourHeight) + 8;
        
        setSelectedSlot({
          start: new Date(new Date().setHours(hour, 0, 0)),
          end: new Date(new Date().setHours(hour + 1, 0, 0))
        });
        setModalOpen(true);
      }
    } catch (err) {
      console.error('Drag error:', err);
    }
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
    return colors[category] || 'var(--event-default)';
  };

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: getCategoryColor(event.category),
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    }
  });

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    const unit = currentView === 'month' ? 'Month' : 
                currentView === 'week' ? 'Date' : 'Date';
    const amount = direction === 'next' ? 
                  (currentView === 'week' ? 7 : 1) : 
                  (currentView === 'week' ? -7 : -1);
    
    newDate[`set${unit}`](newDate[`get${unit}`]() + amount);
    setCurrentDate(newDate);
  };

  return (
    <div className="calendar-container" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button onClick={() => navigateDate('prev')}>←</button>
          <button onClick={() => setCurrentDate(new Date())}>Today</button>
          <button onClick={() => navigateDate('next')}>→</button>
        </div>
        <div className="calendar-views">
          {['month', 'week', 'day'].map(view => (
            <button
              key={view}
              className={currentView === view ? 'active' : ''}
              onClick={() => setCurrentView(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
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
          defaultView={currentView}
          view={currentView}
          onView={setCurrentView}
          date={currentDate}
          onNavigate={setCurrentDate}
          components={{ event: EventComponent }}
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

const EventComponent = ({ event }) => (
  <div className="calendar-event">
    <span className="event-icon">🏠</span>
    <span className="event-title">{event.title}</span>
  </div>
);

export default Calendar;