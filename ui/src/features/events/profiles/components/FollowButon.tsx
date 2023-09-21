import React, { SyntheticEvent } from 'react';
import { Profile } from '../../../../app/models/profile'
import { observer } from 'mobx-react-lite'
import { Button, Reveal } from 'semantic-ui-react'
import { useStore } from '../../../../app/stores/store'

interface Props {
    profile: Profile
}

export default observer(function FollowButton({ profile }: Props ) {
    const {profileStore, userStore} = useStore()
    const {updateFollowing, loading} = profileStore

    function handleFollow(e: SyntheticEvent, username: string) {
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true)
    }

    if (userStore.user?.username === profile.userName) return null

    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button fluid color='teal' content={profile.following ? 'Following' : 'Not following'} />
            </Reveal.Content>23
            <Reveal.Content hidden style={{ width: '100%', marginTop: "-20px" }}>
                <Button
                    fluid 
                    color={profile.following ? 'red' : 'green'}
                    content={profile.following ? 'Unfollow' : 'Follow'}
                    loading={loading}
                    onClick={(e) => handleFollow(e, profile.userName)}
                />
            </Reveal.Content>
        </Reveal>
    )
})