import React from 'react';
import { mockEvents } from '../mockData';

const EventList = ({ limit }) => {
  const events = limit ? mockEvents.slice(0, limit) : mockEvents;

  return (
    <div className="event-list">
      {events.map((event) => (
        <div key={event.id} className="event-item">
          <h3>{event.title}</h3>
          <p>Date: {event.date}</p>
          <p>Attendees: {event.attendees}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;