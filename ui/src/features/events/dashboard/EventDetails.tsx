import React, { useState } from 'react';
import { Button, Card, Image, Modal } from 'semantic-ui-react';
import { Event } from '../../../app/models/event';

interface Props {
    event: Event
    unselectEvent: () => void
    openForm: (id: string) => void
    closeForm: () => void
    deleteEvent: (id: string) => void
}

export default function EventDetails({ event, unselectEvent, openForm, closeForm, deleteEvent }: Props) {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState('');

    function handleDeleteEvent(id: string) {
        setEventIdToDelete(id);
        setShowDeleteModal(true);
    }

    function handleConfirmDelete() {
        deleteEvent(eventIdToDelete);
        setShowDeleteModal(false);
    }

    function handleCancelDelete() {
        setShowDeleteModal(false);
    }

    return (
        <>
            <Modal open={true} onClose={unselectEvent} style={{ maxWidth: '800px' }}>
                <Modal.Header>Details</Modal.Header>
                <Modal.Content>
                    <Card fluid>
                    <Image src={`/assets/categoryImages/${event.category}.jpg`} />
                    <Card.Content>
                        <Card.Header>{event.title}</Card.Header>
                        <Card.Meta>
                            <span>{new Date(event.date).toLocaleDateString('en-GB')}</span>
                        </Card.Meta>
                        <Card.Description>
                            {event.description}
                        </Card.Description>
                        <Card.Description>
                            {event.venue}, {event.city}
                        </Card.Description>
                    </Card.Content>
                    <Modal.Actions>
                        <Button.Group widths='3'>
                            <Button onClick={() => openForm(event.id)} color='blue' content='Edit' />
                            <Button onClick={() => handleDeleteEvent(event.id)} color='red' content='Delete' />
                            <Button onClick={() => {unselectEvent(); closeForm();}} content='Cancel' />
                        </Button.Group>
                    </Modal.Actions>
                    </Card>
                </Modal.Content>
            </Modal>
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
}