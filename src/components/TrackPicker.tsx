import React, { useEffect, useState } from 'react';
import PickerDialog from './PickerDialog';
import ToolboxRow from 'elements/ToolboxRow';
import ScaleScroll from 'elements/ScaleScroll';
import Button from 'elements/Button';
import MaterialSymbol from 'elements/MaterialSymbol';
import Ipc from 'main/ipc/ipcRenderer';
import { AcTrackCollection } from 'data/schemas';
import NavBar from 'elements/NavBar';
import Textbox from 'elements/Textbox';

const MIN_IMAGE_SIZE = 100;
const MAX_IMAGE_SIZE = 256;
const DEFAULT_THUMBNAIL_SIZE = 196;

enum FilterType {
    Country,
    Tag,
    Category,
    Name,
    Decade,
    Tier,
}

enum ViewType {
    Gallery,
    List,
}

export interface TrackPickerValue {
    track?: string;
    layout?: string;
}

export interface TrackPickerProps {
    preSelectedTrack: TrackPickerValue;
    onSelect: (selectedCar: TrackPickerValue) => void;
    onCancel?: (selectedCar: TrackPickerValue | null) => void;
}

function TrackPicker ({
    preSelectedTrack,
    onSelect,
    onCancel,
}: TrackPickerProps) {
    const [trackData, setTrackData] = useState<AcTrackCollection | null>(null);

    const [selectedTrack, setSelectedTrack] = useState(preSelectedTrack ?? null);
    const [scale, setScale] = useState(DEFAULT_THUMBNAIL_SIZE);

    const [carSearchValue, setCarSearchValue] = useState("");
    const [filterType, setFilterType] = useState(FilterType.Country);

    const [viewType, setViewType] = useState(ViewType.Gallery);

    useEffect(() => {
        loadAcData();
    }, []);

    const $selector = (() => {
        if (trackData === null) {
            return (
                <div className="selector-container">
                    Loading...
                </div>
            )
        }
        if (filterType === FilterType.Country) {
            return <SelectorByCountry

            />
        }
    })();

    return (
        <PickerDialog className="default-track-picker">
            <div className="filter-navbar-container">
                <NavBar
                    className="filter-navbar"
                    get={filterType}
                    set={setFilterType}
                >
                    <NavBar.Item text="by country" index={FilterType.Country} />
                    <NavBar.Item text="by tag" index={FilterType.Tag} />
                    <NavBar.Item text="by category" index={FilterType.Category} />
                    <NavBar.Item text="by name" index={FilterType.Name} />
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
            <PickerDialog.Toolbox className="track-picker-toolbox">
                <ToolboxRow.Status text={
                    trackPickerValueToString(selectedTrack)}
                />
                <ScaleScroll
                    min={MIN_IMAGE_SIZE}
                    max={MAX_IMAGE_SIZE}
                    defaultValue={DEFAULT_THUMBNAIL_SIZE}
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
                    disabled={selectedTrack === null}
                    onClick={handleSelect}
                >
                    Select
                </Button>
            </PickerDialog.Toolbox>
        </PickerDialog>
    );

    async function handleSelect () {
        if (selectedTrack) {
            onSelect(selectedTrack);
        }
    }

    async function handleCancel () {
        onCancel?.(selectedTrack);
    }

    async function loadAcData () {
        const _data = await Ipc.getTrackData();
        setTrackData(_data);
    }
}

interface SelectorByCountryProps {
    
}

function SelectorByCountry (props: SelectorByCountryProps) {

    return (
        <div className="selector-container">
            country!
        </div>
    );
}


export default TrackPicker;

function trackPickerValueToString (value: TrackPickerValue) {
    if (value.track) {
        if (value.layout) {
            return `${value.track} > ${value.layout}`;
        }
        else {
            return value.track;
        }
    }
    else {
        return "<no track selected>"
    }
}
