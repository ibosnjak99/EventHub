import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
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
                </Card.Content>
                <Card.Content extra>
                    <Button.Group widths='2'>
                        <Button onClick={() => openForm(event.id)} basic color='blue' content='Edit' />
                        <Button onClick={() => {unselectEvent(); closeForm();}} basic color='red' content='Cancel' />
                    </Button.Group>
                </Card.Content>
            </Card>
        </>
    )
}