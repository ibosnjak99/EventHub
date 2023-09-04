import React, { useEffect, useState } from "react"
import { Grid, Header, Image } from "semantic-ui-react"
import PhotoWidgetDropzone from "./PhotoWidgetDropzone"

export default function PhotoUploadWidget() {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>()

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => console.log('blob'))
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview))
        }
    }, [files])

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 1 - Pick an image' style={{ marginBottom: 20 }} />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Resize image' style={{ marginBottom: 20 }} />
                {files && files.length > 0 && (
                    <Image src={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 3 - Preview and upload' style={{ marginBottom: 20 }} />
            </Grid.Column>
        </Grid>
    )
}