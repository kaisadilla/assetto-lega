import Button from 'elements/Button';
import Dialog from 'elements/Dialog';
import ScaleScroll from 'elements/ScaleScroll';
import ToolboxRow from 'elements/ToolboxRow';
import React, { useEffect, useState } from 'react';
import PickerDialog from './PickerDialog';
import Ipc from 'main/ipc/ipcRenderer';
import { FILE_PROTOCOL } from 'data/files';
import { BrandData, CarData } from 'data/schemas';
import { getCarPreviewFile } from 'paths';
import { PickerElement, PickerElementSection } from './PickerDialog.ThumbnailSelect';
import Textbox from 'elements/Textbox';
import NavBar from 'elements/NavBar';

const MIN_IMAGE_SIZE = 100;
const MAX_IMAGE_SIZE = 256;
const DEFAULT_IMAGE_SIZE = 196;

enum FilterType {
    Brand,
    Tag,
}

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
    const [carList, setCarList] = useState<CarData[] | null>(null);
    const [brandList, setBrandList] = useState<BrandData[] | null>(null);
    const [carEntries, setCarEntries] = useState<PickerElementSection[]>([]);

    const [selectedCar, setSelectedCar] = useState(preSelectedCar ?? null);
    const [imgScale, setImgScale] = useState(DEFAULT_IMAGE_SIZE);

    const [filterType, setFilterType] = useState(FilterType.Brand)

    useEffect(() => {
        loadAcData();
    }, []);

    useEffect(() => {
        if (carList === null) return;
        if (brandList === null) return;
        
        const section: PickerElementSection = {
            title: "Cars",
            elements: carList.map(c => {
                const defaultSkin = Object.keys(c.skins)[0];
                const path = getCarPreviewFile(c.skins[defaultSkin]?.folderPath, true);

                return {
                    value: c.folderName,
                    displayName: c.ui.name,
                    imagePath: path,
                } as PickerElement;
            })
        }

        setCarEntries([section]);
    }, [carList]);

    return (
        <PickerDialog className="default-car-picker">
            <div className="filter-navbar-container">
                <NavBar get={filterType} set={setFilterType}>
                    <NavBar.Item text="by brand" index={FilterType.Brand} />
                    <NavBar.Item text="by tag" index={FilterType.Tag} />
                </NavBar>
            </div>
            <div className="selector-container">
                <div className="filters-container">
                    <div className="filter">
                        <div className="filter-header">
                            <div className="filter-name">Brands</div>
                        </div>
                        <div className="filter-filter">
                            <Textbox
                                className="filter-filter-input"
                                placeholder="Filter brands..."
                            />
                        </div>
                        <div className="filter-list">
                            <div className="filter-brand">
                                <div className="brand-badge">
                                    <img src="asset://X:/SteamLibrary/steamapps/common/assettocorsa/content/cars/acfl_2006_ferrari/ui/badge.png" />
                                </div>
                                <div className="brand-name">
                                    Abarth
                                </div>
                            </div>
                            <div className="filter-brand">
                                <div className="brand-badge">
                                    <img src="asset://X:/SteamLibrary/steamapps/common/assettocorsa/content/cars/acfl_2006_mclaren/ui/badge.png" />
                                </div>
                                <div className="brand-name">
                                    Alfa Romeo
                                </div>
                            </div>
                            <div className="filter-brand">
                                <div className="brand-badge">
                                    <img src="asset://X:/SteamLibrary/steamapps/common/assettocorsa/content/cars/acfl_2006_redbull/ui/badge.png" />
                                </div>
                                <div className="brand-name">
                                    Alpine
                                </div>
                            </div>
                            {
                                brandList?.map(b => (
                                    <div className="filter-brand">
                                        <div className="brand-badge">
                                            <img src={b.badgePath} />
                                        </div>
                                        <div className="brand-name">
                                            {b.displayName}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="car-list-container">
                    <PickerDialog.ThumbnailSelector
                        className="car-gallery"
                        sections={carEntries}
                        selectedElement={selectedCar}
                        width={imgScale}
                        onSelect={c => setSelectedCar(c)}
                    />
                </div>
            </div>
            <PickerDialog.Toolbox>
                <ToolboxRow.Status text={selectedCar} />
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

    async function loadAcData () {
        const _cars = await Ipc.getCarList();
        setCarList(_cars);
        const _brands = await Ipc.getBrandList();
        setBrandList(_brands);
    }
}

export default CarPicker;
