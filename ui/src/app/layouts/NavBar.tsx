import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react'
import { useStore } from '../stores/store'

export default function NavBar() {
    const {eventStore} = useStore()
    
    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src='/assets/logo.png' alt='logo' style={{ marginRight: 20 }} />
                    EventHub
                </Menu.Item>
                <Menu.Item name='Events' />
                <Menu.Item position='right'>
                    <Button onClick={() => eventStore.openModal()} content='Create Event' />
                </Menu.Item>
            </Container>
        </Menu>
    )
}