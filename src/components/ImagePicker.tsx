import { useDataContext } from 'context/useDataContext';
import { AssetFolder, Assets } from 'data/assets';
import { FileTypes } from 'data/files';
import Button from 'elements/Button';
import ColorChooser from 'elements/ColorChooser';
import ScaleScroll from 'elements/ScaleScroll';
import Ipc from 'main/ipc/ipcRenderer';
import { TAB_INDICES } from 'names';
import React, { useEffect, useState } from 'react';
import { getClassString } from 'utils';

type UserFileCollection = {[name: string]: string};

export interface ImagePickerProps {
    directory: AssetFolder;
    preSelectedImage?: string | null;
    defaultImageBackgroundColor?: ImageBackgroundColor;
    onSelect: (selectedImage: string | null) => void;
    onCancel?: (selectedImage: string | null) => void;
}

export type ImageBackgroundColor = "dark" | "transparent" | "white";

function ImagePicker ({
    directory,
    preSelectedImage,
    defaultImageBackgroundColor = "transparent",
    onSelect,
    onCancel,
}: ImagePickerProps) {
    const { getDataFolder } = useDataContext();

    const [userFiles, setUserFiles] = useState<UserFileCollection | null>(null);
    const [selectedImage, setSelectedImage] = useState(preSelectedImage ?? null);

    const [imgScale, setImgScale] = useState(120);
    const [bgColor, setBgColor] = useState<ImageBackgroundColor>(
        defaultImageBackgroundColor
    );

    // read user assets in the AppData folder and load them into "userFiles".
    useEffect(() => {
        loadUserFiles();
    }, []);

    const colorOptions = {
        "dark": "#000000",
        "transparent": "#00000000",
        "white": "#ffffff",
    }

    let tabIndex = TAB_INDICES.ImagePicker;

    const $defaultImgs = (() => {
        const $imgs = [];

        const assets = Assets[directory];
        for (const name in assets) {
            const asset = assets[name];
            $imgs.push(
                <SelectableImage
                    key={name}
                    name={name}
                    src={asset}
                    selected={selectedImage === name}
                    scale={imgScale}
                    onClick={() => setSelectedImage(name)}
                    onDoubleClick={() => handleImageDoubleClick(name)}
                    tabIndex={tabIndex}
                />
            );

            tabIndex++;
        }

        return $imgs;
    })();

    const $userImgs = (() => {
        const $imgs = [];

        for (const name in userFiles ?? {}) {
            const path = userFiles![name];
            $imgs.push(
                <SelectableImage
                    key={name}
                    name={name}
                    src={path}
                    selected={selectedImage === name}
                    scale={imgScale}
                    onClick={() => setSelectedImage(name)}
                    onDoubleClick={() => handleImageDoubleClick(name)}
                    tabIndex={tabIndex}
                />
            );

            tabIndex++;
        }

        return $imgs;
    })();

    const previewContainerClass = `preview-container ${bgColor}`;

    return (
        <div className="image-picker">
            <div className="galleries">
                <h2>Default images</h2>
                <div className={previewContainerClass}>
                    {$defaultImgs}
                </div>
                <h2>Custom images</h2>
                <div className={previewContainerClass}>
                    {$userImgs}
                </div>
            </div>
            <div className="buttons">
                <span className="selected-image-name">{selectedImage}</span>
                <ColorChooser
                    options={colorOptions}
                    selectedOption={bgColor}
                    onChange={color => setBgColor(color as ImageBackgroundColor)}
                />
                <ScaleScroll
                    min={48}
                    max={256}
                    defaultValue={120}
                    value={imgScale}
                    onChange={v => setImgScale(v)}
                    showReset
                />
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleUpload}>Upload</Button>
                <Button
                    highlighted
                    disabled={selectedImage === null}
                    onClick={handleSelect}
                >
                    Select
                </Button>
            </div>
        </div>
    );

    async function loadUserFiles () {
        const dataFolder = getDataFolder(directory);
        const names = await Ipc.scanFilesInDirectory(dataFolder);

        const paths = {} as UserFileCollection;
        for (const n of names) {
            paths[n] = "asset://" + dataFolder + "/" + n;
        }
        
        setUserFiles(paths);
    }

    async function handleImageDoubleClick (name: string) {
        onSelect(name);
    }

    async function handleSelect () {
        onSelect(selectedImage);
    }

    async function handleCancel () {
        onCancel?.(selectedImage);
    }

    async function handleUpload () {
        const name = await Ipc.uploadFile(FileTypes.images, directory);

        if (name === null) return;
        
        await loadUserFiles();
        setSelectedImage(name);
    }
}

export default ImagePicker;

export interface SelectableImageProps {
    name: string;
    src: string;
    selected: boolean;
    scale: number;
    onClick: () => void;
    onDoubleClick: () => void;
    tabIndex?: number;
}

function SelectableImage ({
    name,
    src,
    selected,
    scale,
    onClick,
    onDoubleClick,
    tabIndex,
}: SelectableImageProps) {
    const classStr = getClassString(
        "gallery-selectable-image",
        selected && "selected",
    )

    const style = {
        width: `${scale}px`,
        height: `${scale}px`,
    }

    return (
        <div
            className={classStr}
            onClick={onClick}
            onKeyDown={(evt) => {if (evt.key === "Enter") onClick()}}
            onDoubleClick={onDoubleClick}
            style={style}
            tabIndex={tabIndex}
        >
            <div className="image-highlighter" />
            <img src={src} />
        </div>
    );
}