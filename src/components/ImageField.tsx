import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { Files } from 'data/files';
import WindowPopup from 'elements/WindowPopup';
import React, { useState } from 'react';
import { getClassString } from 'utils';
import ImagePicker, { ImageBackgroundColor } from './ImagePicker';
import CoverPanel from 'elements/CoverPanel';

export interface ImageFieldProps {
    /**
     * The name of the directory containing the images.
     */
    directory: AssetFolder;
    /**
     * The name of the image displayed in the picker.
     */
    image: string | null;
    showName?: boolean;
    /**
     * The background color to show behind transparencies in the images of
     * the gallery.
     */
    defaultImageBackgroundColor?: ImageBackgroundColor;
    /**
     * A method called when the user chooses a new image.
     * @param image The name of the image chosen by the user.
     */
    onChange?: (image: string | null) => void;
    className?: string;
}

function ImageField ({
    directory,
    image,
    showName, // TODO: Implement
    defaultImageBackgroundColor = "transparent",
    onChange,
    className,
}: ImageFieldProps) {
    const { dataPath } = useDataContext();

    const [isGalleryOpen, setGalleryOpen] = useState(false);

    const classStr = getClassString(
        "image-field",
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
                className="image-field-content"
                onDoubleClick={() => {setGalleryOpen(true)}}
            >
                {$img}
            </div>
            {/*showName && <div className="image-field-name">{image}</div>*/}
            {isGalleryOpen && (
            <CoverPanel onClose={handlePopupClose}>
                <ImagePicker
                    directory={directory}
                    preSelectedImage={image}
                    defaultImageBackgroundColor={defaultImageBackgroundColor}
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

export default ImageField;

//export interface ImageGalleryPopupProps {
//    onClose: () => void;
//}

//function ImageGalleryPopup ({
//    onClose,
//}: ImageGalleryPopupProps) {
//    return (
//        <WindowPopup title="Choose an image" onClose={onClose}>
//            <ImagePicker directory={directory} />
//        </WindowPopup>
//    )
//}