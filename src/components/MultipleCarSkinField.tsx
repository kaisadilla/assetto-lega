import { useDataContext } from 'context/useDataContext';
import { Files } from 'data/files';
import { AcCar, AcCarSkinCollection, AcCarSkin } from 'data/schemas';
import CoverPanel from 'elements/CoverPanel';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';
import { getClassString } from 'utils';
import CarPicker from './CarPicker';
import CarSkinPicker from './CarSkinPicker';
import { getCarSkinIcon } from 'paths';

export interface MultipleCarSkinFieldProps {
    skins?: string[];
    carId: string;
    onChange?: (skins: string[]) => void;
    className?: string;
    tabIndex?: number;
}

function MultipleCarSkinField ({
    skins,
    carId,
    onChange,
    className,
    tabIndex = 1,
}: MultipleCarSkinFieldProps) {
    skins ??= [];

    const [car, setCar] = useState<AcCar | null>(null);
    const [isPickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        loadCar();
    }, []);

    const classStr = getClassString(
        "default-multiple-car-skin-field",
        className,
    )

    if (car === null) {
        return <div className={classStr}>Loading...</div>
    }

    return (
        <div className={classStr} tabIndex={tabIndex}>
            <div className="skin-container" onClick={handleClick}>
                {skins.length > 0 && <CarSkinCollection
                    skins={car!.skinsById}
                    selectedSkins={skins}
                />}
                {skins.length === 0 && <div className="skin-container-error">
                    {"<No skins selected>"}
                </div>}
            </div>
            {isPickerOpen && (
            <CoverPanel>
                <CarSkinPicker
                    multipleSelection
                    car={car}
                    preSelectedSkins={skins}
                    onSelect={handlePickerSelect}
                    onCancel={() => setPickerOpen(false)}
                />
            </CoverPanel>
            )}
        </div>
    );

    async function loadCar () {
        const car = await Ipc.getCar(carId);
        setCar(car);
    }

    function handleClick () {
        setPickerOpen(true);
    }

    function handlePickerSelect (skins: string | string[] | null) {
        if (Array.isArray(skins) === false) {
            throw `MultipleCarSkinField expected picker's result to be string[], `
                + `but got '${skins}' instead.`;
        }
        setPickerOpen(false);
        onChange?.(skins);
    }
}

interface CarSkinCollectionProps {
    skins: AcCarSkinCollection;
    selectedSkins: string[];
}

function CarSkinCollection ({
    skins,
    selectedSkins,
}: CarSkinCollectionProps) {
    const skinArr = Object.values(skins);

    return (
        <>
            {selectedSkins.map(sel => {
                const skin = skins[sel];

                if (skin === undefined) return (
                    <div key={sel} className="skin">
                        ERR
                    </div>
                )
                else return (
                    <div key={sel} className="skin">
                        <img src={getCarSkinIcon(skin.folderPath, true)} />
                    </div>
                )
            })}
        </>
    );
}

export default MultipleCarSkinField;
