import React, { useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import ProfileHeader from './ProfileHeader'
import ProfileContent from './ProfileContent'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'
import { useStore } from '../../../app/stores/store'
import LoadingComponent from '../../../app/layouts/LoadingComponent'
import EventsForm from "../form/EventForm"
import EventDetailsModal from '../dashboard/EventDetailsModal'

export default observer(function ProfilePage() {
    const {profileStore, eventStore} = useStore()
    
    const {loadingProfile, loadProfile, profile, setActiveTab} = profileStore
    const {editMode, selectedEvent} = eventStore

    const {username} = useParams<{username: string}>()

    useEffect(() => {
        if(username) loadProfile(username)
        return () => {
            setActiveTab(0)
        }
    }, [loadProfile, username, setActiveTab])

    if (loadingProfile) return <LoadingComponent content='Loading...' />

    return(
        <Grid>
            <Grid.Column width={16}>
                {profile &&
                    <>
                        <ProfileHeader profile={profile} />
                        <ProfileContent profile={profile} />
                    </>
                }
            </Grid.Column>
            {selectedEvent &&
                <EventDetailsModal /> 
            }
            {editMode &&
                <EventsForm />
            }
        </Grid>
    )
})