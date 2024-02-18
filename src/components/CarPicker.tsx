import Button from 'elements/Button';
import Dialog from 'elements/Dialog';
import ScaleScroll from 'elements/ScaleScroll';
import ToolboxRow from 'elements/ToolboxRow';
import React, { useState } from 'react';
import PickerDialog from './PickerDialog';

const MIN_IMAGE_SIZE = 48;
const MAX_IMAGE_SIZE = 256;
const DEFAULT_IMAGE_SIZE = 128;

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
    const [selectedCar, setSelectedCar] = useState(preSelectedCar ?? null)
    const [imgScale, setImgScale] = useState(DEFAULT_IMAGE_SIZE)

    return (
        <PickerDialog className="default-car-picker">
            <PickerDialog.GalleriesSection>
                <PickerDialog.SectionTitle>
                    Cars
                </PickerDialog.SectionTitle>
                <PickerDialog.Gallery>
                    {"$defaultImgs"}
                </PickerDialog.Gallery>
            </PickerDialog.GalleriesSection>
            <PickerDialog.Toolbox>
                <ToolboxRow.Status text={"selectedCar"} />
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
}

export default CarPicker;
