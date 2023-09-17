import { User } from "./user"

export interface Profile {
    userName: string
    displayName: string
    image?: string
    bio?: string
    photos?: Photo[]
}

export class Profile implements Profile {
    constructor(user: User) {
        this.userName = user.username
        this.displayName = user.displayName
        this.image = user.image
        this.bio = user.bio
    }
}

export interface Photo {
    id: string
    url: string
    isProfile: boolean
}