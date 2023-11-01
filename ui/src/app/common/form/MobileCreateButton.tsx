import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { useStore } from '../../stores/store'

const MobileCreateButton = () => {
    const {eventStore: {openModal}} = useStore()
    const {userStore: {user}} = useStore()

    if (user?.isModerator) return null

    return (
        <Button
            circular
            icon
            onClick={() => openModal()} 
            style={{
                color: 'white',
                backgroundColor: '#3687d9',
            }} 
        >
            <Icon size='small' name='plus' />
        </Button>
    )
}

export default MobileCreateButton
