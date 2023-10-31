import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useStore } from '../../../app/stores/store'
import { Button, Image, List, Modal, Icon } from 'semantic-ui-react'

export default observer(function UserDashboard() {
    const { userStore } = useStore()
    const { users, getAllUsers } = userStore

    useEffect(() => {
        getAllUsers()
    })

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [userIdToDelete, setUserIdToDelete] = useState('')

    function handleDeleteUser(id: string) {
        setUserIdToDelete(id)
        setShowDeleteModal(true)
    }

    function handleConfirmDelete() {
        userStore.deleteUser(userIdToDelete)
        setShowDeleteModal(false)
    }

    function handleCancelDelete() {
        setShowDeleteModal(false)
    }

    if (!users) return null

    return (
        <>
            <List divided relaxed>
                {users.map(user => (
                    <List.Item key={user.username}>
                        <Image avatar src={user.image || '/assets/user.png'} />
                        <List.Content>
                            <List.Header>{user.displayName}</List.Header>
                        </List.Content>
                        <List.Content floated='right'>
                            <Button color='red' onClick={() => handleDeleteUser(user.username)}>
                                Delete
                            </Button>
                        </List.Content>
                    </List.Item>
                ))}
            </List>

            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} size='tiny'>
                <Modal.Header>Delete User</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this user?</p>
                    <p>This action cannot be undone.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCancelDelete}>
                        <Icon name='remove' /> No
                    </Button>
                    <Button color='red' onClick={handleConfirmDelete}>
                        <Icon name='checkmark' /> Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    )
})
