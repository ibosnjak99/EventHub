import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import client from "../api/client";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null
    loadingProfile = false
    uploading = false
    loading = false

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

    uploadPhoto = async (file: Blob) => {
        this.uploading = true
        try {
            const response = await client.Profiles.uploadPhoto(file)
            const photo = response.data
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo)
                    if (photo.isProfile && store.userStore.user) {
                        store.userStore.setImage(photo.url)
                        this.profile.image = photo.url
                    }
                }
                this.uploading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => this.uploading = false)
        }
    }

    setProfilePhoto = async (photo: Photo) => {
        this.loading = true
        try {
            await client.Profiles.setProfilePhoto(photo.id)
            store.userStore.setImage(photo.url)
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isProfile)!.isProfile = false
                    this.profile.photos.find(p => p.id === photo.id)!.isProfile = true
                    this.profile.image = photo.url
                    this.loading = false
                }
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false
                console.log(error)
            })
        }
    }

    deletePhoto = async (id: string) => {
        this.loading = true
        try {
            await client.Profiles.deletePhoto(id)
            runInAction(() => {
                this.profile!.photos = this.profile!.photos?.filter(p => p.id !== id)
                this.loading = false
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false
            })
            console.log(error)
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        this.loading = true
        try {
            await client.Profiles.updateProfile(profile)
            runInAction(() => {
                if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName)
                }
                this.profile = {...this.profile, ...profile as Profile}
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => this.loading = false)
        }
    }
}