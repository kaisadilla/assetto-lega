import Button from 'elements/Button';
import Dialog from 'elements/Dialog';
import ScaleScroll from 'elements/ScaleScroll';
import ToolboxRow from 'elements/ToolboxRow';
import React, { useEffect, useState } from 'react';
import PickerDialog from './PickerDialog';
import Ipc from 'main/ipc/ipcRenderer';
import { FILE_PROTOCOL } from 'data/files';
import { BrandData, CarData, getCarDefaultSkin } from 'data/schemas';
import { getCarBadgeFile, getCarPreviewFile } from 'paths';
import { PickerElement, PickerElementSection } from './PickerDialog.ThumbnailSelect';
import Textbox from 'elements/Textbox';
import NavBar from 'elements/NavBar';
import { FilterElement } from './PickerDialog.Filter';
import CarThumbnail from 'elements/CarThumbnail';

const MIN_IMAGE_SIZE = 100;
const MAX_IMAGE_SIZE = 256;
const DEFAULT_IMAGE_SIZE = 196;

enum FilterType {
    Brand,
    Tag,
    Name,
    Country,
    Tier,
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

    const [carSearchValue, setCarSearchValue] = useState("");
    const [filterType, setFilterType] = useState(FilterType.Brand);
    const [filterValue, setFilterValue] = useState<string | null>(null);

    useEffect(() => {
        loadAcData();
    }, []);

    useEffect(() => {
        if (carList === null) return;
        if (brandList === null) return;

        if (filterType === FilterType.Brand) {
            const sections = [] as PickerElementSection[];

            for (const b of brandList) {
                sections.push({
                    title: b.displayName,
                    elements: buildCarPickerItems(
                        carList.filter(c => c.ui.brand === b.displayName)
                    ),
                })
            }

            setCarEntries(sections);
        }
    }, [carList, filterType]);

    useEffect(() => {
        if (filterValue !== null) {
            
        }
    }, [filterValue]);

    return (
        <PickerDialog className="default-car-picker">
            <div className="filter-navbar-container">
                <NavBar
                    className="filter-navbar"
                    get={filterType}
                    set={setFilterType}
                >
                    <NavBar.Item text="by brand" index={FilterType.Brand} />
                    <NavBar.Item text="by tag" index={FilterType.Tag} />
                    <NavBar.Item text="by name" index={FilterType.Name} />
                    <NavBar.Item text="by country" index={FilterType.Country} />
                    <NavBar.Item text="by tier" index={FilterType.Tier} />
                </NavBar>
                <Textbox
                    className="car-search-textbox"
                    placeholder="Search car..."
                    value={carSearchValue}
                    onChange={str => setCarSearchValue(str)}
                />
            </div>
            <div className="selector-container">
                <div className="filters-container">
                    <PickerDialog.Filter
                        title="Brands"
                        items={buildBrandFilterItems()}
                        selectedValue={filterValue}
                        onSelect={handleFilterSelect}
                    />
                </div>
                <div className="car-list-container">
                    <PickerDialog.ThumbnailSelector
                        className="car-gallery"
                        sections={carEntries}
                        selectedElement={selectedCar}
                        width={imgScale}
                        onSelect={c => setSelectedCar(c)}
                        focusedSection={filterValue}
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

    async function handleFilterSelect (value: string) {
        setFilterValue(value);
    }

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

    function buildBrandFilterItems () {
        return (brandList ?? []).map(b => ({
            name: b.displayName,
            value: b.displayName,
            element: <FilterBrandItem brand={b} />
        }));
    }

    function buildCarPickerItems (carList: CarData[]) {
        return carList.map(c => {
            const defaultSkin = getCarDefaultSkin(c);
            const previewPath = getCarPreviewFile(defaultSkin.folderPath, true);

            return {
                value: c.folderName,
                //displayName: c.ui.name,
                //imagePath: path,
                thumbnail: (
                    <CarThumbnail
                        name={c.ui.name ?? c.folderName}
                        badgePath={getCarBadgeFile(c.folderPath, true)}
                        previewPath={previewPath}
                        width={imgScale}
                    />
                )
            } as PickerElement;
        })
    }
}

interface FilterBrandItemProps {
    brand: BrandData;
}

function FilterBrandItem ({
    brand
}: FilterBrandItemProps) {

    return (
        <div className="filter-brand">
            <div className="brand-badge">
                <img src={brand.badgePath} />
            </div>
            <div className="brand-name">
                {brand.displayName}
            </div>
        </div>
    );
}


export default CarPicker;
