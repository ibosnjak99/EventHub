import { makeAutoObservable, runInAction } from "mobx";
import { Profile } from "../models/profile";
import client from "../api/client";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null
    loadingProfile = false

    constructor() {
        makeAutoObservable(this)        
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.userName
        }
        return false
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true
        try {
            const profile = await client.Profiles.get(username)
            runInAction(() => {
                this.profile = profile
                this.loadingProfile = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => this.loadingProfile = false)
        }
    }
}