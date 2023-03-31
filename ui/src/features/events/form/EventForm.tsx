import React, { useState, ChangeEvent } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { Event } from '../../../app/models/event';

interface Props {
    event: Event | undefined
    closeForm: () => void
    createOrEdit: (event: Event) => void
    submitting: boolean
}

export default function EventsForm({ event: selectedEvent, closeForm, createOrEdit, submitting } : Props) {

    const initialState = selectedEvent ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: '',
    }

    const [event, setEvent] = useState(initialState)

    function handleSubmit() {
        createOrEdit(event)
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = e.target
        setEvent({...event, [name]: value})
    }

    return (
        <>
            <Modal open={true} onClose={closeForm} style={{ maxWidth: '800px' }}>
                <Modal.Header>Event</Modal.Header>
                <Modal.Content>
                    <Form autoComplete='off'>
                        <Form.Input placeholder='Title' value={event.title} name='title' onChange={handleInputChange} />
                        <Form.TextArea placeholder='Description' value={event.description} name='description' onChange={handleInputChange} />
                        <Form.Input placeholder='Category' value={event.category} name='category' onChange={handleInputChange} />
                        <Form.Input type="date" placeholder='Date' value={event.date} name='date' onChange={handleInputChange} />
                        <Form.Input placeholder='City' value={event.city} name='city' onChange={handleInputChange} />
                        <Form.Input placeholder='Venue' value={event.venue} name='venue' onChange={handleInputChange} />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button.Group widths='2'>
                        <Button onClick={closeForm} color='red' content='Cancel' />
                        <Button loading={submitting} onClick={handleSubmit} color='green' content='Submit' />
                    </Button.Group>
                </Modal.Actions>
            </Modal>
        </>
    )
}