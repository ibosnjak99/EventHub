import React, { useEffect, useState } from 'react'
import {  Container } from 'semantic-ui-react'
import { Event } from '../models/event'
import NavBar from './NavBar'
import EventsDashboard from '../../features/events/dashboard/EventsDashboard'
import client from '../api/client'
import LoadingComponent from './LoadingComponent'
import { useStore } from '../stores/store'
import { observer } from 'mobx-react-lite'

function App() {
  const {eventStore} = useStore()

  const [eventsSortedByDate, setEvents] = useState<Event[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    eventStore.loadEvents()
  }, [eventStore])

  function handleDeleteEvent(id: string) {
    setSubmitting(true)
    client.Events.delete(id)
      .then(() => {
        setEvents([...eventsSortedByDate.filter(e => e.id !== id)])
        setSubmitting(false)
      })
  }

  if (eventStore.loadingInitial) return <LoadingComponent content='Loading...' />

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '6em'}}>
        <EventsDashboard 
          events={eventStore.eventsSortedByDate}
          deleteEvent={handleDeleteEvent}
          submitting={submitting}
        />
      </Container>
    </>
  )
}

export default observer(App)
