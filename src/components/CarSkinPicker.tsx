import React, { useEffect, useRef, useState } from 'react';
import PickerDialog from './PickerDialog';
import ToolboxRow from 'elements/ToolboxRow';
import Button from 'elements/Button';
import { AcCar, AcCarSkin, AcCarSkinCollection } from 'data/schemas';
import Ipc from 'main/ipc/ipcRenderer';
import { getCarSkinIcon, getCarSkinPreviewFile } from 'paths';
import { getClassString } from 'utils';
import Checkbox from 'elements/Checkbox';
import Img from 'elements/Img';

// TODO: Document - parameters receive a string if multipleSelection = false,
// or an array of strings if multipleSelection = true.
export interface CarSkinPickerProps {
    multipleSelection?: boolean;
    car: AcCar;
    preSelectedSkins: string | string[];
    availableSkins?: string[];
    onSelect: (selectedSkins: string | string[]) => void;
    onCancel?: (selectedSkins: string | string[] | null) => void;
}

function CarSkinPicker ({
    multipleSelection = false,
    car,
    preSelectedSkins,
    availableSkins,
    onSelect,
    onCancel,
}: CarSkinPickerProps) {
    if (availableSkins === undefined || availableSkins.length === 0) {
        availableSkins = Object.keys(car.skinsById);
    }

    const sel = Array.isArray(preSelectedSkins)
        ? preSelectedSkins
        : [preSelectedSkins];

        console.log(sel);
    const [selectedSkins, setSelectedSkins] = useState(sel);
    // the skin chosen to preview, not a skin that is actually selected.
    const [highlightedSkin, setHighlightedSkin] = useState<string | null>(sel[0]);

    return (
        <PickerDialog className="default-car-skin-picker">
            <div className="car-skin-picker-gallery">
                <div className="skin-preview-container">
                    {highlightedSkin && <CarSkinInfo skin={car.skinsById[highlightedSkin]} />}
                </div>
                <div className="skin-selection-container">
                    <CarSkinList
                        multipleSelection={multipleSelection}
                        skins={car.skins.filter(s => availableSkins!.includes(s.folderName))}
                        highlightedSkin={highlightedSkin}
                        selectedSkins={selectedSkins}
                        onClickEntry={handleClickSkin}
                        onCheckEntry={handleCheckSkin}
                    />
                </div>
            </div>
            <PickerDialog.Toolbox className="car-skin-picker-toolbox">
                <ToolboxRow.Status text={selectedSkins.join(", ")} />
                <Button onClick={handleRemoveAll}>Remove all</Button>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                    highlighted
                    disabled={selectedSkins.length === 0}
                    onClick={handleSelect}
                >
                    Select
                </Button>
            </PickerDialog.Toolbox>
        </PickerDialog>
    );

    async function handleClickSkin (skin: string) {
        setHighlightedSkin(skin);
        if (!multipleSelection) {
            setSelectedSkins([skin]);
        }
    }

    async function handleCheckSkin (skin: string, checked: boolean) {
        setSelectedSkins(prevState => {
            const newValues = new Set<string>(prevState);

            if (checked) {
                if (newValues.has(skin) === false) {
                    newValues.add(skin);
                }
            }
            else {
                if (newValues.has(skin)) {
                    newValues.delete(skin);
                }
            }

            return Array.from(newValues);
        });
    }

    async function handleSelect () {
        if (selectedSkins.length > 0) {
            onSelect(returnSkinOrArray());
        }
    }

    async function handleCancel () {
        onCancel?.(returnSkinOrArray());
    }

    async function handleRemoveAll () {
        setSelectedSkins([]);
    }

    function returnSkinOrArray () {
        if (multipleSelection) {
            return selectedSkins;
        }
        else {
            return selectedSkins[0];
        }
    }
}

interface CarSkinInfoProps {
    skin: AcCarSkin;
}

function CarSkinInfo ({
    skin,
}: CarSkinInfoProps) {

    return (
        <div className="skin-preview">
            <div className="skin-preview-image">
                <Img src={getCarSkinPreviewFile(skin.folderPath, true)} />
            </div>
            <div className="skin-preview-info">
                <div className="info-entry">
                    <span className="info-title">Folder: </span>
                    <span className="info-value">
                        {skin.folderName}
                    </span>
                </div>
                <div className="info-entry">
                    <span className="info-title">Name: </span>
                    <span className="info-value">
                        {skin.ui.skinname ?? "<no-skin>"}
                    </span>
                </div>
                <div className="info-entry">
                    <span className="info-title">Number: </span>
                    <span className="info-value">
                        {skin.ui.number ?? "<no number>"}
                    </span>
                </div>
                <div className="info-entry">
                    <span className="info-title">Team: </span>
                    <span className="info-value">
                        {skin.ui.team ?? "<no team>"}
                    </span>
                </div>
                <div className="info-entry">
                    <span className="info-title">Driver: </span>
                    <span className="info-value">
                        {skin.ui.drivername ?? "<no driver>"}
                    </span>
                </div>
            </div>
        </div>
    );
}


interface CarSkinListProps {
    multipleSelection: boolean;
    skins: AcCarSkin[];
    highlightedSkin: string | null;
    selectedSkins: string[];
    onClickEntry: (skin: string) => void;
    onCheckEntry: (skin: string, checked: boolean) => void;
}

function CarSkinList ({
    multipleSelection,
    skins,
    highlightedSkin,
    selectedSkins,
    onClickEntry,
    onCheckEntry,
}: CarSkinListProps) {

    return (
        <div className="skin-list">
            {
                skins.map(s => <CarSkinListEntry
                    key={s.folderName}
                    skin={s}
                    highlighted={highlightedSkin === s.folderName}
                    selected={selectedSkins.includes(s.folderName)}
                    multipleSelection={multipleSelection}
                    onClick={() => onClickEntry(s.folderName)}
                    onCheck={checked => onCheckEntry(s.folderName, checked)}
                />
            )}
        </div>
    );
}

interface CarSkinListEntryProps {
    multipleSelection: boolean;
    skin: AcCarSkin;
    highlighted: boolean;
    selected: boolean;
    onClick: () => void;
    onCheck: (checked: boolean) => void;
}

function CarSkinListEntry ({
    multipleSelection,
    skin,
    highlighted,
    selected,
    onClick,
    onCheck,
}: CarSkinListEntryProps) {
    const $div = useRef<HTMLDivElement>(null);
    const [alreadyTriedFocusing, setAlreadyTriedFocusing] = useState(false);

    // this complicated part is just to focus the first selected skin when
    // the dialog is opened, but not refocus anything afterwards.
    useEffect(() => {
        if (highlighted && alreadyTriedFocusing === false) {
            $div.current?.scrollIntoView();
        }
        if ($div.current !== null) {
            setAlreadyTriedFocusing(true);
        }
    }, [$div.current !== null]);

    const number = skin.ui.number ? "#" + skin.ui.number : "<no number>";
    const name = skin.ui.skinname ? `"${skin.ui.skinname}"` : "<no name>";
    const teamDriver = (() => {
        if (skin.ui.team && skin.ui.drivername) {
            return `${skin.ui.team}: ${skin.ui.drivername}`;
        }
        if (skin.ui.team && !skin.ui.drivername) {
            return `${skin.ui.team}, (no driver)`;
        }
        if (!skin.ui.team && skin.ui.drivername) {
            return `${skin.ui.drivername}, (no team)`;
        }
        return "<no team or driver>";
    })();

    const classStr = getClassString(
        "skin-entry",
        highlighted && "highlighted",
    )

    return (
        <div ref={$div} className={classStr} onClick={onClick}>
            {multipleSelection && <div className="skin-checkbox">
                <Checkbox
                    value={selected}
                    onChange={value => onCheck(value)}
                />
            </div>}
            <div className="skin-icon">
                <Img src={getCarSkinIcon(skin.folderPath, true)} />
            </div>
            <div className="skin-info">
                <span className="skin-number">{number}</span>
                <span className="skin-name">{name}</span>
                <span className="skin-team-and-driver">{teamDriver}</span>
            </div>
        </div>
    );
}



export default CarSkinPicker;
