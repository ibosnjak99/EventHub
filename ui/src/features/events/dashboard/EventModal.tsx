import React, { useState } from 'react'
import { Button, Card, Comment, Divider, Grid, Header, Icon, Image, Item, Label, List, Modal, Segment, Form } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { observer } from 'mobx-react-lite'

export default observer(function EventModal() {
    const {eventStore} = useStore()
    const {selectedEvent: event, openModal, unselectEvent, deleteEvent, updateAttendance} = eventStore
    
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [eventIdToDelete, setEventIdToDelete] = useState('')
    const [showGoingList, setShowGoingList] = useState(false)


    if (!event) return null

    function handleDeleteEvent(id: string) {
        setEventIdToDelete(id)
        setShowDeleteModal(true)
    }

    function handleConfirmDelete() {
        deleteEvent(eventIdToDelete)
        setShowDeleteModal(false)
    }

    function handleCancelDelete() {
        setShowDeleteModal(false)
    }

    function handleGoingListClick() {
        setShowGoingList(!showGoingList)
      }

    return (
        <>
            <Modal open={true} onClose={unselectEvent} >
                <Modal.Header>{event.title}</Modal.Header>
                <Modal.Content scrolling>
                    <Card fluid>
                        <Image src={`/assets/categoryImages/${event.category}.jpg`} centered />
                        <Card.Content>
                        <Segment
                            textAlign='center'
                            style={{ border: 'none', cursor: 'pointer' }}
                            attached='top'
                            secondary
                            inverted
                            color='teal'
                            onClick={handleGoingListClick}
                        >
                            <Header as='h4'>
                                {event.attendees!.length} {event.attendees!.length === 1 ? 'person' : 'people'} going
                                <Icon name={showGoingList ? 'angle double up' : 'angle double down'} />
                            </Header>
                        </Segment>
                        {showGoingList && (
                        <Segment attached='bottom' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            <List divided style={{ width: '90%', margin: 'auto' }}>
                                {event.attendees!.map(attendee => (
                                    <Item style={{ position: 'relative' }} key={attendee.userName}>
                                        {attendee.userName === event.host?.userName &&
                                            <Label
                                                style={{ position: 'absolute' }}
                                                color='orange'
                                                ribbon='right'
                                            >
                                                Host
                                            </Label>
                                        }
                                        <Image size='mini' src={attendee.image ||'/assets/user.png'} />
                                        <Item.Content verticalAlign='middle'>
                                            <Item.Header as='h4'>
                                                <Link to={`/profiles/${attendee.userName}`}>{attendee.displayName}</Link>
                                            </Item.Header>
                                            <Item.Extra style={{ color: 'orange', fontSize: '.8em' }}>Following</Item.Extra>
                                        </Item.Content>
                                    </Item>
                                ))}
                            </List>
                        </Segment>
                        )}
                        <Divider/>
                        <Grid>
                            <Grid.Column width={1}>
                                <Icon size='large' color='teal' name='info'/>
                            </Grid.Column>
                            <Grid.Column width={15}>
                                <p>{event.description}</p>
                            </Grid.Column>
                        </Grid>
                        <Divider style={{ opacity: '0.5' }}/>

                        <Grid verticalAlign='middle'>
                            <Grid.Column width={1}>
                                <Icon name='calendar' size='large' color='teal'/>
                            </Grid.Column>
                            <Grid.Column width={15}>
                                <span>
                                {format(event.date!, 'dd/MM/yyyy HH:mm')}
                                </span>
                            </Grid.Column>
                        </Grid>
                        <Divider style={{ opacity: '0.5' }}/>

                        <Grid verticalAlign='middle'>
                            <Grid.Column width={1}>
                                <Icon name='marker' size='large' color='teal'/>
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <span>{event.venue}, {event.city}</span>
                            </Grid.Column>
                        </Grid>
                        </Card.Content>

                        {event.isHost ? (
                            <Modal.Actions id='editor'>
                                <Button.Group widths='3'>
                                    <Button onClick={() => openModal(event.id)} color='blue' content='Edit' />
                                    <Button onClick={() => handleDeleteEvent(event.id)} color='red' content='Delete' />
                                </Button.Group>
                            </Modal.Actions>
                        ) : event.isGoing ? (
                            <Modal.Actions id='user'>
                                <Button.Group widths='2'>
                                    <Button onClick={updateAttendance} content='Cancel attendance' />
                                </Button.Group>
                            </Modal.Actions>
                        ) : (
                            <Modal.Actions id='user'>
                                <Button.Group widths='2'>
                                    <Button onClick={updateAttendance} color='blue' content='Join event' />
                                </Button.Group>
                            </Modal.Actions>
                        )}
                    </Card>
                    <Divider />
                    <Segment
                        textAlign='center'
                        attached='top'
                        inverted
                        color='teal'
                        style={{border: 'none'}}
                    >
                        <Header>Comment Section</Header>
                    </Segment>
                    <Segment attached>
                        <Comment.Group>
                            <Comment>
                                <Comment.Avatar src='/assets/user.png'/>
                                <Comment.Content>
                                    <Comment.Author as='a'>Matt</Comment.Author>
                                    <Comment.Metadata>
                                        <div>Today at 5:42PM</div>
                                    </Comment.Metadata>
                                    <Comment.Text>How artistic!</Comment.Text>
                                    <Comment.Actions>
                                        <Comment.Action>Reply</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                            </Comment>

                            <Comment>
                                <Comment.Avatar src='/assets/user.png'/>
                                <Comment.Content>
                                    <Comment.Author as='a'>Joe Henderson</Comment.Author>
                                    <Comment.Metadata>
                                        <div>5 days ago</div>
                                    </Comment.Metadata>
                                    <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
                                    <Comment.Actions>
                                        <Comment.Action>Reply</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                            </Comment>

                            <Form style={{ marginTop: '10px'}}>
                                <Form.TextArea placeholder='Reply...' />
                                <Button
                                    content='Add Reply'
                                    labelPosition='left'
                                    icon='edit'
                                    primary
                                />
                            </Form>
                        </Comment.Group>
                    </Segment>

                </Modal.Content>
            </Modal>
            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false) } size='mini'>
                <Modal.Header>Are you sure you want to delete this event?</Modal.Header>
                <Modal.Content>
                    <p>This action cannot be undone.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color='red'>Confirm</Button>
                </Modal.Actions>
            </Modal>
        </>
)});