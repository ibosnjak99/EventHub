import { observer } from "mobx-react-lite"
import React, { SyntheticEvent, useState } from "react"
import { Button, Card, Grid, Header, Image, Label, Modal, Tab } from "semantic-ui-react"
import { Photo, Profile } from "../../../app/models/profile"
import { useStore } from "../../../app/stores/store"
import PhotoUploadWidget from "../../../app/common/imageUpload/PhotoUploadWidget"

interface Props {
    profile: Profile
}

export default observer (function ProfilePhotos({profile}: Props) {
    const {profileStore: {isCurrentUser, uploadPhoto, uploading, loading, setProfilePhoto, deletePhoto}} = useStore()
    const [addPhotoMode, setAddPhotoMode] = useState(false)
    const [target, setTarget] = useState('')
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    function openModal(photo: Photo) {
        setSelectedPhoto(photo);
    }

    function closeModal() {
        setSelectedPhoto(null);
    }

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false))
    }

    function handleSetProfilePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name)
        setProfilePhoto(photo)
        closeModal()
    }

    function handleDeletePhoto(id: string, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setShowDeleteModal(true);
    }

    function handleConfirmDelete() {
        if (selectedPhoto) {
            deletePhoto(selectedPhoto.id);
            setShowDeleteModal(false);
            closeModal();
        }
    }
    
    function handleCancelDelete() {
        setShowDeleteModal(false);
    }
    
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos' />
                    {isCurrentUser && (
                        <Button 
                            floated='right' 
                            content={addPhotoMode ? 'Cancel' : 'Add photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading}/>
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map(photo => (
                                <Card key={photo.id} onClick={() => openModal(photo)}>
                                    <Image src={photo.url} />
                                    {photo.isProfile && (
                                        <Label
                                            corner='right'
                                            icon='check'
                                            color='green'
                                        />
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
            <Modal open={!!selectedPhoto} onClose={closeModal} style={{ margin: 'auto' }} size='tiny'>
                <Modal.Content>
                    <Image size="big" src={selectedPhoto?.url || ''} centered />
                    {isCurrentUser && (
                        <Button.Group fluid widths={1} style={{ marginTop: '20px' }}>
                            <Button
                                color='green'
                                content='Set as profile'
                                loading={target === 'profile' + selectedPhoto?.id && loading}
                                name={'profile' + selectedPhoto?.id}
                                disabled={selectedPhoto?.isProfile}
                                onClick={e => handleSetProfilePhoto(selectedPhoto!, e)}
                            />
                            <Button 
                                color='red'
                                content='Delete photo'
                                loading={target === selectedPhoto?.id && loading}
                                disabled={selectedPhoto?.isProfile}
                                onClick={e => handleDeletePhoto(selectedPhoto!.id, e)}
                            />
                        </Button.Group>
                    )}
                </Modal.Content>
            </Modal>
            <Modal open={showDeleteModal} onClose={handleCancelDelete} size='tiny'>
                <Modal.Header>Are you sure you want to delete this photo?</Modal.Header>
                <Modal.Content>
                    <p>This action cannot be undone.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color='red'>Confirm</Button>
                </Modal.Actions>
            </Modal>
        </Tab.Pane>
    )
});