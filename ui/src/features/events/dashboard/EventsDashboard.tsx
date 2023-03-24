import React from "react";
import { Grid } from "semantic-ui-react";
import { Event } from "../../../app/models/event";
import EventsForm from "../form/EventsForm";
import EventDetails from "./EventDetails";
import EventsList from "./EventsList";

interface Props {
    events: Event[];
}

export default function EventsDashboard({events}: Props) {
    return (
        <>
            <Grid>
                <Grid.Column width='10'>
                    <EventsList events={events} />
                </Grid.Column>
                <Grid.Column width='6'>
                    <EventDetails event={events[0]} />
                    <EventsForm />
                </Grid.Column>
            </Grid>
        </>
    )
}