import { createContext, useContext } from "react"
import EventStore from "./eventStore"
import CommonStore from "./commonStore"
import UserStore from "./userStore"
import ModalStore from "./modalStore"
import ProfileStore from "./profileStore"

interface Store {
    eventStore: EventStore
    commonStore: CommonStore
    userStore: UserStore
    modalStore: ModalStore
    profileStore: ProfileStore
}

export const store: Store = {
    eventStore: new EventStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore()
}

export const StoreContext = createContext(store)

export function useStore() {
    return useContext(StoreContext)
}