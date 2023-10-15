import { makeAutoObservable, reaction } from "mobx"
import { ServerError } from "../models/serverError"

export default class CommonStore {
    error: ServerError | null = null;
    token: string | null = this.getCookie('jwt')
    appLoaded = false;

    constructor() {
        makeAutoObservable(this)

        reaction(
            () => this.token,
            token => {
                if (token) {
                    this.setCookie('jwt', token, 7)
                } else {
                    this.deleteCookie('jwt')
                }
            }
        );
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

    setCookie(name: string, value: string, days: number) {
        let expires = ""
        if (days) {
            const date = new Date()
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
            expires = "; expires=" + date.toUTCString()
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; Secure;"
    }

    getCookie(name: string): string | null {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) {
            const poppedValue = parts.pop();
            const result = poppedValue && poppedValue.split(";").shift();
            return result || null;
        }
        return null;
    }
    
    

    deleteCookie(name: string) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    }
}
