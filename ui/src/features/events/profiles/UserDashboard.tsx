import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Header, Icon, Image, List, Modal, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import { Link } from 'react-router-dom'

export default observer(function UserDashboard() {
    const { userStore, profileStore } = useStore()
    const { deleteUser } = userStore
    const { profiles, getAllProfiles } = profileStore

    useEffect(() => {
        getAllProfiles()
    }, [getAllProfiles])

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState('')
    const [showUserList, setShowUserList] = useState(false)

    function handleDeleteUser(username: string) {
        setUserToDelete(username)
        setShowDeleteModal(true)
    }

    function handleConfirmDelete() {
        deleteUser(userToDelete)
        setShowDeleteModal(false)
    }

    function handleCancelDelete() {
        setShowDeleteModal(false)
    }

    function handleToggleUserList() {
        getAllProfiles()
        setShowUserList(!showUserList)
    }

    if (!profiles) return null

    return (
        <>
            <Segment
                textAlign='center'
                style={{ cursor: 'pointer', marginTop: '20px' }}
                secondary
                inverted
                color='blue'
                onClick={handleToggleUserList}
            >
                <Header as='h4'>
                    List of Users
                    <Icon name={showUserList ? 'angle double up' : 'angle double down'}/>
                </Header>
            </Segment>
            {showUserList && (
                <List divided relaxed>
                    {profiles.map(profile => (
                        <List.Item key={profile.userName} style={{ display: 'flex', alignItems: 'center' }}>
                            <Image avatar size='tiny' src={profile.image || '/assets/user.png'} />
                            <List.Content style={{ marginLeft: '10px' }}>
                                <List.Header as={Link} to={`/profile/${profile.userName}`}>
                                    {profile.displayName}
                                </List.Header>
                            </List.Content>
                            <Button color='red' onClick={() => handleDeleteUser(profile.userName)} style={{ marginLeft: 'auto' }}>
                                Delete
                            </Button>
                        </List.Item>
                    ))}
                </List>
            )}

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
