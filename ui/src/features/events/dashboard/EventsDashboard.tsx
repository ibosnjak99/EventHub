import React from "react";
import { Grid } from "semantic-ui-react";
import { Event } from "../../../app/models/event";
import EventsForm from "../form/EventForm";
import EventDetails from "./EventDetails";
import EventsList from "./EventsList";

interface Props {
    events: Event[]
    selectedEvent: Event | undefined
    selectEvent: (id: string) => void
    unselectEvent: () => void
    editMode: boolean
    openForm: (id: string) => void
    closeForm: () => void
    createOrEdit: (event: Event) => void
    deleteEvent: (id: string) => void
    submitting: boolean
}

export default function EventsDashboard({events, selectedEvent, selectEvent, unselectEvent, editMode, openForm, closeForm, createOrEdit, deleteEvent, submitting}: Props) {
    return (
        <>
            <Grid>
                <Grid.Column width='10'>
                    <EventsList 
                        events={events}
                        selectEvent={selectEvent}
                        deleteEvent={deleteEvent}
                        />
                </Grid.Column>
                <Grid.Column width='6'>
                    {selectedEvent &&
                        <EventDetails 
                            event={selectedEvent} 
                            unselectEvent={unselectEvent} 
                            openForm={openForm}
                            closeForm={closeForm}
                            deleteEvent={deleteEvent}
                        /> 
                    }
                    {editMode &&
                        <EventsForm 
                            closeForm={closeForm} 
                            event={selectedEvent} 
                            createOrEdit={createOrEdit} 
                            submitting={submitting}
                        />
                    }
                </Grid.Column>
            </Grid>
        </>
    )
}