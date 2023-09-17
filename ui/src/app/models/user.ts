export interface User {
    username: string
    displayName: string
    bio: string
    token: string
    image?: string
}

export interface UserFormValues {
    email: string
    password: string
    displayName?: string
    username?: string
}