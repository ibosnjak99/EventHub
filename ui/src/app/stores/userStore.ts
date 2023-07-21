import { makeAutoObservable, runInAction } from "mobx"
import { User, UserFormValues } from "../models/user";
import client from "../api/client";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    user: User | null = null

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user;
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
        store.commonStore.setToken(null)
        this.user = null
        router.navigate('/')
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
}