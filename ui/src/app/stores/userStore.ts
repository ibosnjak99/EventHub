import { makeAutoObservable, runInAction } from "mobx"
import { User, UserFormValues } from "../models/user"
import client from "../api/client"
import { store } from "./store"
import { router } from "../router/Routes"

export default class UserStore {
    user: User | null = null
    users: User[] | null = null

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await client.Account.login(creds)
            store.commonStore.setToken(user.token)
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

    deleteUser = async (id: string) => {
        try {
            await client.Account.delete(id)
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
}