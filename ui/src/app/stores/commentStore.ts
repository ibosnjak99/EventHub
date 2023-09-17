import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = []
    hubConnection: HubConnection | null = null

    constructor() {
        makeAutoObservable(this)
    }

    createHubConnection = (eventId: string) => {
        if (store.eventStore.selectedEvent) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:3000/chat?eventId=' + eventId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build()

            this.hubConnection.start().catch(error => console.log('Error establishing hub connection: ', error))

            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(() => this.comments = comments)
            })

            this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
                runInAction(() => this.comments.push(comment))
            })
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping hub connection: ', error))
    }

    clearComments = () => {
        this.comments = []
        this.stopHubConnection()
    }
}
