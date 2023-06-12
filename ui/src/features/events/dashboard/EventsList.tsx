import React, { Fragment } from 'react'
import { Divider, Header } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import { observer } from 'mobx-react-lite'
import EventsListItem from './EventsListItem'

export default observer (function EventsList() {
  const { eventStore } = useStore()
  const { groupedEvents } = eventStore

  return (
    <>
      {groupedEvents.map(([group, events]) => {
        const groupDate = new Date(group);
        const formattedDate = groupDate.toLocaleDateString('en-GB');

        return (
          <Fragment key={group}>
            <Header sub color='teal'>
              {formattedDate}
            </Header>
            <Divider />
            {events.map(event => (
              <EventsListItem 
                key={event.id}
                event={event}
              />
            ))}
          </Fragment>
        )
      })}
    </>
  )
})
