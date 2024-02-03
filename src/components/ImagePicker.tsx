import React from 'react';
import { getClassString } from 'utils';

export interface ImagePickerProps {
    /**
     * The name of the directory containing the images.
     */
    directory: string;
    /**
     * The name of the image displayed in the picker.
     */
    image: string | null;
    /**
     * A method called when the user chooses a new image.
     * @param image The name of the image chosen by the user.
     */
    onChange?: (image: string) => void;
    className?: string;
}

function ImagePicker ({
    directory,
    image,
    onChange,
    className,
}: ImagePickerProps) {
    const classStr = getClassString(
        "image-picker",
        className,
    )

    return (
        <div className="image-picker">
            (no image selected)
        </div>
    );
}

export default ImagePicker;