import CoverPanel from 'elements/CoverPanel';
import CarLogoImage from 'elements/images/CarLogoImage';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';
import { getClassString } from 'utils';
import CarPicker from './CarPicker';
import { AcCar } from 'data/schemas';

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
    const [fieldLoaded, setFieldLoaded] = useState(false);
    const [car, setCar] = useState<AcCar | null>(null);
    const [isPickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        loadCar();
    }, [value]);

    const classStr = getClassString(
        "default-control",
        "default-car-field",
        className,
    )

    if (fieldLoaded === false) {
        return (
            <div className={classStr} tabIndex={tabIndex}>
                <div className="loading">Loading...</div>
            </div>
        )
    }

    const displayName = car ? (car.ui.name ?? car.folderName) : "<no car>";

    return (
        <div className={classStr} tabIndex={tabIndex}>
            <div className="car-content" onClick={handleClick}>
                {value && <div className="car-image">
                    <CarLogoImage carFolderName={value} />
                </div>}
                <div className="car-name">{displayName}</div>
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

    async function loadCar () {
        if (value) {
            const car = await Ipc.getCar(value);
            setCar(car);
        }
        else {
            setCar(null);
        }
        setFieldLoaded(true);
    }
}

export default CarField;
