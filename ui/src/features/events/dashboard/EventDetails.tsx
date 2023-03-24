import React from 'react';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
import { Event } from '../../../app/models/event';

interface Props {
    event: Event;
}

export default function EventDetails({ event }: Props) {
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
                        <Button basic color='blue' content='Edit' />
                        <Button basic color='red' content='Cancel' />
                    </Button.Group>
                </Card.Content>
            </Card>
        </>
    )
}