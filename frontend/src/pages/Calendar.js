import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getDates, updateDate } from '../services/api';
import DateDetails from '../components/DateDetails';

function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const dates = await getDates();
        // Transform dates into calendar events
        const calendarEvents = dates.map(date => ({
          title: date.title,
          start: date.date,
          description: date.description,
          location_name: date.location_name,
          estimated_budget: date.estimated_budget,
          id: date.id
        }));
        setEvents(calendarEvents);
      } catch (err) {
        setError('Failed to fetch dates');
        console.error('Error fetching dates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, []);

  const handleEventClick = (info) => {
    const date = {
      id: info.event.id,
      title: info.event.title,
      date: info.event.start,
      description: info.event.extendedProps.description,
      location_name: info.event.extendedProps.location_name,
      estimated_budget: info.event.extendedProps.estimated_budget
    };
    setSelectedDate(date);
  };

  const handleEventDrop = async (info) => {
    try {
      const dateId = info.event.id;
      const newDate = info.event.start;
      
      // Get the event data directly from the event object
      const eventData = {
        title: info.event.title,
        description: info.event.extendedProps.description,
        date: newDate.toISOString(),
        location_name: info.event.extendedProps.location_name,
        estimated_budget: info.event.extendedProps.estimated_budget
      };

      // Update the date in the database
      await updateDate(dateId, eventData);
      
      // Show success message
      console.log('Date moved successfully');
    } catch (err) {
      console.error('Error updating date:', err);
      // Revert the event to its original position
      info.revert();
    }
  };

  const handleCloseDetails = () => {
    setSelectedDate(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Date Calendar</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">Loading calendar...</div>
      ) : (
        <>
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay'
              }}
              events={events}
              height="auto"
              eventClick={handleEventClick}
              editable={true}
              eventDrop={handleEventDrop}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
              }}
            />
          </div>

          {selectedDate && (
            <DateDetails
              date={selectedDate}
              onClose={handleCloseDetails}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Calendar; 