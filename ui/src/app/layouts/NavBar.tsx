import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';

export default function NavBar() {
    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src='/assets/logo.png' alt='logo' style={{ marginRight: 20 }} />
                    EventHub
                </Menu.Item>
                <Menu.Item name='Events' />
                <Menu.Item position='right'>
                    <Button content='Create Event' />
                </Menu.Item>
            </Container>
        </Menu>
    )
}