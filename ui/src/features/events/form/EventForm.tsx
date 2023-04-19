import React, { useState, ChangeEvent } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import { observer } from 'mobx-react-lite'

export default observer (function EventsForm() {
    const {eventStore} = useStore()
    const {selectedEvent, closeModal, createEvent, updateEvent, loading} = eventStore

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
        event.id ? updateEvent(event) : createEvent(event)
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = e.target
        setEvent({...event, [name]: value})
    }

    return (
        <>
            <Modal open={true} onClose={closeModal} style={{ maxWidth: '800px' }}>
                <Modal.Header>Event</Modal.Header>
                <Modal.Content style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
                    <Form autoComplete='off'>
                      <Form.Field>
                        <label>Title</label>
                        <input value={event.title} name="title" onChange={handleInputChange} />
                      </Form.Field>
                      <Form.Field>
                        <label>Description</label>
                        <textarea value={event.description} name="description" onChange={handleInputChange} />
                      </Form.Field>
                      <Form.Field>
                        <label>Category</label>
                        <input value={event.category} name="category" onChange={handleInputChange} />
                      </Form.Field>
                      <Form.Field>
                        <label>Date</label>
                        <input type="date" value={event.date} name="date" onChange={handleInputChange} />
                      </Form.Field>
                      <Form.Field>
                        <label>City</label>
                        <input value={event.city} name="city" onChange={handleInputChange} />
                      </Form.Field>
                      <Form.Field>
                        <label>Venue</label>
                        <input value={event.venue} name="venue" onChange={handleInputChange} />
                      </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button.Group widths='2'>
                        <Button onClick={closeModal} color='red' content='Cancel' />
                        <Button loading={loading} onClick={handleSubmit} color='green' content='Submit' />
                    </Button.Group>
                </Modal.Actions>
            </Modal>
        </>
    )
})