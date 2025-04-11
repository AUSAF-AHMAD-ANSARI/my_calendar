import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { addEvent, updateEvent } from '../redux/eventSlice';
import './EventModal.css';

const EventModal = ({ isOpen, onClose, selectedEvent, selectedSlot, onDelete }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'work',
    date: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    if (selectedEvent) {
      const start = moment(selectedEvent.start);
      const end = moment(selectedEvent.end);
      
      setFormData({
        title: selectedEvent.title,
        category: selectedEvent.category || 'work',
        date: start.format('YYYY-MM-DD'),
        startTime: start.format('HH:mm'),
        endTime: end.format('HH:mm'),
      });
    } else if (selectedSlot) {
      const start = moment(selectedSlot.start);
      const end = moment(selectedSlot.end);
      
      setFormData({
        title: '',
        category: 'work',
        date: start.format('YYYY-MM-DD'),
        startTime: start.format('HH:mm'),
        endTime: end.format('HH:mm'),
      });
    }
  }, [selectedEvent, selectedSlot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { title, category, date, startTime, endTime } = formData;
    
    const startDate = moment(`${date} ${startTime}`).toDate();
    const endDate = moment(`${date} ${endTime}`).toDate();
    
    const eventData = {
      title,
      category,
      start: startDate,
      end: endDate,
    };
    
    if (selectedEvent) {
      dispatch(updateEvent({ ...eventData, _id: selectedEvent._id }));
    } else {
      dispatch(addEvent(eventData));
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{selectedEvent ? 'Edit Event' : 'Create Event'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              required
            >
              <option value="exercise">Exercise</option>
              <option value="eating">Eating</option>
              <option value="work">Work</option>
              <option value="relax">Relax</option>
              <option value="family">Family</option>
              <option value="social">Social</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group time-inputs">
            <div>
              <label>Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="button-group">
            {selectedEvent && (
              <button 
                type="button" 
                className="delete-button"
                onClick={() => onDelete(selectedEvent._id)}
              >
                Delete
              </button>
            )}
            <button type="submit" className="save-button">
              {selectedEvent ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;