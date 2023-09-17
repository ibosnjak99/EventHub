import React from "react"
import { Tab } from "semantic-ui-react"
import ProfilePhotos from "../profiles/ProfilePhotos"
import { observer } from "mobx-react-lite"
import { Profile } from "../../../app/models/profile"
import ProfileAbout from "../profiles/ProfileAbout"

interface Props {
    profile: Profile
}

export default observer (function ProfileContent({profile}: Props) {
    const panes = [
        {menuItem: 'About', render: () => <ProfileAbout />},
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />},
        {menuItem: 'Events', render: () => <Tab.Pane>Events</Tab.Pane>},
        {menuItem: 'Followers', render: () => <Tab.Pane>Followers</Tab.Pane>},
        {menuItem: 'Following', render: () => <Tab.Pane>Following</Tab.Pane>},
    ]

    return (
        <Tab
            menu={{ fluid: true, vertical: true}}
            menuPosition="right"
            panes={panes}
        />
    )
})