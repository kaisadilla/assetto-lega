import { AcCar, AcCarSkin } from 'data/schemas';
import Dropdown from 'elements/Dropdown';
import Ipc from 'main/ipc/ipcRenderer';
import { getCarSkinIcon } from 'paths';
import React, { useEffect, useState } from 'react';
import { getClassString } from 'utils';

export interface CarSkinDropdownFieldProps {
    carId?: string;
    availableSkins?: string[];
    value: string | null;
    onChange?: (skin: string) => void;
    className?: string;
    tabIndex?: number;
}

function CarSkinDropdownField ({
    carId,
    availableSkins,
    value,
    onChange,
    className,
    tabIndex = 1,
}: CarSkinDropdownFieldProps) {
    const classStr = getClassString(
        "default-control",
        "default-car-skin-dropdown-field",
        className,
    )

    if (carId === undefined || availableSkins == undefined) {
        return (
            <div className={classStr}>
                <div className="field-error-message">
                    No skins available.
                </div>
            </div>
        )
    }

    const [car, setCar] = useState<AcCar | null>(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        loadCar();
    }, []);

    if (car === null) {
        return <div className={classStr}>Loading...</div>
    }

    const selectedSkin = value === null ? null : car.skinsById[value];

    //const $value = (() => {
    //    if
    //})();

    return (
        <div className={classStr} tabIndex={tabIndex} onBlur={handleBlur}>
            <div
                className="field-display-value skin-name-container"
                onClick={() => setDropdownOpen(true)}
            >
                {selectedSkin && <>
                    <div className="icon">
                        <img src={getCarSkinIcon(selectedSkin.folderPath, true)} />
                    </div>
                    <div className="name">
                        {selectedSkin.ui.skinname ?? selectedSkin.folderName}
                    </div>
                </>}
            </div>
            {isDropdownOpen && <Dropdown className="car-skin-dropdown-field-menu">
                {availableSkins.map(s => <CarSkinDropdownFieldEntry
                    key={s}
                    skin={car!.skinsById[s]}
                    onSelect={() => handleOptionSelect(s)}
                />)}
            </Dropdown>}
        </div>
    );

    async function loadCar () {
        if (carId === undefined) {
            console.warn(
                "Called loadCar() in CarSkinDropdownField while 'carId'"
                + "is undefined."
            );
            setCar(null);
        }
        else {
            const car = await Ipc.getCar(carId);
            setCar(car);
        }
    }

    function handleBlur (evt: React.FocusEvent<HTMLDivElement, HTMLElement>) {
        const target = evt.currentTarget;
        console.log("blur!");

        // Give the app time to focus the next element.
        requestAnimationFrame(() => {
            // check if the new focused element is a child of this element
            // (i.e. the suggestions menu).
            if (target.contains(document.activeElement) === false) {
                setDropdownOpen(false);
            }
        })
    }

    function handleOptionSelect (skin: string) {
        onChange?.(skin);
        setDropdownOpen(false);
    }
}

interface CarSkinDropdownFieldEntryProps {
    skin: AcCarSkin,
    onSelect: () => void;
}

function CarSkinDropdownFieldEntry ({
    skin,
    onSelect,
}: CarSkinDropdownFieldEntryProps) {

    return (
        <div
            className="car-skin-dropdown-field-entry skin-name-container"
            onClick={() => onSelect()}
        >
            <div className="icon">
                <img src={getCarSkinIcon(skin.folderPath, true)} />
            </div>
            <div className="name">
                {skin.ui.skinname ?? skin.folderName}
            </div>
        </div>
    );
}


export default CarSkinDropdownField;
