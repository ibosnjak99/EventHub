import { makeAutoObservable, reaction } from "mobx"
import { ServerError } from "../models/serverError"

export default class CommonStore {
    error: ServerError | null = null
    token: string | null = this.getCookie('jwt')
    appLoaded = false

    constructor() {
        makeAutoObservable(this)

        reaction(
            () => this.token,
            token => {
                if (token) {
                    this.setCookie('jwt', token)
                } else {
                    this.deleteCookie('jwt')
                }
            }
        )
    }

    setServerError(error: ServerError) {
        this.error = error
    }

    setToken = (token: string | null) => {
        this.token = token
    }

    setAppLoaded = () => {
        this.appLoaded = true
    }

    setCookie(name: string, value: string, days: number = 7) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value};${expires};path=/;Secure`;
    }

    getCookie(name: string): string | null {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || null
        }
        return null
    }

    deleteCookie(name: string) {
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure`
    }
}
