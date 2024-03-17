import { useAcContext } from "context/useAcContext";
import { AcCar } from "data/schemas";
import CarThumbnail from "elements/CarThumbnail";
import CoverPanel from "elements/CoverPanel";
import { useState } from "react";
import { getClassString, isString } from "utils";
import CarSkinPicker from "./CarSkinPicker";

export interface CarSkinThumbnailFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    car: AcCar | string | null | undefined;
    selectedSkin: string | null | undefined;
    availableSkins?: string[];
    onSkinChange?: (value: string) => void;
}

function CarSkinThumbnailField ({
    car,
    selectedSkin,
    availableSkins,
    onSkinChange,
    className,
    ...divProps
}: CarSkinThumbnailFieldProps) {
    const { cars } = useAcContext();

    const [isPickerOpen, setPickerOpen] = useState(false);

    const classStr = getClassString(
        "default-car-skin-thumbnail-field",
        className,
    );
    
    if (isString(car)) {
        car = cars.carsById[car as string];
    }

    if (car === null || car === undefined) {
        return <div>(No car selected)</div>
    }
    const carObj = car as AcCar;

    if (availableSkins === undefined) {
        availableSkins = Object.keys(carObj.skinsById);
    }

    const skin = selectedSkin && availableSkins.includes(selectedSkin)
        ? carObj.skinsById[selectedSkin]
        : carObj.skins[0];

    return (
        <div className={classStr} {...divProps}>
            <CarThumbnail
                className="car-skin-content"
                car={car}
                carSkin={skin}
                onClick={() => setPickerOpen(true)}
            />
            {isPickerOpen && (<CoverPanel>
                <CarSkinPicker
                    car={carObj}
                    preSelectedSkins={skin.folderName}
                    availableSkins={availableSkins}
                    onSelect={handlePickerSelect}
                    onCancel={() => setPickerOpen(false)}
                />
            </CoverPanel>)}
        </div>
    );

    function handlePickerSelect (value: string | string[]) {
        if (Array.isArray(value)) value = value[0];

        setPickerOpen(false);
        onSkinChange?.(value);
    }
}

export default CarSkinThumbnailField;
