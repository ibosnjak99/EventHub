import React from 'react'
import {  Container } from 'semantic-ui-react'
import NavBar from './NavBar'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
    <ToastContainer position='bottom-right' theme='colored' autoClose={2000} />
      <NavBar />
      <Container style={{ marginTop: '6em'}}>
        <Outlet />
      </Container>
    </>
  )
}

export default observer(App)
