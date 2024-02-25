import React, { useEffect, useState } from 'react';
import PickerDialog from './PickerDialog';
import ToolboxRow from 'elements/ToolboxRow';
import Button from 'elements/Button';
import { AcCar, AcCarSkin, AcCarSkinCollection } from 'data/schemas';
import Ipc from 'main/ipc/ipcRenderer';
import { getCarSkinIcon, getCarSkinPreviewFile } from 'paths';
import { getClassString } from 'utils';
import Checkbox from 'elements/Checkbox';

// TODO: Document - parameters receive a string if multipleSelection = false,
// or an array of strings if multipleSelection = true.
export interface CarSkinPickerProps {
    multipleSelection?: boolean;
    car: AcCar;
    preSelectedSkins: string | string[];
    onSelect: (selectedSkins: string | string[]) => void;
    onCancel?: (selectedSkins: string | string[] | null) => void;
}

function CarSkinPicker ({
    multipleSelection = false,
    car,
    preSelectedSkins,
    onSelect,
    onCancel,
}: CarSkinPickerProps) {
    const firstSkin = Object.values(car.skinsById)[0];

    // the skin chosen to preview, not a skin that is actually selected.
    const [highlightedSkin, setHighlightedSkin] = useState<string | null>(
        firstSkin.folderName
    );

    const sel = Array.isArray(preSelectedSkins)
        ? preSelectedSkins
        : [preSelectedSkins];

    const [selectedSkins, setSelectedSkins] = useState(sel);

    return (
        <PickerDialog className="default-car-skin-picker">
            <div className="car-skin-picker-gallery">
                <div className="skin-preview-container">
                    {highlightedSkin && <CarSkinInfo skin={car.skinsById[highlightedSkin]} />}
                </div>
                <div className="skin-selection-container">
                    <CarSkinList
                        multipleSelection={multipleSelection}
                        skins={car.skins}
                        highlightedSkin={highlightedSkin}
                        selectedSkins={selectedSkins}
                        onClickEntry={handleClickSkin}
                        onCheckEntry={handleCheckSkin}
                    />
                </div>
            </div>
            <PickerDialog.Toolbox className="car-skin-picker-toolbox">
                <ToolboxRow.Status text={selectedSkins.join(", ")} />
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
                <img src={getCarSkinPreviewFile(skin.folderPath, true)} />
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
        <div className={classStr} onClick={onClick}>
            {multipleSelection && <div className="skin-checkbox">
                <Checkbox
                    value={selected}
                    onChange={value => onCheck(value)}
                />
            </div>}
            <div className="skin-icon">
                <img src={getCarSkinIcon(skin.folderPath, true)} />
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
