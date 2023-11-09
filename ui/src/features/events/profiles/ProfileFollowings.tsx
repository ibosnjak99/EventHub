import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStore } from '../../../app/stores/store'
import { Card, Grid, Header, Tab } from 'semantic-ui-react'
import ProfileCard from './components/ProfileCard'

const isMobile = window.innerWidth <= 768;

export default observer(function ProfileFollowings() {
    const {profileStore} = useStore()
    const {followings, loadingFollowings, activeTab} = profileStore

    return (
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width={16}>
                    <Header 
                        floated='left' 
                        icon='user' 
                        content={activeTab === 3 ? `Followers` : 'Following'} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={isMobile ? 2 : 4}>
                    {followings.map(profile => (
                        <ProfileCard key={profile.userName} profile={profile} />
                    ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})