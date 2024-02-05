import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { Files } from 'data/files';
import WindowPopup from 'elements/WindowPopup';
import React, { useState } from 'react';
import { getClassString } from 'utils';
import ImageGallerySelector from './ImageGallerySelector';
import CoverPanel from 'elements/CoverPanel';

export interface ImagePickerProps {
    /**
     * The name of the directory containing the images.
     */
    directory: AssetFolder;
    /**
     * The name of the image displayed in the picker.
     */
    image: string | null;
    /**
     * A method called when the user chooses a new image.
     * @param image The name of the image chosen by the user.
     */
    onChange?: (image: string | null) => void;
    className?: string;
}

function ImagePicker ({
    directory,
    image,
    onChange,
    className,
}: ImagePickerProps) {
    const { dataPath } = useDataContext();

    const [isGalleryOpen, setGalleryOpen] = useState(false);

    const classStr = getClassString(
        "image-picker",
        className,
    )

    const $img = (() => {
        if (image === null) {
            return (
                <div className="no-image">
                    (no image selected)
                </div>
            )
        }
        else {
            const imgPath = Files.getFilePath(dataPath, directory, image);

            return (
                <img src={imgPath} />
            )
        }
    })();

    return (
        <div className={classStr}>
            <div
                className="image-picker-content"
                onDoubleClick={() => {setGalleryOpen(true)}}
            >
                {$img}
            </div>
            {isGalleryOpen && (
            <CoverPanel onClose={handlePopupClose}>
                <ImageGallerySelector
                    directory={directory}
                    preSelectedImage={image}
                    onSelect={handleGallerySelect}
                    onCancel={() => setGalleryOpen(false)}
                />
            </CoverPanel>
            )}
        </div>
    );

    function handlePopupClose () {
        console.info("popup close!");
        setGalleryOpen(false);
    }

    function handleGallerySelect (image: string | null) {
        setGalleryOpen(false);
        onChange?.(image);
    }
}

export default ImagePicker;

//export interface ImageGalleryPopupProps {
//    onClose: () => void;
//}

//function ImageGalleryPopup ({
//    onClose,
//}: ImageGalleryPopupProps) {
//    return (
//        <WindowPopup title="Choose an image" onClose={onClose}>
//            <ImageGallerySelector directory={directory} />
//        </WindowPopup>
//    )
//}