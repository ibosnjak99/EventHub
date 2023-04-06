import React from "react"
import { Grid } from "semantic-ui-react"
import { Event } from "../../../app/models/event"
import EventsForm from "../form/EventForm"
import EventDetails from "./EventDetails"
import EventsList from "./EventsList"
import { useStore } from "../../../app/stores/store"
import { observer } from "mobx-react-lite"

interface Props {
    events: Event[]
    deleteEvent: (id: string) => void
    submitting: boolean
}

export default observer (function EventsDashboard({events, deleteEvent, submitting}: Props) {
    const {eventStore} = useStore()
    const {selectedEvent, editMode} = eventStore

    return (
        <>
            <Grid>
                <Grid.Column width='10'>
                    <EventsList />
                </Grid.Column>
                <Grid.Column width='6'>
                    {selectedEvent &&
                        <EventDetails /> 
                    }
                    {editMode &&
                        <EventsForm />
                    }
                </Grid.Column>
            </Grid>
        </>
    )
})