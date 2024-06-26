import React from 'react'
import { Card, Icon, Image } from "semantic-ui-react"
import { Profile } from '../../../../app/models/profile'
import { observer } from "mobx-react-lite"
import { Link } from "react-router-dom"
import FollowButon from './FollowButon'
import { useStore } from '../../../../app/stores/store'

interface Props {
    profile: Profile
}

export default observer(function ProfileCard({ profile }: Props) {
    const {userStore: {user}} = useStore()

    function truncate(str: string | undefined) {
        if (str) {
            return str.length > 40 ? str.substring(0, 37) + '...' : str
        }
    }

    return (
        <Card>
            <Card as={Link} to={`/profile/${profile.userName}`}>
            <Image src={profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>
                    {truncate(profile.bio)}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                {profile.followersCount} Followers
            </Card.Content>
            </Card>
            {!user?.isModerator &&
                <FollowButon profile={profile} />
            }
        </Card>
    )
})