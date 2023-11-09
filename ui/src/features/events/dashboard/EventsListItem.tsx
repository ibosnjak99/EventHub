import React from "react"
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react"
import { Event } from "../../../app/models/event"
import { useStore } from "../../../app/stores/store"
import { format } from 'date-fns'
import EventListItemAttendee from "./EventListItemAttendee"
import { Link } from "react-router-dom"
import { observer } from "mobx-react-lite"

interface Props {
    event: Event
}

export default observer(function EventsListItem({event}: Props) {

    const {eventStore} = useStore()

    return (
        <Segment.Group style={{ backgroundColor: '#e3e3e3', padding: '10px' }}>
            { event.isCancelled &&
                <Label attached='top' color='red' content='Cancelled' style={{ textAlign: 'center' }}/>
            }
            <Segment style={{ backgroundColor: '#e3e3e3' }}>
                <Item.Group>
                        <Item>
                            <Item.Image size='tiny' circular src={event.host?.image || 'assets/user.png'} style={{ boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.3)' }}/>
                            <Item.Content style={{  margin: 'auto' }}>
                                <Item.Header>
                                    {event.title}
                                </Item.Header>
                                <Item.Description>
                                    Hosted by <Link 
                                                to={`/profile/${event.hostUsername}`} 
                                                style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }} 
                                                >
                                                    {event.hostUsername}
                                                </Link>
                                </Item.Description>
                                {event.isHost && (
                                    <Item.Description>
                                        <Label basic color='orange'>
                                            You are the host
                                        </Label>
                                    </Item.Description>
                                )}
                                {event.isGoing && !event.isHost && (
                                    <Item.Description>
                                        <Label basic color='green'>
                                            You are going
                                        </Label>
                                    </Item.Description>
                                )}
                            </Item.Content>
                        </Item>
                </Item.Group>
            </Segment>
            <Segment style={{ backgroundColor: '#e3e3e3' }}>
                <span>
                    <Icon name='clock' /> {format(event.date!, 'dd/MM/yyyy HH:mm')}
                    <br/>
                    <Icon name='marker' /> {event.venue}, {event.city}
                </span>
            </Segment >
            <Segment style={{ backgroundColor: '#e3e3e3' }}>
                <EventListItemAttendee attendees={event.attendees!} />
            </Segment>
            <Segment clearing style={{ backgroundColor: '#e3e3e3' }}>
                <Button 
                    onClick={() => eventStore.selectEvent(event.id)}
                    floated='right'
                    content='View' 
                    color='blue' 
                />
            </Segment>
        </Segment.Group>
  )
})