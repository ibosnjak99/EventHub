import axios, { AxiosError, AxiosResponse } from "axios"
import { Event, EventFormValues } from "../models/event"
import { toast } from 'react-toastify'
import { router } from "../router/Routes"
import { store } from "../stores/store"
import { User, UserFormValues } from "../models/user"
import { Photo, Profile, UserEvent } from "../models/profile"
import { PaginatedResult } from "../models/pagination"

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
    const pagination = response.headers['pagination']
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination))
        return response as AxiosResponse<PaginatedResult<unknown>>
    }
    if (response.status >= 200 && response.status < 300) {
        const method = response.config.method?.toUpperCase()
        switch (method) {
            case 'PUT':
                toast.success('Successfully updated!')
                break
            case 'DELETE':
                toast.success('Successfully deleted!')
                break
        }
    }
    return response
}, (error: AxiosError) => {
    const { data, status, headers } = error?.response as AxiosResponse
    switch (status) {
        case 400:
            // if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
            //     router.navigate('/not-found')
            // }
            // if (data.errors) {
            //     const modalStateErrors = []
            //     for (const key in data.errors) {
            //         if (data.errors[key]) {
            //             modalStateErrors.push(data.errors[key])
            //         }
            //     }
            //     throw modalStateErrors.flat()
            // } else {
                toast.error(data)
            // }
            break  
        case 401:
            if (status === 401 && headers['www-authenticate']?.startsWith('Bearer error="invalid_token')) {
                store.userStore.logout()
                toast.error('Session expired - please login again')
            } else {
                toast.error('Unauthorized')
            }
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

const responseBody = <T>(response: AxiosResponse<T>) => response.data

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url: string) => axios.delete<T>(url).then(responseBody)
}

const Events = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Event[]>>('events', {params})
        .then(responseBody),
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
    all: () => requests.get<User[]>('/account/all'),
    delete: (username: string) => requests.delete<void>(`/account/${username}`),
    refreshToken: () => requests.post<User>('/account/refreshToken', {})
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    all: () => requests.get<Profile[]>(`/profiles`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData()
        formData.append('File', file)
        return axios.post<Photo>('photos', formData, {
            headers: {'Content-type': 'multipart/form-data'}
        })
    },
    setProfilePhoto: (id: string) => requests.post(`/photos/${id}/setProfile`, {}),
    deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listEvents: (username: string, predicate: string) => requests.get<UserEvent[]>((`/profiles/${username}/events?predicate=${predicate}`))
}

const Payments = {
    createCheckoutSession: (price: number, username: string, eventId: string) => requests.post<{ sessionId: string }>('/payments/create-checkout-session', { amount: price, username, eventId })
}

const client = {
    Events,
    Account,
    Profiles,
    Payments
}

export default client