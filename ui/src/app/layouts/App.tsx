import React, { useEffect } from 'react'
import {  Container } from 'semantic-ui-react'
import NavBar from './NavBar'
import EventsDashboard from '../../features/events/dashboard/EventsDashboard'
import LoadingComponent from './LoadingComponent'
import { useStore } from '../stores/store'
import { observer } from 'mobx-react-lite'

function App() {
  const {eventStore} = useStore()

  useEffect(() => {
    eventStore.loadEvents()
  }, [eventStore])

  if (eventStore.loadingInitial) return <LoadingComponent content='Loading...' />

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '6em'}}>
        <EventsDashboard />
      </Container>
    </>
  )
}

export default observer(App)
