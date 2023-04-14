import React, { Fragment } from 'react'
import { Divider, Header, Item } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import { observer } from 'mobx-react-lite'
import EventsListItem from './EventsListItem'

export default observer (function EventsList() {

    const {eventStore} = useStore()
    const {groupedEvents} = eventStore

    return (
        <>
            {groupedEvents.map(([group, events]) => {
                return (
                <Fragment key={group}>
                    <Header sub color='teal' >
                        {new Date(group).toLocaleDateString('en-GB')}
                    </Header>
                    <Divider/>
                    <Item.Group>
                        {events.map(event => (
                            <EventsListItem 
                                key={event.id}
                                event={event}
                            />
                        ))}
                    </Item.Group>
                </Fragment>
                )
            })} 
        </>
    )
})