import React from "react"
import { Cropper } from "react-cropper"
import 'cropperjs/dist/cropper.css'

export default function PhotoWidgetCropper() {
    return (
        <Cropper 
            src={'image'}
            style={{ height: 200, width: '100%' }}
            initialAspectRatio={1}
            aspectRatio={1}
            preview='.img-preview'
            guides={false}
            viewMode={1}
            autoCropArea={1}
            background={false}
        />

    )
}