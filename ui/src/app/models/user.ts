export interface User {
    appUserId: string
    username: string
    displayName: string
    bio: string
    token: string
    image?: string
    isModerator: boolean
}

export interface UserFormValues {
    email: string
    password: string
    displayName?: string
    username?: string
}