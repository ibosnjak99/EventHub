import { Container, Dropdown, Image, Menu } from 'semantic-ui-react'
import { useStore } from '../stores/store'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

export default observer(function NavBar() {
    const {userStore: {user, logout}} = useStore()

    return (
        <Menu fixed='top' borderless inverted color='blue' style={{ opacity: 0.95 }}>
            <Container style={{justifyContent: 'space-between'}}>
                <Menu.Item header as={Link} to='/events'>
                    <img src='/assets/logo.png' alt='logo' style={{ marginRight: 15 }} />
                    EventHub
                </Menu.Item>
                 <Menu.Item>
                    <Image
                        src={user?.image || '/assets/user.png'} 
                        avatar 
                        spaced='right' 
                        style={{ width: '40px', height: '40px' }} 
                    />
                    <Dropdown pointing='top left' text={user?.displayName} simple item>
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