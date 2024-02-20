import CoverPanel from 'elements/CoverPanel';
import CarLogoImage from 'elements/images/CarLogoImage';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';
import { getClassString } from 'utils';
import CarPicker from './CarPicker';
import { CarData } from 'data/schemas';

export interface CarFieldProps {
    value: string;
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
    const [car, setCar] = useState<CarData | null>(null);
    const [isPickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        loadCar();
    }, []);

    const classStr = getClassString(
        "default-control",
        "default-car-field",
        className,
    )

    if (car === null) {
        return (
            <div className={classStr} tabIndex={tabIndex}>
                <div className="loading">Loading...</div>
            </div>
        )
    }


    return (
        <div className={classStr} tabIndex={tabIndex}>
            <div className="car-content" onClick={handleClick}>
                <div className="car-image">
                    <CarLogoImage carFolderName={value} />
                </div>
                <div className="car-name">{car!.ui.name}</div>
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
        const car = await Ipc.getCarData(value);
        setCar(car);
    }
}

export default CarField;
