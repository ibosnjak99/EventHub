import React from "react"
import { Grid } from "semantic-ui-react"
import EventsForm from "../form/EventForm"
import EventDetails from "./EventDetails"
import EventsList from "./EventsList"
import { useStore } from "../../../app/stores/store"
import { observer } from "mobx-react-lite"

export default observer (function EventsDashboard() {
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