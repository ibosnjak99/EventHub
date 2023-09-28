import React, { useEffect, useState } from "react"
import {  Grid, Loader } from "semantic-ui-react"
import EventsForm from "../form/EventForm"
import EventsList from "./EventsList"
import { useStore } from "../../../app/stores/store"
import { observer } from "mobx-react-lite"
import EventFilters from "./EventFilters"
import EventModal from "./EventDetailsModal"
import { PagingParams } from "../../../app/models/pagination"
import InfiniteScroll from "react-infinite-scroller"
import EventListItemPlaceholder from "./EventListItemPlaceholder"

export default observer (function EventsDashboard() {
    const {eventStore} = useStore()
    const {selectedEvent, editMode, setPagingParams, pagination, loadEvents, eventRegistry} = eventStore
    const [loadingNext, setLoadingNext] = useState(false)

    function handleGetNext() {
        setLoadingNext(true)
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        loadEvents().then(() => setLoadingNext(false))
    }

    useEffect(() => {
      eventStore.loadEvents()
    }, [eventStore, eventRegistry.size])

    return (
        <>
            <Grid>
                <Grid.Column width='10'>
                    {eventStore.loadingInitial && eventRegistry.size === 0 && !loadingNext ? (
                        <>
                            <EventListItemPlaceholder />
                            <EventListItemPlaceholder />
                        </>
                    ) : (
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleGetNext}
                            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                            initialLoad={false}    
                        >
                            <EventsList />
                        </InfiniteScroll>
                    )}
                </Grid.Column>
                <Grid.Column width={6}>
                    <EventFilters />
                </Grid.Column>
                    {selectedEvent &&
                        <EventModal /> 
                    }
                    {editMode &&
                        <EventsForm />
                    }
                <Grid.Column width={10}>
                    <Loader active={loadingNext} />
                </Grid.Column>
            </Grid>
        </>
    )
})