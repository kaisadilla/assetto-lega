import Button from 'elements/Button';
import Dialog from 'elements/Dialog';
import ScaleScroll from 'elements/ScaleScroll';
import ToolboxRow from 'elements/ToolboxRow';
import React, { useEffect, useState } from 'react';
import PickerDialog from './PickerDialog';
import Ipc from 'main/ipc/ipcRenderer';
import { FILE_PROTOCOL } from 'data/files';
import { AcCarBrand, AcCar, getCarDefaultSkin, AcCarCollection } from 'data/schemas';
import { getCarBadgeFile, getCarPreviewFile } from 'paths';
import { PickerElement, PickerElementSection } from './PickerDialog.ThumbnailGallery';
import Textbox from 'elements/Textbox';
import NavBar from 'elements/NavBar';
import CarThumbnail from 'elements/CarThumbnail';
import MaterialSymbol from 'elements/MaterialSymbol';
import { LETTERS } from 'al_constants';
import { LOCALE } from 'utils';

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

enum ViewType {
    Gallery,
    List,
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
    const [carData, setCarData] = useState<AcCarCollection | null>(null);

    const [selectedCar, setSelectedCar] = useState(preSelectedCar ?? null);
    const [imgScale, setImgScale] = useState(DEFAULT_IMAGE_SIZE);

    const [carSearchValue, setCarSearchValue] = useState("");
    const [filterType, setFilterType] = useState(FilterType.Brand);

    const [viewType, setViewType] = useState(ViewType.Gallery);

    useEffect(() => {
        loadAcData();
    }, []);

    const $selector = (() => {
        if (carData === null) {
            return (
                <div className="selector-container">
                    Loading...
                </div>
            )
        }
        if (filterType === FilterType.Brand) {
            return <SelectorByBrand
                carList={carData!.carList}
                brandList={carData!.brands}
                thumbnailScale={imgScale}
                selectedCar={selectedCar}
                onSelect={car => setSelectedCar(car)}
            />
        }
        if (filterType === FilterType.Tag) {
            return <SelectorByTag
                carList={carData!.carList}
                tagList={carData!.tags}
                thumbnailScale={imgScale}
                selectedCar={selectedCar}
                onSelect={car => setSelectedCar(car)}
            />
        }
        if (filterType === FilterType.Name) {
            return <SelectorByName
                carList={carData!.carList}
                thumbnailScale={imgScale}
                selectedCar={selectedCar}
                onSelect={car => setSelectedCar(car)}
            />
        }
        return (
            <div className="selector-container">
                Section not implemented
            </div>
        );
    })();

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
            {$selector}
            <PickerDialog.Toolbox className="car-picker-toolbox">
                <ToolboxRow.Status text={selectedCar} />
                <ScaleScroll
                    min={MIN_IMAGE_SIZE}
                    max={MAX_IMAGE_SIZE}
                    defaultValue={DEFAULT_IMAGE_SIZE}
                    value={imgScale}
                    onChange={v => setImgScale(v)}
                    showReset
                />
                <Button className="view-style-button">
                    <MaterialSymbol symbol='gallery_thumbnail' />
                </Button>
                <Button className="view-style-button">
                    <MaterialSymbol symbol='list' />
                </Button>
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
        const _data = await Ipc.getCarData();
        setCarData(_data);
    }
}

interface SelectorByBrandProps {
    carList: AcCar[];
    brandList: AcCarBrand[];
    thumbnailScale: number;
    selectedCar: string | null;
    onSelect: (car: string) => void;
}

function SelectorByBrand ({
    carList,
    brandList,
    thumbnailScale,
    selectedCar,
    onSelect,
}: SelectorByBrandProps) {
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [carEntries, setCarEntries] = useState<PickerElementSection[]>([]);

    useEffect(() => {
        const sections = [] as PickerElementSection[];

        for (const b of brandList) {
            sections.push({
                title: b.displayName,
                elements: buildCarPickerItems(
                    carList.filter(c => c.ui.brand === b.displayName),
                    thumbnailScale,
                ),
            })
        }

        setCarEntries(sections);
    }, [carList]);

    return (
        <div className="selector-container">
            <div className="filters-container">
                <PickerDialog.Filter
                    title="Brands"
                    selectorListStyle='brand'
                    brandItems={buildBrandFilterItems()}
                    selectedValue={selectedBrand}
                    onSelect={handleFilterSelect}
                />
            </div>
            <div className="car-list-container">
                <PickerDialog.ThumbnailGallery
                    className="car-gallery"
                    sections={carEntries}
                    selectedElement={selectedCar}
                    onSelect={c => onSelect(c)}
                    onDoubleClickItem={c => onSelect(c)}
                    focusedSection={selectedBrand}
                />
            </div>
        </div>
    );

    async function handleFilterSelect (value: string) {
        setSelectedBrand(value);
    }

    function buildBrandFilterItems () {
        return brandList.map(b => ({
            name: b.displayName,
            value: b.displayName,
            badgePath: b.badgePath,
        }));
    }
}

interface SelectorByTagProps {
    carList: AcCar[];
    tagList: string[];
    thumbnailScale: number;
    selectedCar: string | null;
    onSelect: (car: string) => void;
}

function SelectorByTag ({
    carList,
    tagList,
    thumbnailScale,
    selectedCar,
    onSelect,
}: SelectorByTagProps) {
    const ALL_TAG = "All";

    const [selectedTag, setSelectedTag] = useState<string>(ALL_TAG);
    const [carEntries, setCarEntries] = useState<PickerElementSection[]>([]);

    useEffect(() => {
        const sections = [] as PickerElementSection[];

        sections.push({
            title: selectedTag,
            elements: buildCarPickerItems(
                carList.filter(c =>
                    // if the ALL tag is selected, then all cars are shown.
                    c.ui.tags?.includes(selectedTag) || selectedTag === ALL_TAG
                ),
                thumbnailScale,
            ),
        })

        setCarEntries(sections);
    }, [carList, selectedTag]);

    return (
        <div className="selector-container">
            <div className="filters-container">
                <PickerDialog.Filter
                    title="Tags"
                    selectorListStyle='text'
                    textItems={buildTagFilterItems()}
                    selectedValue={selectedTag}
                    onSelect={handleFilterSelect}
                />
            </div>
            <div className="car-list-container">
                <PickerDialog.ThumbnailGallery
                    className="car-gallery"
                    sections={carEntries}
                    selectedElement={selectedCar}
                    onSelect={c => onSelect(c)}
                    onDoubleClickItem={c => onSelect(c)}
                />
            </div>
        </div>
    );

    async function handleFilterSelect (value: string) {
        setSelectedTag(value);
    }

    function buildTagFilterItems () {
        return [
            {
                name: ALL_TAG,
                value: ALL_TAG,
            },
            ...tagList.map(t => ({
                name: t,
                value: t,
            }))
        ];
    }
}

interface SelectorByNameProps {
    carList: AcCar[];
    thumbnailScale: number;
    selectedCar: string | null;
    onSelect: (car: string) => void;
}

function SelectorByName ({
    carList,
    thumbnailScale,
    selectedCar,
    onSelect,
}: SelectorByNameProps) {
    const LETTER_OTHER = "Other";
    const letters = [...LETTERS, LETTER_OTHER];

    const [selectedLetter, setSelectedLetter] = useState<string>(letters[0]);
    const [carEntries, setCarEntries] = useState<PickerElementSection[]>([]);

    useEffect(() => {
        const sections = [] as PickerElementSection[];

        for (const l of letters) {
            sections.push({
                title: l,
                elements: buildCarPickerItems(
                    carList.filter(c => {
                        const carName = c.ui.name ?? c.folderName;
                        const filterName = carName.toLocaleUpperCase(LOCALE);
                        if (l === LETTER_OTHER) {
                            return /^[^a-zA-Z]/.test(filterName);
                        }
                        else {
                            return filterName.charAt(0) === l;
                        }
                    }),
                    thumbnailScale,
                ),
            })
        }

        setCarEntries(sections);
    }, [carList]);

    return (
        <div className="selector-container">
            <div className="filters-container">
                <PickerDialog.Filter
                    title="Tags"
                    selectorListStyle='text'
                    textItems={buildTagFilterItems()}
                    selectedValue={selectedLetter}
                    onSelect={handleFilterSelect}
                />
            </div>
            <div className="car-list-container">
                <PickerDialog.ThumbnailGallery
                    className="car-gallery"
                    sections={carEntries}
                    selectedElement={selectedCar}
                    onSelect={c => onSelect(c)}
                    onDoubleClickItem={c => onSelect(c)}
                    focusedSection={selectedLetter}
                />
            </div>
        </div>
    );

    async function handleFilterSelect (value: string) {
        setSelectedLetter(value);
    }

    function buildTagFilterItems () {
        return letters.map(l => ({
            name: l,
            value: l,
        }));
    }
}


interface FilterTagItemProps {
    tag: string;
}

function FilterTagItem ({tag}: FilterTagItemProps) {

    return (
        <div>
            {tag}
        </div>
    );
}

function buildCarPickerItems (carList: AcCar[], width: number) {
    return carList.map(c => {
        const defaultSkin = getCarDefaultSkin(c);
        const previewPath = getCarPreviewFile(defaultSkin.folderPath, true);

        return {
            value: c.folderName,
            thumbnail: (
                <CarThumbnail
                    name={c.ui.name ?? c.folderName}
                    badgePath={getCarBadgeFile(c.folderPath, true)}
                    previewPath={previewPath}
                    width={width}
                />
            )
        } as PickerElement;
    })
}



export default CarPicker;
