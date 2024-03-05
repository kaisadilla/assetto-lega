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
import { BrandFilterElement } from './PickerDialog.Filter';

const MIN_IMAGE_SIZE = 100;
const MAX_IMAGE_SIZE = 256;
const DEFAULT_IMAGE_SIZE = 196;

enum FilterType {
    Brand,
    Tag,
    Category,
    Name,
    Country,
    Decade,
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
    const [scale, setScale] = useState(DEFAULT_IMAGE_SIZE);

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
                thumbnailScale={scale}
                selectedCar={selectedCar}
                onSelect={car => setSelectedCar(car)}
                onSubmit={car => onSelect(car)}
            />
        }
        if (filterType === FilterType.Tag) {
            return <SelectorByTag
                carList={carData!.carList}
                tagList={carData!.tags}
                thumbnailScale={scale}
                selectedCar={selectedCar}
                onSelect={car => setSelectedCar(car)}
            />
        }
        if (filterType === FilterType.Name) {
            return <SelectorByName
                carList={carData!.carList}
                thumbnailScale={scale}
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
                    <NavBar.Item text="by category" index={FilterType.Category} />
                    <NavBar.Item text="by name" index={FilterType.Name} />
                    <NavBar.Item text="by country" index={FilterType.Country} />
                    <NavBar.Item text="by decade" index={FilterType.Decade} />
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
                    value={scale}
                    onChange={v => setScale(v)}
                    showReset
                />
                <Button isIconButton>
                    <MaterialSymbol symbol='gallery_thumbnail' />
                </Button>
                <Button isIconButton>
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
    onSubmit: (car: string) => void;
}

function SelectorByBrand ({
    carList,
    brandList,
    thumbnailScale,
    selectedCar,
    onSelect,
    onSubmit,
}: SelectorByBrandProps) {
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [carEntries, setCarEntries] = useState<PickerElementSection[]>([]);

    useEffect(() => {
        const sections = [] as PickerElementSection[];

        for (const b of brandList) {
            sections.push({
                title: b.displayName,
                id: b.displayName,
                elements: buildCarPickerItems(
                    carList.filter(c => c.ui.brand === b.displayName)
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
                    width={thumbnailScale}
                    selectedElement={selectedCar}
                    onSelect={c => onSelect(c)}
                    onDoubleClickItem={c => onSubmit(c)}
                    focusedSection={selectedBrand}
                />
            </div>
        </div>
    );

    async function handleFilterSelect (value: string) {
        setSelectedBrand(value);
    }

    function buildBrandFilterItems () : BrandFilterElement[] {
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
            id: selectedTag,
            elements: buildCarPickerItems(
                carList.filter(c =>
                    // if the ALL tag is selected, then all cars are shown.
                    c.ui.tags?.includes(selectedTag) || selectedTag === ALL_TAG
                ),
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
                    width={thumbnailScale}
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
                id: l,
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
                    width={thumbnailScale}
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

function buildCarPickerItems (carList: AcCar[]) {
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
                />
            )
        } as PickerElement;
    })
}



export default CarPicker;
