import { createContext, useContext } from "react"
import EventStore from "./eventStore"
import CommonStore from "./commonStore"

interface Store {
    eventStore: EventStore
    commonStore: CommonStore
}

export const store: Store = {
    eventStore: new EventStore(),
    commonStore: new CommonStore()
}

export const StoreContext = createContext(store)

export function useStore() {
    return useContext(StoreContext)
}