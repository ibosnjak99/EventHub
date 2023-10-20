import { observer } from 'mobx-react-lite'
import React from 'react'
import { Divider, Grid, Header, Item, ItemDescription, Segment, Statistic } from 'semantic-ui-react'
import { Profile } from '../../../app/models/profile'
import FollowButon from './components/FollowButon'
import { useStore } from '../../../app/stores/store'

interface Props {
    profile: Profile
}

function truncate(str: string | undefined) {
    if (str) {
    return str.length > 40 ? str.substring(0, 37) + '...' : str;
    }
}

export default observer (function ProfileHeader({profile}: Props) {
    const {userStore: {user}} = useStore()

    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar size="small" src={profile.image || '/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1' content={profile.displayName} />
                                <ItemDescription as='h2' content={truncate(profile.bio)} />
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label="Followers" value={profile.followersCount} />
                        <Statistic label="Following" value={profile.followingCount} />
                    </Statistic.Group>
                    <Divider/>
                    { !user?.isModerator &&
                        <FollowButon profile={profile}/>
                    }
                </Grid.Column>
            </Grid>
        </Segment>
    )
})