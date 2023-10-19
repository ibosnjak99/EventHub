import React, { useEffect, useState } from 'react'
import { Button, Card, Comment, Divider, Grid, Header, Icon, Image, Item, Label, List, Modal, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import { Link } from 'react-router-dom'
import { format, formatDistanceToNow } from 'date-fns'
import { observer } from 'mobx-react-lite'
import { Formik, Form } from 'formik'
import CustomTextArea from '../../../app/common/form/CustomTextArea'
import * as Yup from 'yup'

export default observer(function EventModal() {
    const {eventStore} = useStore()
    const {commentStore} = useStore()
    const {selectedEvent: event, openModal, unselectEvent, deleteEvent, updateAttendance, cancelEventToggle, loading} = eventStore
    
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [eventIdToDelete, setEventIdToDelete] = useState('')
    const [showGoingList, setShowGoingList] = useState(false)

    useEffect(() => {
        if (event!.id) {
            commentStore.createHubConnection(event!.id)
        }

        return () => {
            commentStore.clearComments()
        }
    }, [commentStore, event])

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
            <Modal open={true} onClose={unselectEvent} dimmer size='large'>
                {event.isCancelled &&
                    <Label attached='top' color='red' content='Cancelled' />
                }
                <Modal.Header>
                    <Header as='h2'>{event.title}</Header>
                </Modal.Header>
                <Modal.Content scrolling>
                    <Card fluid raised>
                        <Image src={`/assets/categoryImages/${event.category}.jpg`} centered wrapped ui={false} style={{width: '70%', margin: 'auto'}} 
/>
                        <Card.Content>
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
                                    <Item style={{ position: 'relative' }} key={attendee.userName} as={Link} to={`/profile/${attendee.userName}`}>
                                        {attendee.userName === event.host?.userName &&
                                            <Label
                                                style={{ position: 'absolute' }}
                                                color='orange'
                                                ribbon='right'
                                            >
                                                Host
                                            </Label>
                                        }
                                        <Image size='mini' circular src={attendee.image ||'/assets/user.png'} />
                                        <Item.Content verticalAlign='middle'>
                                            <Item.Header as='h4'>
                                                <Header size='tiny' to={`/profile/${attendee.userName}`}>{attendee.displayName}</Header>
                                            </Item.Header>
                                            {attendee.following &&
                                                <Item.Extra style={{ color: 'orange', fontSize: '.8em' }}>Following</Item.Extra>
                                            }
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
                        </Card.Content>
                        <Card.Content extra>
                            {event.isHost ? (
                                <Button.Group widths='3'>
                                    <Button onClick={() => openModal(event.id)} color='blue' icon='edit' content='Edit' />
                                    <Button onClick={() => handleDeleteEvent(event.id)} color='red' icon='delete' content='Delete' />
                                    <Button 
                                        onClick={cancelEventToggle} 
                                        color={event.isCancelled ? 'green' : 'black'} 
                                        icon={event.isCancelled ? 'redo' : 'cancel'}
                                        content={event.isCancelled ? 'Reactivate' : 'Cancel'}  
                                    />
                                </Button.Group>
                            ) : event.isGoing ? (
                                <Button.Group widths='2'>
                                    <Button onClick={updateAttendance} loading={loading} color='red' content='Cancel attendance' />
                                </Button.Group>
                            ) : (
                                <Button.Group widths='2'>
                                    <Button disabled={event.isCancelled} onClick={updateAttendance} loading={loading} color='blue' content='Join event' />
                                </Button.Group>
                            )}
                        </Card.Content>
                    </Card>
                    <Divider horizontal style={{ marginTop: '20px' }}>
                        <Header as='h3'>
                            <Icon name='comment' />
                            Comments
                        </Header>
                    </Divider>
                    <Segment attached clearing>
                        <Formik 
                            onSubmit={(values, {resetForm}) => commentStore.addComment(values).then(() => resetForm())}
                            initialValues={{body: ''}}
                            validationSchema={Yup.object({
                                body: Yup.string().required()
                            })}
                        >
                            {({ isSubmitting, isValid }) => (
                                <Form style={{ marginTop: '10px'}} className='ui form'>
                                    <CustomTextArea placeholder='Reply...' name='body' rows={2} />
                                    <Button
                                        loading={isSubmitting}
                                        disabled={isSubmitting || !isValid}
                                        content='Add Reply'
                                        labelPosition='left'
                                        icon='edit'
                                        primary
                                        type='submit'
                                        floated='right'
                                    />
                                </Form>
                            )}
                        </Formik>
                        <Comment.Group style={{maxWidth: '100%', marginTop: '50px'}}>
                            {commentStore.comments.map(comment => (
                                <Comment key={comment.id}>
                                    <Comment.Avatar src={comment.image || '/assets/user.png'}/>
                                    <Comment.Content>
                                        <Comment.Author as={Link} to={`/profile/${comment.username}`}>{comment.displayName}</Comment.Author>
                                        <Comment.Metadata>
                                            <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                        </Comment.Metadata>
                                        <Comment.Text>{comment.body}</Comment.Text>
                                    </Comment.Content>
                                </Comment>
                            ))}
                        </Comment.Group>
                    </Segment>
                </Modal.Content>
            </Modal>
            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} size='tiny'>
                <Modal.Header>Delete Event</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this event? This action cannot be undone.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic onClick={handleCancelDelete}>
                        <Icon name='remove' /> No
                    </Button>
                    <Button color='red' onClick={handleConfirmDelete}>
                        <Icon name='checkmark' /> Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
});