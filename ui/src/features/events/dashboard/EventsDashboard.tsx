import React, { useEffect, useState } from "react"
import { Grid, Loader, Button, Modal } from "semantic-ui-react"
import EventsForm from "../form/EventForm"
import EventsList from "./EventsList"
import { useStore } from "../../../app/stores/store"
import { observer } from "mobx-react-lite"
import EventFilters from "./EventFilters"
import EventDetailsModal from "./EventDetailsModal"
import { PagingParams } from "../../../app/models/pagination"
import InfiniteScroll from "react-infinite-scroller"
import EventListItemPlaceholder from "./EventListItemPlaceholder"
import MobileCreateButton from "../../../app/common/form/MobileCreateButton"
import DesktopCreateButton from "../../../app/common/form/DesktopCreateButton"

const isMobile = window.innerWidth <= 768

export default observer(function EventsDashboard() {
    const { eventStore } = useStore()
    const {
        selectedEvent,
        editMode,
        setPagingParams,
        pagination,
        loadEvents,
        eventRegistry
    } = eventStore
    const [loadingNext, setLoadingNext] = useState(false)
    const [filtersOpen, setFiltersOpen] = useState(false)

    function handleGetNext() {
        setLoadingNext(true)
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        loadEvents().then(() => setLoadingNext(false))
    }

    useEffect(() => {
        eventStore.loadEvents()
    }, [eventStore, eventRegistry.size])

    const closeModal = () => {
        setFiltersOpen(false)
    }

    return (
        <>
            <Grid>
                <Grid.Column width={isMobile ? 16 : 10}>
                    {isMobile ? (
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={13}>
                                    <Button
                                        content="Filters"
                                        color="blue"
                                        fluid
                                        style={{ marginBottom: '20px' }}
                                        onClick={() => setFiltersOpen(true)}
                                    />
                                </Grid.Column>
                                <Grid.Column width={2}>
                                    <MobileCreateButton />
                                </Grid.Column>
                            </Grid.Row>
                            <Modal
                                onClose={() => setFiltersOpen(false)}
                                open={filtersOpen}
                                style={{ paddingBottom: '10px' }}
                            >
                                <Modal.Header>Event Filters</Modal.Header>
                                <Modal.Content>
                                    <EventFilters closeModal={closeModal} />
                                </Modal.Content>
                            </Modal>
                        </Grid>
                    ) : (
                        <DesktopCreateButton />
                    )}
                    {eventStore.loadingInitial &&
                    eventRegistry.size === 0 &&
                    !loadingNext ? (
                        <>
                            <EventListItemPlaceholder />
                            <EventListItemPlaceholder />
                        </>
                    ) : (
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleGetNext}
                            hasMore={
                                !loadingNext &&
                                !!pagination &&
                                pagination.currentPage < pagination.totalPages
                            }
                            initialLoad={false}
                        >
                            <EventsList />
                        </InfiniteScroll>
                    )}
                </Grid.Column>
                {!isMobile && (
                    <Grid.Column width={6}>
                        <EventFilters closeModal={closeModal} />
                    </Grid.Column>
                )}
                {selectedEvent && <EventDetailsModal />}
                {editMode && <EventsForm />}
                <Grid.Column width={10}>
                    <Loader active={loadingNext} />
                </Grid.Column>
            </Grid>
        </>
    )
})
