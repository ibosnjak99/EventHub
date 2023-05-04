import React from "react";
import { Button, Icon, Item, Segment, SegmentGroup } from "semantic-ui-react";
import { Event } from "../../../app/models/event";
import { useStore } from "../../../app/stores/store";
import { Link } from "react-router-dom";

interface Props {
    event: Event
}

export default function EventsListItem({event}: Props) {

    const {eventStore} = useStore()

    return (
        <SegmentGroup style={{ backgroundColor: '#e3e3e3', padding: '10px' }}>
            <Segment style={{ backgroundColor: '#e3e3e3' }}>
                <Item.Group>
                        <Item>
                            <Item.Image size='tiny' circular src='assets/user.png' style={{ boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.3)' }}/>
                            <Item.Content style={{  margin: 'auto' }}>
                                <Item.Header as={Link} to={`/events/${event.id}`}>
                                    {event.title}
                                </Item.Header>
                                <Item.Description>Hosted by me</Item.Description>
                            </Item.Content>
                        </Item>
                </Item.Group>
            </Segment>
            <Segment style={{ backgroundColor: '#e3e3e3' }}>
                <span>
                    <Icon name='clock' /> {new Date(event.date).toLocaleDateString('en-GB')}
                    <br/>
                    <Icon name='marker' /> {event.venue}, {event.city}
                </span>
            </Segment >
            <Segment style={{ backgroundColor: '#e3e3e3' }}>
                Attendees
            </Segment>
            <Segment clearing style={{ backgroundColor: '#e3e3e3' }}>
                <Button 
                    onClick={() => eventStore.selectEvent(event.id)}
                    floated='right'
                    content='View' 
                    color='blue' 
                />
            </Segment>
        </SegmentGroup>
    )
}