import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { Files } from 'data/files';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { getClassString } from 'utils';

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
    onChange?: (image: string) => void;
    className?: string;
}

function ImagePicker ({
    directory,
    image,
    onChange,
    className,
}: ImagePickerProps) {
    const { dataPath } = useDataContext();

    const [isClicked, setClicked] = useState(false);

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
        <div className={classStr} onClick={() => setClicked(true)}>
            {$img}
            {isClicked && <Popup onClose={() => console.log("posok")} />}
        </div>
    );
}

export default ImagePicker;

export interface PopupProps {
    onClose: () => void;
}

function Popup (props: PopupProps) {
    const $container = document.createElement("div");
    let wnd = window.open("", "resizable-blocking-popup");

    if (!wnd) return <div>Error</div>

    wnd.document.body.appendChild($container);
    wnd.onunload = () => props.onClose();

    return createPortal(<div>POPUP!</div>, $container);
}