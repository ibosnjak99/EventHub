import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { useStore } from '../../stores/store'

const FloatingActionButton = () => {
    const {eventStore: {openModal}} = useStore()
    const {userStore: {user}} = useStore()

    if (user?.isModerator) return null

    return (
        <Button
            circular
            icon
            onClick={() => openModal()} 
            style={{
                position: 'fixed',
                bottom: '3em',
                right: '3em',
                zIndex: 5,
                color: 'white',
                backgroundColor: '#3687d9',
                borderColor: '#ddd', 
                borderWidth: '2px'
            }} 
        >
            <Icon size='large' name='plus' />
        </Button>
    )
}

export default FloatingActionButton
