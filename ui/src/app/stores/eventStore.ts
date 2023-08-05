import { makeAutoObservable, runInAction } from "mobx"
import { Event, EventFormValues } from "../models/event"
import client from "../api/client"
import { format } from 'date-fns'
import { store } from "./store"
import { Profile } from "../models/profile"

export default class EventStore {
    eventRegistry = new Map<string, Event>()
    selectedEvent: Event | null = null
    editMode = false
    loading = false
    loadingInitial = false

    constructor() {
        makeAutoObservable(this)
    }

    get eventsSortedByDate() {
        return Array.from(this.eventRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime())
    }

    get groupedEvents() {
        return Object.entries(
            this.eventsSortedByDate.reduce((events, event) => {
                const date = format(event.date!, 'dd/MM/yyyy HH:mm')
                events[date] = events[date] ? [...events[date], event] : [event]
                return events
            }, {} as {[key: string]: Event[]})
        )
    }

    loadEvents = async () => {
        try {
            const events = await client.Events.list()
            events.forEach(event => {
                this.setEvent(event)
            })
            this.setLoadingInitial(false)
        } catch (error) {
            console.log(error)
            this.setLoadingInitial(false)
        }
    }

    loadEvent = async (id: string) => {
        let event = this.getEvent(id)
        if (event) this.selectedEvent = event
        else {
            this.setLoadingInitial(true)
            try {
                event = await client.Events.details(id)
                this.setEvent(event)
                this.selectedEvent = event
                this.setLoadingInitial(false)
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false)
            }
        }
    }

    private setEvent = (event: Event) => {
        const user = store.userStore.user
        if (user) {
            event.isGoing = event.attendees!.some(
                e => e.userName === user.username
            )
            event.isHost = event.hostUsername === user.username
            event.host = event.attendees?.find(x => x.userName === event.hostUsername)
        }
        event.date = new Date(event.date!)
        this.eventRegistry.set(event.id, event)
    }

    private getEvent = (id: string) => {
        return this.eventRegistry.get(id)
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state
    }

    selectEvent = (id: string) => {
        this.selectedEvent = this.eventRegistry.get(id) || null
    }

    unselectEvent = () => {
        this.selectedEvent = null
    }

    openModal = (id?: string) => {
        id ? this.selectEvent(id) : this.unselectEvent()
        this.editMode = true
    }

    closeModal = () => {
        this.editMode = false
    }

    createEvent = async (event: EventFormValues) => {
        const user = store.userStore.user
        const attendee = new Profile(user!)
        try {
            await client.Events.create(event)
            const newEvent = new Event(event)
            newEvent.hostUsername = user!.username
            newEvent.attendees = [attendee]
            this.setEvent(newEvent)
            runInAction (() => {
                this.selectedEvent = newEvent
            })
        } catch (error) {
            console.log(error)
        }
    }

    updateEvent = async (event: EventFormValues) => {
        try {
            await client.Events.update(event)
            runInAction(() => {
                if (event.id) {
                    let updatedEvent = {...this.getEvent(event.id), ...event}
                    this.eventRegistry.set(event.id, updatedEvent as Event)
                    this.selectedEvent = updatedEvent as Event
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    deleteEvent = async (id: string) => {
        this.loading = true
        try {
            await client.Events.delete(id)
            runInAction(() => {
                this.eventRegistry.delete(id)
                this.selectedEvent = null
                this.editMode = false
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false
            })
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user
        this.loading = true
        try {
            await client.Events.attend(this.selectedEvent!.id)
            runInAction(() => {
                if (this.selectedEvent?.isGoing) {
                    this.selectedEvent.attendees = this.selectedEvent.attendees?.filter(a => a.userName !== user?.username)
                    this.selectedEvent.isGoing = false
                } else {
                    const attendee = new Profile(user!)
                    this.selectedEvent?.attendees?.push(attendee)
                    this.selectedEvent!.isGoing = true
                }
                this.eventRegistry.set(this.selectedEvent!.id, this.selectedEvent!)
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => this.loading = false)
        }
    }

    cancelEventToggle = async () => {
        this.loading = true
        try {
            await client.Events.attend(this.selectedEvent!.id)
            runInAction(() => {
                this.selectedEvent!.isCancelled = !this.selectedEvent?.isCancelled
                this.eventRegistry.set(this.selectedEvent!.id, this.selectedEvent!)
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => this.loading = false)
        }
    }
}