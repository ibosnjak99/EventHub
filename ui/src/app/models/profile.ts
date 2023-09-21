import { User } from "./user"

export interface Profile {
    userName: string
    displayName: string
    image?: string
    bio?: string
    followersCount: number
    followingCount: number
    following: boolean
    photos?: Photo[]
}

export class Profile implements Profile {
    constructor(user: User) {
        this.userName = user.username
        this.displayName = user.displayName
        this.image = user.image
        this.bio = user.bio
    }

    userName: string
    displayName: string
    image?: string
    bio?: string
    followersCount = 0
    followingCount = 0
    following = false
    photos?: Photo[]
}

export interface Photo {
    id: string
    url: string
    isProfile: boolean
}