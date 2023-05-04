import { Button, Container, Menu } from 'semantic-ui-react'
import { useStore } from '../stores/store'
import { Link } from 'react-router-dom'

export default function NavBar() {
    const {eventStore} = useStore()
    
    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item header as={Link} to=''>
                    <img src='/assets/logo.png' alt='logo' style={{ marginRight: 20 }} />
                    EventHub
                </Menu.Item>
                <Menu.Item header as={Link} to='errors'>
                    Errors
                </Menu.Item>
                <Menu.Item position='right'>
                    <Button onClick={() => eventStore.openModal()} content='Create Event' />
                </Menu.Item>
            </Container>
        </Menu>
    )
}