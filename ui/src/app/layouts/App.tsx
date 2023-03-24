import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Event } from '../models/event';
import NavBar from './NavBar';
import EventsDashboard from '../../features/events/dashboard/EventsDashboard';

function App() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    axios.get<Event[]>('https://localhost:7013/api/events')
      .then(response => {
        setEvents(response.data)
      })
  }, [])

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '6em'}}>
        <EventsDashboard events={events}/>
      </Container>
    </>
  );
}

export default App;
