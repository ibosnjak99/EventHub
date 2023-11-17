import { makeAutoObservable, runInAction } from "mobx"
import { User, UserFormValues } from "../models/user"
import client from "../api/client"
import { store } from "./store"
import { router } from "../router/Routes"

export default class UserStore {
    currentUser: User | null = null
    user: User | null = null
    users: User[] | null = null
    refreshTokenTimeout?: NodeJS.Timeout

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await client.Account.login(creds)
            this.currentUser = user
            store.commonStore.setToken(user.token)
            this.startRefreshTokenTimer(user)
            runInAction(() => this.user = user)
            router.navigate('/events')
            store.modalStore.closeModal()
        } catch (error) {
            throw error
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await client.Account.register(creds)
            store.commonStore.setToken(user.token)
            this.startRefreshTokenTimer(user)
            runInAction(() => this.user = user)
            router.navigate('/events')
            store.modalStore.closeModal()
        } catch (error) {
            throw error
        }
    }

    logout = () => {
        setTimeout(() => {
            runInAction(() => {
                store.commonStore.setToken(null)
                this.user = null
                store.eventStore.reset()
            })
            router.navigate('/')
        }, 500)
    }
    
    getUser = async () => {
        try {
            const user = await client.Account.current()
            store.commonStore.setToken(user.token)
            this.startRefreshTokenTimer(user)
            runInAction(() => {
                this.user = user
            })
        } catch (error) {
            console.log(error)
        }
    }

    getAllUsers = async () => {
        try {
            const users = await client.Account.all()
            runInAction(() => {
                this.users = users
            })
        } catch (error) {
                console.log(error)
        }
    }

    deleteUser = async (username: string) => {
        try {
            await client.Account.delete(username)
            runInAction(() => {
                if (this.users) this.users = this.users.filter(user => user.username !== username)
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    setImage = (image: string) => {
        if (this.user) {
            this.user.image = image
        }
    }

    setDisplayName = (name: string) => {
        if (this.user) this.user.displayName = name
    }

    refreshToken = async () => {
        this.stopRefreshTokenTimer()
        try {
            const user = await client.Account.refreshToken()
            runInAction(() => this.user = user)
            store.commonStore.setToken(user.token)
            this.startRefreshTokenTimer(user)
        } catch (error) {

        }
    }

    private startRefreshTokenTimer(user: User) {
        const jwt = JSON.parse(atob(user.token.split('.')[1]))
        const expires = new Date(jwt.exp * 1000)
        const timeout = expires.getTime() - Date.now() - (30*1000)
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout)
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout)
    }
}