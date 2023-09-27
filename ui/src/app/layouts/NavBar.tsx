import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react'
import { useStore } from '../stores/store'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

export default observer(function NavBar() {
    const {eventStore: {openModal}} = useStore()
    const {userStore: {user, logout}} = useStore()
    
    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item header as={Link} to='/events'>
                    <img src='/assets/logo.png' alt='logo' style={{ marginRight: 20 }} />
                    EventHub
                </Menu.Item>
                {/* <Menu.Item header as={Link} to='errors'>
                    Errors
                </Menu.Item> */}
                {/* <Menu.Item header as={Link} to='/'>
                    Login
                </Menu.Item> */}
                <Menu.Item position='right'>
                    <Button onClick={() => openModal()} content='Create Event' />
                </Menu.Item>
                <Menu.Item position='right'>
                    <Image src={user?.image || '/assets/user.png'} avatar spaced='right' />
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/profile/${user?.username}`} text='My profile' icon='user' />
                            <Dropdown.Item onClick={logout} text='Log out' icon='power' />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    )
})