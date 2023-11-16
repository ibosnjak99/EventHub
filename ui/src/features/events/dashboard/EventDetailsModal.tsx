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
    const {eventStore, commentStore, userStore: {user}} = useStore()
    const {selectedEvent: event, openModal, unselectEvent, deleteEvent, updateAttendance, handlePayment, cancelEventToggle, loading} = eventStore
    
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [eventIdToDelete, setEventIdToDelete] = useState('')
    const [showGuestList, setShowGuestList] = useState(false)

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

    function handleGuestListClick() {
        setShowGuestList(!showGuestList)
    }
console.log(event)
    const eventIsPast = event.date ? new Date(event.date) < new Date() : false;

      return (
        <>
            <Modal open={true} onClose={unselectEvent} dimmer size="small" style={{ height: '90%'}}>
                {event.isCancelled &&
                    <Label attached='top' color='red' content='Cancelled' />
                }
                <Modal.Header>
                    <Header as='h2'>{event.title}</Header>
                </Modal.Header>
                <Modal.Content>
                    <Card fluid raised>
                        <Image src={`/assets/categoryImages/${event.category}.jpg`} centered wrapped ui={false} />
                        <Card.Content>
                            <Segment
                                textAlign='center'
                                style={{ border: 'none', cursor: 'pointer' }}
                                attached='top'
                                secondary
                                inverted
                                color='blue'
                                onClick={handleGuestListClick}
                            >
                                <Header as='h4'>
                                    {event.attendees!.length} {event.attendees!.length === 1 ? 'guest' : 'guests'}
                                    <Icon name={showGuestList ? 'angle double up' : 'angle double down'} />
                                </Header>
                            </Segment>
                            {showGuestList && (
                            <Segment attached='bottom' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                <List divided style={{ width: '90%', margin: 'auto' }}>
                                    {event.attendees!.map(attendee => (
                                        <Item 
                                            style={{ position: 'relative', display: 'flex', alignItems: 'center' }} 
                                            key={attendee.userName} 
                                            as={Link} 
                                            to={`/profile/${attendee.userName}`}
                                            onClick={() => { unselectEvent()}}
                                        >
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
                                <Grid.Column width={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size='large' color='blue' name='info'/>
                                </Grid.Column>
                                <Grid.Column width={14}>
                                    <p style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{event.description}</p>
                                </Grid.Column>
                            </Grid>
                            <Divider style={{ opacity: '0.5' }}/>

                            <Grid>
                                <Grid.Column width={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size='large' color='blue' name='calendar'/>
                                </Grid.Column>
                                <Grid.Column width={14}>
                                    <p style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                        <span>{format(event.date!, 'dd/MM/yyyy HH:mm')}</span>
                                    </p>
                                </Grid.Column>
                            </Grid>
                            <Divider style={{ opacity: '0.5' }}/>

                            <Grid>
                                <Grid.Column width={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size='large' color='blue' name='marker'/>
                                </Grid.Column>
                                <Grid.Column width={14}>
                                    <p style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}><span>{event.venue}, {event.city}</span></p>
                                </Grid.Column>
                            </Grid>
                            <Divider style={{ opacity: '0.5' }}/>

                            <Grid>
                                <Grid.Column width={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size='large' color='blue' name='euro'/>
                                </Grid.Column>
                                <Grid.Column width={14}>
                                    <p style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                        <span>
                                        {event.price === 0 ? 'Free' : `${event.price} €`}
                                        </span>
                                    </p>
                                    </Grid.Column>
                            </Grid>
                        </Card.Content>
                        <Card.Content extra>
                            {event.isHost && !eventIsPast ? (
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
                            ) : event.isGoing && !eventIsPast ? (
                                <Button.Group widths='2'>
                                    <Button onClick={updateAttendance} loading={loading} color='red' content='Cancel attendance' />
                                </Button.Group>
                            ) : user?.isModerator && !eventIsPast ? (
                                <Button.Group widths='3'>
                                    <Button onClick={() => openModal(event.id)} color='blue' icon='edit' content='Edit' />
                                    <Button onClick={() => handleDeleteEvent(event.id)} color='red' icon='delete' content='Delete' />
                                </Button.Group>
                            ) : user?.isModerator && eventIsPast ? (
                                <Button.Group widths='3'>
                                    <Button disabled onClick={() => openModal(event.id)} color='blue' icon='edit' content='Edit' />
                                    <Button disabled onClick={() => handleDeleteEvent(event.id)} color='red' icon='delete' content='Delete' />
                                </Button.Group>
                            ) : !user?.isModerator && event.price && event.price > 0 ? (
                                <Button.Group widths='2'>
                                    <Button disabled={event.isCancelled || eventIsPast} onClick={() => handlePayment(event.price ?? 0)} loading={loading} color='blue' content={`Join event for ${event.price}€`} />
                                </Button.Group>
                            ) : (
                                <Button.Group widths='2'>
                                    <Button disabled={event.isCancelled || eventIsPast} onClick={updateAttendance} loading={loading} color='blue' content='Join event for free' />
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
                        { !user?.isModerator &&
                            <Formik 
                                onSubmit={(values, {resetForm}) => commentStore.addComment(values).then(() => resetForm())}
                                initialValues={{body: ''}}
                                validationSchema={Yup.object({
                                    body: Yup.string().required()
                                })}
                            >
                                {({ isSubmitting, isValid }) => (
                                    <Form className='ui form'>
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
                        }
                        <Comment.Group style={{ maxWidth: '100%', marginTop: '70px' }}>
                            {commentStore.comments.length > 0 ? (
                                commentStore.comments.map(comment => (
                                    <Comment key={comment.id}>
                                        <Comment.Avatar src={comment.image || '/assets/user.png'} />
                                        <Comment.Content>
                                            <Comment.Author as={Link} to={`/profile/${comment.username}`}>
                                                {comment.displayName}
                                            </Comment.Author>
                                            <Comment.Metadata>
                                                <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                            </Comment.Metadata>
                                            <Comment.Text>{comment.body}</Comment.Text>
                                        </Comment.Content>
                                    </Comment>
                                ))
                            ) : (
                                <Label style={{ 
                                    margin: '0 auto',
                                    fontSize: '1em'
                                }}>
                                    No comments...(yet)
                                </Label>
                            )}
                        </Comment.Group>
                    </Segment>
                </Modal.Content>
            </Modal>
            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false) } size='tiny'>
                <Modal.Header>Delete Event</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this event?</p>
                    <p>This action cannot be undone.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCancelDelete}>
                        <Icon name='remove' /> No
                    </Button>
                    <Button color='red' onClick={handleConfirmDelete}>
                        <Icon name='checkmark' /> Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    )
})