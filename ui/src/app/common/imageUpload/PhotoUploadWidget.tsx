import React, { useEffect, useState } from "react"
import { Button, Grid, Header } from "semantic-ui-react"
import PhotoWidgetDropzone from "./PhotoWidgetDropzone"
import PhotoWidgetCropper from "./PhotoWidgetCropper"

interface Props {
    loading: boolean
    uploadPhoto: (file: Blob) => void
}

export default function PhotoUploadWidget({ loading, uploadPhoto }: Props) {
    const [files, setFiles] = useState<any>([])
    const [cropper, setCropper] = useState<Cropper>()

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!))
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview))
        }
    }, [files])

    return (
        <Grid stackable>
            <Grid.Row>
                <Grid.Column width={4}>
                    <Header sub color='blue' content='Step 1 - Pick an image' style={{ marginBottom: 20 }} />
                    <PhotoWidgetDropzone setFiles={setFiles} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={4}>
                    <Header sub color='blue' content='Step 2 - Resize image' style={{ marginBottom: 20 }} />
                    {files && files.length > 0 && (
                        <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                    )}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={4}>
                    <Header sub color='blue' content='Step 3 - Preview and upload' style={{ marginBottom: 20 }} />
                    {files && files.length > 0 &&
                        <>
                            <div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }} />
                            <Button.Group widths={2}>
                                <Button loading={loading} onClick={() => onCrop()} color='blue' icon='check' />
                                <Button disabled={loading} onClick={() => setFiles([])} icon='close' />
                            </Button.Group>
                        </>
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
