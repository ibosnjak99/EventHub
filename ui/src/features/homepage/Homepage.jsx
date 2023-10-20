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
        <Segment textAlign='center' style={{ 
            backgroundColor: '#dedcdc',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            overflowX: 'hidden',
        }}>
            <Container>
                <Image centered size='small' src='/assets/logo.png' alt='logo' />
                <Header as='h2' style={{ fontSize: '1.7em' }}>
                    EventHub
                </Header>
                <Divider hidden />
                {userStore.isLoggedIn ? (
                    <>
                        <Header as='h2' content={`Hello, ${userStore.user?.displayName}`} style={{ fontSize: '1.2em' }} />
                        <Button as={Link} to='/events' size='large' color='blue' style={{ marginTop: '10px' }}>
                            Events
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => modalStore.openModal(<LoginForm />)} size='large' color='blue' style={{ margin: '10px' }}>
                            Login
                        </Button>
                        <Divider horizontal style={{ margin: '20px 0' }}>Or</Divider>
                        <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='large' color='green' style={{ margin: '10px' }}>
                            Register
                        </Button>
                    </>
                )}
            </Container>
        </Segment>
    )
})