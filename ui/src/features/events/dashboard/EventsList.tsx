import React from 'react';
import { Button, Item, Label } from 'semantic-ui-react';
import { Event } from '../../../app/models/event';

interface Props {
    events: Event[];
}

export default function EventsList({events}: Props) {
    return (
        <>
            <Item.Group divided>
                {events.map(event => (
                <Item key={event.id}>
                    <Item.Content>
                        <Item.Header>{event.title}</Item.Header>
                        <Item.Meta>{event.date}</Item.Meta>
                        <Item.Description>
                            <div>{event.description}</div>
                            <div>{event.city}, {event.venue}</div>
                        </Item.Description>
                        <Item.Extra>
                            <Button floated='right' content='View' color='blue' />
                            <Label basic content={event.category} />
                        </Item.Extra>
                    </Item.Content>
                </Item>
                ))}
            </Item.Group>
        </>
    )
}