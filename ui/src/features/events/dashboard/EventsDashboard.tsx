import React, { useEffect } from "react"
import { Grid } from "semantic-ui-react"
import EventsForm from "../form/EventForm"
import EventsList from "./EventsList"
import { useStore } from "../../../app/stores/store"
import { observer } from "mobx-react-lite"
import EventFilters from "./EventFilters"
import LoadingComponent from "../../../app/layouts/LoadingComponent"
import EventModal from "./EventModal"

export default observer (function EventsDashboard() {
    const {eventStore} = useStore()
    const {selectedEvent, editMode} = eventStore

    useEffect(() => {
      eventStore.loadEvents()
    }, [eventStore])
  
    if (eventStore.loadingInitial) return <LoadingComponent content='Loading...' />

    return (
        <>
            <Grid>
                <Grid.Column width='10'>
                    <EventsList />
                </Grid.Column>
                <Grid.Column width='6'>
                    <EventFilters />
                </Grid.Column>
                    {selectedEvent &&
                        <EventModal /> 
                    }
                    {editMode &&
                        <EventsForm />
                    }
            </Grid>
        </>
    )
})