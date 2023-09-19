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
        const [day, month, yearTime] = group.split('/');
        const [year, time] = yearTime.split(' ');
        const [hours, minutes] = time.split(':');
        const groupDate = new Date(+year, +month - 1, +day, +hours, +minutes);
        
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
