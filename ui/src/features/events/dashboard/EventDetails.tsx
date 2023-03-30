import React from 'react';
import { Button, Card, Image, Modal } from 'semantic-ui-react';
import { Event } from '../../../app/models/event';

interface Props {
    event: Event
    unselectEvent: () => void
    openForm: (id: string) => void
    closeForm: () => void
}

export default function EventDetails({ event, unselectEvent, openForm, closeForm }: Props) {
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
                            <span>{event.date}</span>
                        </Card.Meta>
                        <Card.Description>
                            {event.description}
                        </Card.Description>
                        <Card.Description>
                            {event.venue}, {event.city}
                        </Card.Description>
                    </Card.Content>
                    <Modal.Actions>
                        <Button.Group widths='2'>
                            <Button onClick={() => openForm(event.id)} color='blue' content='Edit' />
                            <Button onClick={() => {unselectEvent(); closeForm();}} color='red' content='Cancel' />
                        </Button.Group>
                    </Modal.Actions>
                    </Card>
                </Modal.Content>
            </Modal>
        </>
    )
}