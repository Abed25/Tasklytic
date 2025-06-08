import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, addDays, addMonths } from 'date-fns';
import { FaCalendarAlt, FaClock, FaRedo } from 'react-icons/fa';
import '../styles/TaskScheduler.css';

const TaskScheduler = ({ task, onScheduleUpdate }) => {
  const [selectedDate, setSelectedDate] = useState(task.dueDate ? new Date(task.dueDate) : null);
  const [recurring, setRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState('daily');
  const [recurringEnd, setRecurringEnd] = useState(null);

  const handleDateSelect = (selectInfo) => {
    setSelectedDate(selectInfo.start);
    onScheduleUpdate({
      startDate: selectInfo.start,
      endDate: selectInfo.end,
      recurring: false
    });
  };

  const handleRecurringChange = (e) => {
    const isRecurring = e.target.checked;
    setRecurring(isRecurring);
    if (!isRecurring) {
      setRecurringType('daily');
      setRecurringEnd(null);
    }
  };

  const handleRecurringTypeChange = (e) => {
    setRecurringType(e.target.value);
  };

  const handleRecurringEndChange = (e) => {
    setRecurringEnd(e.target.value);
  };

  const getRecurringEndDate = () => {
    if (!selectedDate || !recurringEnd) return null;
    
    const endDate = new Date(selectedDate);
    switch (recurringEnd) {
      case 'week':
        return addDays(endDate, 7);
      case 'month':
        return addMonths(endDate, 1);
      case 'year':
        return addMonths(endDate, 12);
      default:
        return null;
    }
  };

  const handleSaveSchedule = () => {
    const scheduleData = {
      startDate: selectedDate,
      endDate: getRecurringEndDate(),
      recurring,
      recurringType,
      recurringEnd
    };
    onScheduleUpdate(scheduleData);
  };

  return (
    <div className="task-scheduler">
      <div className="scheduler-header">
        <h3>
          <FaCalendarAlt /> Schedule Task
        </h3>
        <div className="scheduler-actions">
          <button 
            className="save-schedule-btn"
            onClick={handleSaveSchedule}
            disabled={!selectedDate}
          >
            Save Schedule
          </button>
        </div>
      </div>

      <div className="scheduler-content">
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={selectedDate ? [{
              title: task.taskName,
              start: selectedDate,
              end: getRecurringEndDate(),
              allDay: true
            }] : []}
            select={handleDateSelect}
            height="auto"
          />
        </div>

        <div className="scheduler-options">
          <div className="option-group">
            <label className="recurring-toggle">
              <input
                type="checkbox"
                checked={recurring}
                onChange={handleRecurringChange}
              />
              <span>Make this a recurring task</span>
            </label>

            {recurring && (
              <>
                <div className="recurring-options">
                  <label>
                    <FaRedo /> Repeat every
                    <select
                      value={recurringType}
                      onChange={handleRecurringTypeChange}
                      className="recurring-select"
                    >
                      <option value="daily">Day</option>
                      <option value="weekly">Week</option>
                      <option value="monthly">Month</option>
                      <option value="yearly">Year</option>
                    </select>
                  </label>

                  <label>
                    <FaClock /> End after
                    <select
                      value={recurringEnd}
                      onChange={handleRecurringEndChange}
                      className="recurring-select"
                    >
                      <option value="week">1 Week</option>
                      <option value="month">1 Month</option>
                      <option value="year">1 Year</option>
                    </select>
                  </label>
                </div>
              </>
            )}
          </div>

          {selectedDate && (
            <div className="selected-date">
              <h4>Selected Schedule</h4>
              <p>
                <strong>Start:</strong> {format(selectedDate, 'PPP')}
              </p>
              {recurring && recurringEnd && (
                <p>
                  <strong>End:</strong> {format(getRecurringEndDate(), 'PPP')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskScheduler; 