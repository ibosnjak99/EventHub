import React, { useState } from 'react'
import { Button, Item, Label, Modal } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import { observer } from 'mobx-react-lite'

export default observer (function EventsList() {

    const {eventStore} = useStore()
    const {deleteEvent, eventsSortedByDate } = eventStore

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [eventIdToDelete, setEventIdToDelete] = useState('')

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

    return (
        <>
            <Item.Group divided>
                {eventsSortedByDate.map(event => (
                    <Item key={event.id}>
                        <Item.Content>
                            <Item.Header>{event.title}</Item.Header>
                            <Item.Meta>{new Date(event.date).toLocaleDateString('en-GB')}</Item.Meta>
                            <Item.Description>
                                <div>{event.description}</div>
                                <div>{event.city}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button 
                                    onClick={() => eventStore.selectEvent(event.id)}
                                    floated='right' 
                                    content='View' 
                                    color='blue' 
                                />
                                <Button 
                                    onClick={() => handleDeleteEvent(event.id)}
                                    floated='right' 
                                    content='Delete' 
                                    color='red' 
                                />
                                <Label basic content={event.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
             <Modal open={showDeleteModal} size='mini'>
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
    )
})