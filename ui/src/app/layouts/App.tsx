import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Event } from '../models/event';
import NavBar from './NavBar';
import EventsDashboard from '../../features/events/dashboard/EventsDashboard';

function App() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    axios.get<Event[]>('https://localhost:7013/api/events')
      .then(response => {
        setEvents(response.data)
      })
  }, [])

  function handleSelectEvent(id: string) {
    setSelectedEvent(events.find(e => e.id === id))
  }

  function handleUnselectEvent() {
    setSelectedEvent(undefined)
  }

  function handleOpenForm(id?: string) {
    id ? handleSelectEvent(id) : handleUnselectEvent()
    setEditMode(true)
  }

  function handleCloseForm() {
    setEditMode(false)
  }

  return (
    <>
      <NavBar openForm={handleOpenForm} />
      <Container style={{ marginTop: '6em'}}>
        <EventsDashboard 
          events={events}
          selectedEvent={selectedEvent}
          selectEvent={handleSelectEvent}
          unselectEvent={handleUnselectEvent}
          editMode={editMode}
          openForm={handleOpenForm}
          closeForm={handleCloseForm}
        />
      </Container>
    </>
  );
}

export default App;
