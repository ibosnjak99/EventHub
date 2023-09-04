import axios, { AxiosError, AxiosResponse } from "axios"
import { Event, EventFormValues } from "../models/event"
import { toast } from 'react-toastify'
import { router } from "../router/Routes"
import { store } from "../stores/store"
import { User, UserFormValues } from "../models/user"
import { Profile } from "../models/profile"

const sleep = (timeout: number) => {
    return new Promise ((resolve) => {
        setTimeout(resolve, timeout)
    })
}

axios.defaults.baseURL='https://localhost:7013/api/'

axios.interceptors.request.use(config => {
    const token = store.commonStore.token
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
    return config
})

axios.interceptors.response.use(async response => {
    await sleep(500)
    return response
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse
    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                router.navigate('/not-found')
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat()
            } else {
                toast.error(data)
            }
            break  
        case 401:
            toast.error('Unauthorized')     
            break
        case 403:
            toast.error('Forbidden') 
            break      
        case 404:
            router.navigate('/not-found')
            break
        case 500:
            store.commonStore.setServerError(data)
            router.navigate('/server-error')
            break
    }
    return Promise.reject(error)
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url: string) => axios.delete<T>(url).then(responseBody)
}

const Events = {
    list: () => requests.get<Event[]>('events'),
    details: (id: string) => requests.get<Event>(`events/${id}`),
    create: (event: EventFormValues) => requests.post<void>('events', event),
    update: (event: EventFormValues) => requests.put<void>(`events/${event.id}`, event),
    delete: (id: string) => requests.delete<void>(`events/${id}`),
    attend: (id: string) => requests.post<void>(`events/${id}/attend`, {})
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`)
}

const client = {
    Events,
    Account,
    Profiles
}

export default client