import React from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';


interface Props {
    event: Event | undefined
    closeForm: () => void
}

export default function EventsForm({ event, closeForm } : Props) {
    return (
        <>
            <Modal open={true} onClose={closeForm} style={{ maxWidth: '800px' }}>
                <Modal.Header>Edit Event</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input placeholder='Title' />
                        <Form.TextArea placeholder='Description' />
                        <Form.Input placeholder='Category' />
                        <Form.Input placeholder='Date' />
                        <Form.Input placeholder='City' />
                        <Form.Input placeholder='Venue' />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                <Button.Group widths='2'>
                            <Button onClick={closeForm} color='red' content='Cancel' />
                            <Button color='green' content='Submit' />
                        </Button.Group>
                </Modal.Actions>
            </Modal>
        </>
    )
}