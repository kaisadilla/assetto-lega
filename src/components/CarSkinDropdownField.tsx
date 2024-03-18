import { useAcContext } from 'context/useAcContext';
import { AcCar, AcCarSkin } from 'data/schemas';
import Dropdown from 'elements/Dropdown';
import Img from 'elements/Img';
import Ipc from 'main/ipc/ipcRenderer';
import { getCarSkinIcon } from 'paths';
import React, { useEffect, useRef, useState } from 'react';
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
    const $field = useRef<HTMLDivElement>(null);

    const car = useAcContext().getCarById(carId);
    const carSkins = Object.keys(car?.skinsById ?? {});
    availableSkins = availableSkins?.filter(s => carSkins.includes(s));

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    
    useEffect(() => {
        if (!$field.current) return;

        const rect = $field.current.getBoundingClientRect();

        setDropdownStyle({
            top: rect.top + rect.height,
            left: rect.left,
            width: rect.width,
        });
    }, [isDropdownOpen]);

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

    if (car === null) {
        return <div className={classStr}>Loading...</div>
    }

    const selectedSkin = value === null ? null : car.skinsById[value];

    return (
        <div ref={$field} className={classStr} tabIndex={tabIndex} onBlur={handleBlur}>
            <div
                className="field-display-value skin-name-container"
                onClick={() => setDropdownOpen(true)}
            >
                {selectedSkin && <>
                    <div className="icon">
                        <Img src={getCarSkinIcon(selectedSkin.folderPath, true)} />
                    </div>
                    <div className="name">
                        {selectedSkin.ui.skinname ?? selectedSkin.folderName}
                    </div>
                </>}
            </div>
            {isDropdownOpen && <Dropdown
                className="car-skin-dropdown-field-menu"
                style={dropdownStyle}
            >
                {availableSkins.map(s => <CarSkinDropdownFieldEntry
                    key={s}
                    skin={car!.skinsById[s]}
                    onSelect={() => handleOptionSelect(s)}
                />)}
            </Dropdown>}
        </div>
    );

    function handleBlur (evt: React.FocusEvent<HTMLDivElement, HTMLElement>) {
        const target = evt.currentTarget;

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
                <Img src={getCarSkinIcon(skin.folderPath, true)} />
            </div>
            <div className="name">
                {skin.ui.skinname ?? skin.folderName}
            </div>
        </div>
    );
}


export default CarSkinDropdownField;
