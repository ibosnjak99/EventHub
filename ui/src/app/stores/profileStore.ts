import { makeAutoObservable, runInAction, reaction } from "mobx"
import { Photo, Profile, UserEvent } from "../models/profile"
import client from "../api/client"
import { store } from "./store"

export default class ProfileStore {
    profile: Profile | null = null
    profiles: Profile[] | null = null
    loadingProfile = false
    uploading = false
    loading = false
    loadingFollowings = false
    followings: Profile[] = []
    activeTab = 0
    userEvents: UserEvent[] = []
    loadingEvents = false

    constructor() {
        makeAutoObservable(this)        
        
        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following'
                    this.loadFollowings(predicate)
                } else {
                    this.followings = []
                }
            }
    
        )
    }

    setActiveTab = (activeTab: number) => {
        this.activeTab = activeTab
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

    getAllProfiles = async () => {
        try {
            const profiles = await client.Profiles.all()
            runInAction(() => {
                this.profiles = profiles
            })
        } catch (error) {
                console.log(error)
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

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true
        try {
            await client.Profiles.updateFollowing(username)
            store.eventStore.updateAttendeeFollowing(username)
            runInAction(() => {
                if (this.profile && this.profile.userName !== store.userStore.user?.username && this.profile.userName === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--
                    this.profile.following = !this.profile.following
                }
                if (this.profile && this.profile.userName === store.userStore.user?.username) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--
                }
                this.followings.forEach(profile => {
                    if (profile.userName === username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++
                        profile.following = !profile.following
                    }
                })
                this.loading = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => this.loading = false)
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true
        try {
            const followings = await client.Profiles.listFollowings(this.profile!.userName, predicate)
            runInAction(() => {
                this.followings = followings
                this.loadingFollowings = false
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loadingFollowings = false
            })
        }
    }

    loadUserEvents = async (username: string, predicate?: string) => {
        this.loadingEvents= true
        try {
            const events = await client.Profiles.listEvents(username, predicate!)
            runInAction(() => {
            this.userEvents = events
            this.loadingEvents = false
        })
        } catch (error) {
            console.log(error)
            runInAction(() => {
            this.loadingEvents = false
            })
        }
    }
}