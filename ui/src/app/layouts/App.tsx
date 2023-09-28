import React, { useEffect } from 'react'
import {  Container } from 'semantic-ui-react'
import NavBar from './NavBar'
import { observer } from 'mobx-react-lite'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useStore } from '../stores/store'
import LoadingComponent from './LoadingComponent'
import ModalContainer from '../common/modals/ModalContainer'

function App() {
  const { commonStore, userStore } = useStore()
  
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  
  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded())
    } else {
      commonStore.setAppLoaded()
    }
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading...' />

  return (
    <>
    <ScrollRestoration />
    <ModalContainer />
    <ToastContainer position='bottom-right' theme='colored' autoClose={2000} />
      <NavBar />
      <Container style={{ marginTop: '6em'}}>
        <Outlet />
      </Container>
    </>
  )
}

export default observer(App)
