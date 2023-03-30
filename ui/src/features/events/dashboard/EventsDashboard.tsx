import React from "react";
import { Grid } from "semantic-ui-react";
import { Event } from "../../../app/models/event";
import EventsForm from "../form/EventsForm";
import EventDetails from "./EventDetails";
import EventsList from "./EventsList";

interface Props {
    events: Event[]
    selectedEvent: Event | undefined
    selectEvent: (id: string) => void
    unselectEvent: () => void
}

export default function EventsDashboard({events, selectedEvent, selectEvent, unselectEvent}: Props) {
    return (
        <>
            <Grid>
                <Grid.Column width='10'>
                    <EventsList 
                        events={events}
                        selectEvent={selectEvent}
                        />
                </Grid.Column>
                <Grid.Column width='6'>
                    {selectedEvent &&
                        <EventDetails event={selectedEvent} unselectEvent={unselectEvent} /> 
                    }
                    <EventsForm />
                </Grid.Column>
            </Grid>
        </>
    )
}