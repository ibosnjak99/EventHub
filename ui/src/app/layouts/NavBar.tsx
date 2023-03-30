import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';

interface Props {
    openForm: () => void
}

export default function NavBar({ openForm }: Props) {
    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src='/assets/logo.png' alt='logo' style={{ marginRight: 20 }} />
                    EventHub
                </Menu.Item>
                <Menu.Item name='Events' />
                <Menu.Item position='right'>
                    <Button onClick={openForm} content='Create Event' />
                </Menu.Item>
            </Container>
        </Menu>
    )
}