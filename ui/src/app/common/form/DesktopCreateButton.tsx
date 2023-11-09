import React from 'react'
import { Button } from 'semantic-ui-react'
import { useStore } from '../../stores/store'

const DesktopCreateButton = () => {
    const {eventStore: {openModal}} = useStore()
    const {userStore: {user}} = useStore()

    if (user?.isModerator) return null

    return (
        <Button 
            content="Create Event" 
            color="blue" 
            size="medium"
            icon="add circle" 
            labelPosition="right"
            onClick={() => openModal()}
            style={{ marginBottom: '20px'}}
        />
    )
}

export default DesktopCreateButton
