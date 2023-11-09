import React from "react"
import { Tab } from "semantic-ui-react"
import ProfilePhotos from "./ProfilePhotos"
import { observer } from "mobx-react-lite"
import { Profile } from "../../../app/models/profile"
import ProfileAbout from "./ProfileAbout"
import ProfileFollowings from "./ProfileFollowings"
import { useStore } from "../../../app/stores/store"
import ProfileEvents from "./ProfileEvents"

interface Props {
    profile: Profile
}

export default observer(function ProfileContent({profile}: Props) {
    const {profileStore} = useStore()

    const isMobile = window.innerWidth <= 768;

    const panes = [
        {menuItem: 'About', render: () => <ProfileAbout />},
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />},
        {menuItem: 'Events', render: () => <ProfileEvents />},
        {menuItem: 'Followers', render: () => <ProfileFollowings />},
        {menuItem: 'Following', render: () => <ProfileFollowings />},
    ]

    const tabMenuStyle = {
        overflowX: 'auto',
        whiteSpace: 'nowrap'
    }

    return (
        <Tab
            menu={{ fluid: true, vertical: isMobile ? false : true, style: tabMenuStyle }}
            menuPosition={isMobile ? undefined : "right"}
            panes={panes}
            onTabChange={(_, data) => profileStore.setActiveTab(data.activeIndex as number)}
        />
    )
})

