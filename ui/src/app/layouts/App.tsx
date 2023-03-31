import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Event } from '../models/event';
import NavBar from './NavBar';
import EventsDashboard from '../../features/events/dashboard/EventsDashboard';
import { v4 as uuid } from 'uuid';
import client from '../api/client';
import LoadingComponent from './LoadingComponent';

function App() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    client.Events.list()
      .then(response => {
        let events: Event[] = [];
        response.forEach(event => {
          event.date = event.date.split('T')[0]
          events.push(event)
        })
        setEvents(response)
        setLoading(false)
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

  function handleCreateOrEditEvent(event: Event) {
    setSubmitting(true)
    if (event.id) {
      client.Events.update(event)
        .then(() => {
          setEvents([...events.filter(e => e.id !== event.id), event]) 
          setSelectedEvent(event)
          setEditMode(false)
          setSubmitting(false)
        })
    }
    else {
      event.id = uuid()
      client.Events.create(event)
        .then(() => {
          setEvents([...events, event])
          setSelectedEvent(event)
          setEditMode(false)
          setSubmitting(false)
        })
    }
  }

  function handleDeleteEvent(id: string) {
    setSubmitting(true)
    client.Events.delete(id)
      .then(() => {
        setEvents([...events.filter(e => e.id !== id)])
        setSelectedEvent(undefined)
        setSubmitting(false)
      })
  }

  if (loading) return <LoadingComponent content='Loading...' />

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
          createOrEdit={handleCreateOrEditEvent}
          deleteEvent={handleDeleteEvent}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
