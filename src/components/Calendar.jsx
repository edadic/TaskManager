import React from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../context/AuthContext';
import TaskDetail from './TaskDetail';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const CalendarView = ({ tasks }) => {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = React.useState(null);
  
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: new Date(task.due_date),
    end: new Date(task.due_date),
    allDay: true,
    resource: task // Store the entire task object
  }));

  const filteredEvents = user.role === 'admin' 
    ? events 
    : events.filter(event => event.resource.assigned_to === user.id);

  const eventStyleGetter = (event) => {
    const task = event.resource;
    let style = {
      backgroundColor: '#3B82F6',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block',
      padding: '4px 8px'
    };

    if (task.completed) {
      style.backgroundColor = '#10B981';
    } else if (task.priority === 'high') {
      style.backgroundColor = '#EF4444';
    } else if (task.priority === 'medium') {
      style.backgroundColor = '#F59E0B';
    }

    return { style };
  };

  const handleSelectEvent = (event) => {
    setSelectedTask(event.resource);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="h-[calc(100vh-240px)]">
        <BigCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          onSelectEvent={handleSelectEvent}
          popup
          selectable
          className="rounded-lg"
        />
      </div>
      
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default CalendarView;