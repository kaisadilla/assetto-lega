import CoverPanel from 'elements/CoverPanel';
import CarLogoImage from 'elements/images/CarLogoImage';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';
import { getClassString } from 'utils';
import CarPicker from './CarPicker';
import { AcCar } from 'data/schemas';
import { useAcContext } from 'context/useAcContext';

export interface CarFieldProps {
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    tabIndex?: number;
}

function CarField ({
    value,
    onChange,
    className,
    tabIndex = 1,
}: CarFieldProps) {
    const { getCarById } = useAcContext();

    const [car, setCar] = useState(getCarById(value));
    const [isPickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        setCar(getCarById(value));
    }, [value]);

    const classStr = getClassString(
        "default-control",
        "default-picker-field",
        "default-car-field",
        className,
    )

    const displayName = car ? (car.ui.name ?? car.folderName) : "<no car>";

    return (
        <div className={classStr} tabIndex={tabIndex}>
            <div className="picker-content car-content" onClick={handleClick}>
                {value && <div className="picker-image car-image">
                    <CarLogoImage carFolderName={value} />
                </div>}
                <div className="picker-name car-name">{displayName}</div>
            </div>
            {isPickerOpen && (
            <CoverPanel>
                <CarPicker
                    preSelectedCar={value}
                    onSelect={handlePickerSelect}
                    onCancel={() => setPickerOpen(false)}
                />
            </CoverPanel>
            )}
        </div>
    );

    function handleClick () {
        setPickerOpen(true);
    }

    function handlePickerSelect (value: string) {
        setPickerOpen(false);
        onChange?.(value);
    }
}

export default CarField;
