import { Profile } from "./profile"

export interface Event {
    id: string
    title: string
    date: Date | null
    description: string
    category: string
    city: string
    venue: string
    hostUsername: string
    isCancelled: boolean
    isGoing: boolean
    isHost: boolean
    host?: Profile
    attendees: Profile[]
  }

  export class Event implements Event {
    constructor(init?: EventFormValues) {
      Object.assign(this, init)
    }
  }

  export class EventFormValues {
    id?: string = undefined
    title: string = ''
    date: Date | null = null
    description: string = ''
    category: string = ''
    city: string = ''
    venue: string = ''

  constructor(event?: EventFormValues) {
    if (event) {
      this.id = event.id
      this.title = event.title
      this.date = event.date
      this.description = event.description
      this.category = event.category
      this.city = event.city
      this.venue = event.venue
    }
  }
}
