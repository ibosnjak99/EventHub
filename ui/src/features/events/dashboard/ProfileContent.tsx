import React from "react"
import { Tab } from "semantic-ui-react"
import ProfilePhotos from "../profiles/ProfilePhotos"
import { observer } from "mobx-react-lite"
import { Profile } from "../../../app/models/profile"
import ProfileAbout from "../profiles/ProfileAbout"
import ProfileFollowings from "../profiles/ProfileFollowings"
import { useStore } from "../../../app/stores/store"
import ProfileEvents from "../profiles/ProfileEvents"

interface Props {
    profile: Profile
}

export default observer (function ProfileContent({profile}: Props) {
    const {profileStore} = useStore()

    const panes = [
        {menuItem: 'About', render: () => <ProfileAbout />},
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />},
        {menuItem: 'Events', render: () => <ProfileEvents />},
        {menuItem: 'Followers', render: () => <ProfileFollowings />},
        {menuItem: 'Following', render: () => <ProfileFollowings />},
    ]

    return (
        <Tab
            menu={{ fluid: true, vertical: true}}
            menuPosition="right"
            panes={panes}
            onTabChange={(_, data) => profileStore.setActiveTab(data.activeIndex as number)}
        />
    )
})