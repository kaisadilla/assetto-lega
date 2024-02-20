import Button from 'elements/Button';
import Dialog from 'elements/Dialog';
import ScaleScroll from 'elements/ScaleScroll';
import ToolboxRow from 'elements/ToolboxRow';
import React, { useEffect, useState } from 'react';
import PickerDialog from './PickerDialog';
import Ipc from 'main/ipc/ipcRenderer';
import { FILE_PROTOCOL } from 'data/files';
import { CarData } from 'data/schemas';
import { getCarPreviewFolder } from 'paths';
import { PickerElement, PickerElementSection } from './PickerDialog.ThumbnailSelect';

const MIN_IMAGE_SIZE = 48;
const MAX_IMAGE_SIZE = 256;
const DEFAULT_IMAGE_SIZE = 196;

export interface CarPickerProps {
    preSelectedCar?: string;
    onSelect: (selectedCar: string) => void;
    onCancel?: (selectedCar: string | null) => void;
}

function CarPicker ({
    preSelectedCar,
    onSelect,
    onCancel,
}: CarPickerProps) {
    const [carList, setCarList] = useState<CarData[] | null>(null);
    const [carEntries, setCarEntries] = useState<PickerElementSection[]>([]);

    const [selectedCar, setSelectedCar] = useState(preSelectedCar ?? null);
    const [imgScale, setImgScale] = useState(DEFAULT_IMAGE_SIZE);

    useEffect(() => {
        loadCarList();
    }, []);

    useEffect(() => {
        if (carList === null) return;
        
        const section: PickerElementSection = {
            title: "Cars",
            elements: carList.map(c => {
                const defaultSkin = Object.keys(c.skins)[0];
                const path = getCarPreviewFolder(c.skins[defaultSkin]?.folderPath, true);

                return {
                    value: c.folderName,
                    displayName: c.ui.name,
                    imagePath: path,
                } as PickerElement;
            })
        }

        setCarEntries([section]);
    }, [carList]);

    return (
        <PickerDialog className="default-car-picker">
            <div className="selector-container">
                <PickerDialog.ThumbnailSelector
                    sections={carEntries}
                    selectedElement={selectedCar}
                    width={imgScale}
                    onSelect={c => setSelectedCar(c)}
                />
            </div>
            <PickerDialog.Toolbox>
                <ToolboxRow.Status text={selectedCar} />
                <ScaleScroll
                    min={MIN_IMAGE_SIZE}
                    max={MAX_IMAGE_SIZE}
                    defaultValue={DEFAULT_IMAGE_SIZE}
                    value={imgScale}
                    onChange={v => setImgScale(v)}
                    showReset
                />
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                    highlighted
                    disabled={selectedCar === null}
                    onClick={handleSelect}
                >
                    Select
                </Button>
            </PickerDialog.Toolbox>
        </PickerDialog>
    );

    async function handleSelect () {
        if (selectedCar) {
            onSelect(selectedCar);
        }
    }

    async function handleCancel () {
        onCancel?.(selectedCar);
    }

    async function loadCarList () {
        const list = await Ipc.getCarList();
        setCarList(list);
    }
}

export default CarPicker;
