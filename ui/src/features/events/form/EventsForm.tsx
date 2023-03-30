import React from 'react';
import { Button, Form } from 'semantic-ui-react';

interface Props {
    event: Event | undefined
    closeForm: () => void
}

export default function EventsForm({ event, closeForm } : Props) {
    return (
        <>
            <Form>
                <Form.Input placeholder='Title' />
                <Form.TextArea placeholder='Description' />
                <Form.Input placeholder='Category' />
                <Form.Input placeholder='Date' />
                <Form.Input placeholder='City' />
                <Form.Input placeholder='Venue' />
                <Button floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
            </Form>
        </>
    )
}