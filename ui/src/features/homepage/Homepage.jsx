import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Segment, Image, Divider } from "semantic-ui-react";
import { useStore } from '../../app/stores/store';
import LoginForm from '../events/users/LoginForm';
import RegisterForm from '../events/users/RegisterForm';

export default observer(function HomePage() {
    const { userStore, modalStore } = useStore();

    return (
        <Segment textAlign='center' vertical className='masthead' style={{ 
            height: '80vh',
            backgroundColor: '#ededed',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            overflow: 'hidden',
            position: 'fixed'
        }}>
            <Container>
                <Image centered size='medium' src='/assets/logo.png' alt='logo' style={{ marginBottom: 15 }} />
                <Header as='h1' style={{ fontSize: '2em' }}>
                    EventHub
                </Header>
                <Divider hidden />
                {userStore.isLoggedIn ? (
                    <>
                        <Header as='h2' content={`Hello, ${userStore.user?.displayName}`} style={{ fontSize: '1.2em' }} />
                        <Button as={Link} to='/events' size='large' style={{ marginTop: '10px' }}>
                            Events
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => modalStore.openModal(<LoginForm />)} size='large' style={{ margin: '10px' }}>
                            Login
                        </Button>
                        <Divider horizontal style={{ margin: '20px 0' }}>Or</Divider>
                        <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='large' style={{ margin: '10px' }}>
                            Register
                        </Button>
                    </>
                )}
            </Container>
        </Segment>
    )
})
