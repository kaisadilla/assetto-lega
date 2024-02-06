import { useDataContext } from 'context/useDataContext';
import { AssetFolder, Assets } from 'data/assets';
import { FileTypes } from 'data/files';
import Button from 'elements/Button';
import ColorChooser from 'elements/ColorChooser';
import ScaleScroll from 'elements/ScaleScroll';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';
import { getClassString } from 'utils';

type UserFileCollection = {[name: string]: string};

export interface ImageGallerySelectorProps {
    directory: AssetFolder;
    preSelectedImage?: string | null;
    onSelect: (selectedImage: string | null) => void;
    onCancel?: (selectedImage: string | null) => void;
}

type BackgroundColor = "dark" | "transparent" | "white";

function ImageGallerySelector ({
    directory,
    preSelectedImage,
    onSelect,
    onCancel,
}: ImageGallerySelectorProps) {
    const { getDataFolder } = useDataContext();

    const [userFiles, setUserFiles] = useState<UserFileCollection | null>(null);
    const [selectedImage, setSelectedImage] = useState(preSelectedImage ?? null);

    const [imgScale, setImgScale] = useState(120);
    const [bgColor, setBgColor] = useState<BackgroundColor>("white");

    // read user assets in the AppData folder and load them into "userFiles".
    useEffect(() => {
        loadUserFiles();
    }, []);

    const colorOptions = {
        "dark": "#000000",
        "transparent": "#00000000",
        "white": "#ffffff",
    }

    const $defaultImgs = (() => {
        const $imgs = [];

        const assets = Assets[directory];
        for (const name in assets) {
            const asset = assets[name];
            //$imgs.push(<img key={name} className="asset-preview" src={asset} />);
            $imgs.push(
                <SelectableImage
                    key={name}
                    name={name}
                    src={asset}
                    selected={selectedImage === name}
                    scale={imgScale}
                    onClick={() => setSelectedImage(name)}
                    onDoubleClick={() => handleImageDoubleClick(name)}
                />
            );
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
                />
            )
        }

        return $imgs;
    })();

    const previewContainerClass = `preview-container ${bgColor}`;

    return (
        <div className="image-gallery-selector">
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
                    onChange={color => setBgColor(color as BackgroundColor)}
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

export default ImageGallerySelector;

export interface SelectableImageProps {
    name: string;
    src: string;
    selected: boolean;
    scale: number;
    onClick: () => void;
    onDoubleClick: () => void;
}

function SelectableImage ({
    name,
    src,
    selected,
    scale,
    onClick,
    onDoubleClick,
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
            onDoubleClick={onDoubleClick}
            style={style}
        >
            <div className="image-highlighter" />
            <img src={src} />
        </div>
    );
}