import { useDataContext } from 'context/useDataContext';
import { AssetFolder, Assets } from 'data/assets';
import { FileTypes } from 'data/files';
import Button from 'elements/Button';
import ColorChooser from 'elements/ColorChooser';
import Dialog from 'elements/Dialog';
import ScaleScroll from 'elements/ScaleScroll';
import ToolboxRow from 'elements/ToolboxRow';
import Ipc from 'main/ipc/ipcRenderer';
import { TAB_INDICES } from 'names';
import React, { useEffect, useState } from 'react';
import { clampNumber, getClassString } from 'utils';
import PickerDialog, { PickerImageBackgroundColor } from './PickerDialog';

type UserFileCollection = {[name: string]: string};

const MIN_IMAGE_SIZE = 48;
const MAX_IMAGE_SIZE = 256;

export interface ImagePickerProps {
    directory: AssetFolder;
    preSelectedImage?: string | null;
    defaultImageBackgroundColor?: PickerImageBackgroundColor;
    defaultImageSize?: number;
    onSelect: (selectedImage: string | null) => void;
    onCancel?: (selectedImage: string | null) => void;
}

function ImagePicker ({
    directory,
    preSelectedImage,
    defaultImageBackgroundColor = "transparent",
    defaultImageSize = 120,
    onSelect,
    onCancel,
}: ImagePickerProps) {
    defaultImageSize = clampNumber(
        defaultImageSize, MIN_IMAGE_SIZE, MAX_IMAGE_SIZE
    );

    const { getDataFolder } = useDataContext();

    const [userFiles, setUserFiles] = useState<UserFileCollection | null>(null);
    const [selectedImage, setSelectedImage] = useState(preSelectedImage ?? null);

    const [imgScale, setImgScale] = useState(defaultImageSize);
    const [bgColor, setBgColor] = useState<PickerImageBackgroundColor>(
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
                <PickerDialog.Image
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
                <PickerDialog.Image
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

    return (
        <PickerDialog className="default-image-picker">
            <PickerDialog.GalleriesSection imageBackgroundColor={bgColor}>
                <PickerDialog.SectionTitle>
                    Default images
                </PickerDialog.SectionTitle>
                <PickerDialog.Gallery>
                    {$defaultImgs}
                </PickerDialog.Gallery>
                <PickerDialog.SectionTitle>
                    Custom images
                </PickerDialog.SectionTitle>
                <PickerDialog.Gallery>
                    {$userImgs}
                </PickerDialog.Gallery>
            </PickerDialog.GalleriesSection>
            <PickerDialog.Toolbox>
                <ToolboxRow.Status text={selectedImage} />
                <ColorChooser
                    options={colorOptions}
                    selectedOption={bgColor}
                    onChange={color => setBgColor(color as PickerImageBackgroundColor)}
                />
                <ScaleScroll
                    min={MIN_IMAGE_SIZE}
                    max={MAX_IMAGE_SIZE}
                    defaultValue={defaultImageSize}
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
            </PickerDialog.Toolbox>
        </PickerDialog>
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