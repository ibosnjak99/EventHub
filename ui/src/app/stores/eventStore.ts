import { makeAutoObservable, runInAction } from "mobx"
import { Event } from "../models/event"
import client from "../api/client"
import { v4 as uuid } from "uuid"

export default class EventStore {
    eventRegistry = new Map<string, Event>()
    selectedEvent: Event | null = null
    editMode = false
    loading = false
    loadingInitial = true

    constructor() {
        makeAutoObservable(this)
    }

    get eventsSortedByDate() {
        return Array.from(this.eventRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    }

    get groupedEvents() {
        return Object.entries(
            this.eventsSortedByDate.reduce((events, event) => {
                const date = event.date
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
        event.date = event.date.split('T')[0]
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

    createEvent = async (event: Event) => {
        this.loading = true
        event.id = uuid()
        try {
            await client.Events.create(event)
            runInAction (() => {
                this.eventRegistry.set(event.id, event)
                this.selectedEvent = event
                this.editMode = false
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction (() => {
                this.loading = false
            })
        }
    }

    updateEvent = async (event: Event) => {
        this.loading = true
        try {
            await client.Events.update(event)
            runInAction(() => {
                this.eventRegistry.set(event.id, event)
                this.selectedEvent = event
                this.editMode = false
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction (() => {
                this.loading = false
            })
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
}