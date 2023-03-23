import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Header } from 'semantic-ui-react';
import List from 'semantic-ui-react/dist/commonjs/elements/List';

function App() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    axios.get('https://localhost:7013/api/events')
      .then(response => {
        setEvents(response.data)
      })
  }, [])

  return (
    <>
      <Header as='h2' icon='users' content='EventHub' />
      <List>
          {events.map((event: any) => (
            <List.Item key={event.id}>
              {event.title}
            </List.Item>
          ))}
      </List>
    </>
  );
}

export default App;
