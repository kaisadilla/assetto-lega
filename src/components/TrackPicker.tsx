import React, { useEffect, useState } from 'react';
import PickerDialog from './PickerDialog';
import ToolboxRow from 'elements/ToolboxRow';
import ScaleScroll from 'elements/ScaleScroll';
import Button from 'elements/Button';
import MaterialSymbol from 'elements/MaterialSymbol';
import Ipc from 'main/ipc/ipcRenderer';
import { AcTrack, AcTrackCollection, AcTrackLayout, AcTrackLayoutUi } from 'data/schemas';
import NavBar from 'elements/NavBar';
import Textbox from 'elements/Textbox';
import { LOCALE, getClassString, getCountriesWithTracks } from 'utils';
import { Countries, getCountryByAssettoName, getCountryIdByAssettoName, groupCountriesByCategory, groupObjectsByCountryCategory } from 'data/countries';
import { CountryFilterElement } from './PickerDialog.Filter';
import { PickerElement, PickerElementSection } from './PickerDialog.ThumbnailGallery';
import TrackThumbnail from 'elements/TrackThumbnail';
import { FILE_PROTOCOL } from 'data/files';
import TagList from 'elements/TagList';
import { useAcContext } from 'context/useAcContext';
import { useSettingsContext } from 'context/useSettings';
import Img from 'elements/Img';

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
    const { tracks } = useAcContext();

    const [trackCounts, setTrackCounts] = useState<{[name: string]: number} | null>(null);
    const [selectedTrack, setSelectedTrack] = useState(preSelectedTrack.track ?? null);
    const [selectedLayout, setSelectedLayout] = useState(preSelectedTrack.layout ?? null);
    const [scale, setScale] = useState(DEFAULT_THUMBNAIL_SIZE);

    const [carSearchValue, setCarSearchValue] = useState("");
    const [filterType, setFilterType] = useState(FilterType.Country);

    const [viewType, setViewType] = useState(ViewType.Gallery);

    useEffect(() => {
        const _counts = getCountriesWithTracks(tracks.trackList);
        const sortedCounts = {} as {[name: string]: number};
        const sortedCountryCats = groupCountriesByCategory(Object.keys(_counts));

        for (const cat of Object.values(sortedCountryCats)) {
            for (const country of cat) {
                sortedCounts[country] = _counts[country];
            }
        }

        setTrackCounts(sortedCounts);
    }, [tracks]);

    const $selector = (() => {
        if (tracks === null || trackCounts == null) {
            return (
                <div className="selector-container">
                    Loading...
                </div>
            )
        }
        if (filterType === FilterType.Country) {
            return <SelectorByCountry
                trackData={tracks}
                trackCounts={trackCounts}
                selectedTrack={selectedTrack}
                selectedLayout={selectedLayout}
                thumbnailScale={scale}
                onSelect={handleTrackAndLayoutSelect}
                onSubmit={handleTrackAndLayoutSubmit}
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
                    placeholder="Search track..."
                    value={carSearchValue}
                    onChange={str => setCarSearchValue(str)}
                />
            </div>
            {$selector}
            <PickerDialog.Toolbox className="track-picker-toolbox">
                <ToolboxRow.Status text={
                    trackPickerValueToString(selectedTrack, selectedLayout)}
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

    function handleTrackAndLayoutSelect (value: TrackPickerValue) {
        setSelectedTrack(value.track ?? null);
        setSelectedLayout(value.layout ?? null);
    }

    function handleTrackAndLayoutSubmit (value: TrackPickerValue) {
        if (value.track) {
            onSelect({
                track: value.track,
                layout: value.layout ?? "",
            })
        }
    }

    async function handleSelect () {
        if (selectedTrack) {
            onSelect(createCallbackObject());
        }
    }

    async function handleCancel () {
        onCancel?.(createCallbackObject());
    }

    function createCallbackObject () {
        return {
            track: selectedTrack ?? undefined,
            layout: selectedLayout ?? "",
        };
    }
}

interface SelectorByCountryProps {
    trackData: AcTrackCollection;
    trackCounts: {[name: string]: number};
    thumbnailScale: number;
    selectedTrack: string | null;
    selectedLayout: string | null;
    onSelect: (track: TrackPickerValue) => void;
    onSubmit: (track: TrackPickerValue) => void;
}

function SelectorByCountry ({
    trackData,
    trackCounts,
    thumbnailScale,
    selectedTrack,
    selectedLayout,
    onSelect,
    onSubmit,
}: SelectorByCountryProps) {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [trackEntries, setTrackEntries] = useState<PickerElementSection[]>([]);

    useEffect(() => {
        const sections = [] as PickerElementSection[];

        for (const c of Object.keys(trackCounts)) {
            const ctry = Countries[c];
            sections.push({
                title: ctry.displayName,
                id: c,
                elements: buildTrackPickerItems(
                    trackData.trackList.filter(
                        t => getCountryIdByAssettoName(t.displayCountry) === c
                    ),
                    thumbnailScale,
                ),
            })
        }

        setTrackEntries(sections);
    }, [trackData.trackList]);

    return (
        <div className="selector-container">
            <div className="filters-container">
                <PickerDialog.Filter
                    title="Countries"
                    selectorListStyle='country'
                    countryItems={buildCountryFilterItems()}
                    selectedValue={selectedCountry}
                    onSelect={handleFilterSelect}
                />
            </div>
            <div className="track-selector-container">
                <div className="track-list-container">
                    <PickerDialog.ThumbnailGallery
                        className="track-gallery"
                        sections={trackEntries}
                        width={thumbnailScale}
                        selectedElement={selectedTrack ?? ""}
                        onSelect={handleSelectTrack}
                        focusedSection={selectedCountry}
                    />
                </div>
                <SelectedTrackShowcase
                    trackData={trackData}
                    selectedTrack={selectedTrack}
                    selectedLayout={selectedLayout}
                    onSelect={handleSelectLayout}
                    onSubmit={handleSubmitLayout}
                />
            </div>
        </div>
    );

    function buildCountryFilterItems () : CountryFilterElement[] {
        return Object.keys(trackCounts).map(c => {
            const country = Countries[c];
            const amount = trackCounts[c];

            return {
                name: `${country.displayName} (${amount})`,
                value: c,
            }
        });
    }

    async function handleFilterSelect (value: string) {
        setSelectedCountry(value);
    }

    async function handleSelectTrack (value: string) {
        if (value === selectedTrack) return;

        const track = trackData.tracksById[value];
        onSelect({
            track: value,
            layout: track.layouts[0].folderName,
        });
    }

    async function handleSelectLayout (value: string) {
        if (value === selectedLayout) return;

        onSelect({
            track: selectedTrack ?? undefined,
            layout: value,
        })
    }

    async function handleSubmitLayout (value: string) {
        onSubmit({
            track: selectedTrack ?? undefined,
            layout: value,
        })
    }
}

interface SelectedTrackShowcaseProps {
    trackData: AcTrackCollection;
    selectedTrack: string | null;
    selectedLayout: string | null;
    onSelect: (layout: string) => void;
    onSubmit: (layout: string) => void;
}

function SelectedTrackShowcase ({
    trackData,
    selectedTrack,
    selectedLayout,
    onSelect,
    onSubmit,
}: SelectedTrackShowcaseProps) {
    if (selectedTrack === null) {
        return (
            <div className="selected-track-showcase">
                &lt;no track selected&gt;
            </div>
        )
    }
    
    const track = trackData.tracksById[selectedTrack];
    selectedLayout ??= "";

    const layout = track.layoutsById[selectedLayout];

    return (
        <div className="selected-track-showcase">
            <div className="image-section">
                <div className="image-container">
                    <Img
                        className="preview-img"
                        src={FILE_PROTOCOL + layout.previewPath}
                    />
                    <Img
                        className="outline-img"
                        src={FILE_PROTOCOL +layout.outlinePath}
                    />
                </div>
                <div className="basic-info-container">
                    <TagList tags={layout.ui.tags ?? []} />
                    <div className="description-container">
                        {layout.ui.description ?? ""}
                    </div>
                </div>
            </div>
            <TrackInfo layout={layout} />
            <div className="layout-menu-section">
                {trackData.tracksById[selectedTrack].layouts.map((l, i) => (
                    <LayoutEntry
                        key={i}
                        layout={l}
                        selected={l.folderName === selectedLayout}
                        onSelect={() => onSelect(l.folderName)}
                        onSubmit={() => onSubmit(l.folderName)}
                    />
                ))}
            </div>
        </div>
    );
}

interface TrackInfoProps {
    layout: AcTrackLayout;
}

function TrackInfo ({
    layout,
}: TrackInfoProps) {
    const ctry = getCountryByAssettoName(layout.ui.country);

    return (
        <div className="layout-data-section">
            <div className="datum">
                <span className="name">Full name:</span>
                <span className="value">{layout.ui.name ?? "<no name>"}</span>
            </div>
            <div className="datum">
                <span className="name">Country:</span>
                <div className="value country">
                    <Img src={ctry.flag} />
                    <span>{ctry.displayName}</span>
                </div>
            </div>
            <div className="datum">
                <span className="name">City:</span>
                <span className="value">{layout.ui.city ?? "<unknown>"}</span>
            </div>
            <div className="datum">
                <span className="name">Length:</span>
                <span className="value">
                    {layout.length
                        ? `${layout.length.toLocaleString(LOCALE)} m`
                        : "<unknown>"}
                </span>
            </div>
            <div className="datum">
                <span className="name">Width:</span>
                <span className="value">{getWidthString(layout.width)}</span>
            </div>
            <div className="datum">
                <span className="name">Pitboxes:</span>
                <span className="value">{layout.ui.pitboxes ?? "<unknown>"}</span>
            </div>
            <div className="datum">
                <span className="name">Direction:</span>
                <span className="value">{layout.ui.run ?? "<unknown>"}</span>
            </div>
            <div className="datum">
                <span className="name">Author:</span>
                <span className="value">{layout.ui.author ?? "<unknown>"}</span>
            </div>
            <div className="datum">
                <span className="name">Version:</span>
                <span className="value">{layout.ui.version ?? "<unknown>"}</span>
            </div>
            {layout.ui.geotags && layout.ui.geotags.length === 2 && (<>
                <div className="datum">
                    <span className="name">Lat:</span>
                    <span className="value">{layout.ui.geotags[0]}</span>
                </div>
                <div className="datum">
                    <span className="name">Lat:</span>
                    <span className="value">{layout.ui.geotags[1]}</span>
                </div>
            </>)}
        </div>
    );
}

interface LayoutEntryProps {
    layout: AcTrackLayout;
    selected: boolean;
    onSelect: () => void;
    onSubmit: () => void;
}

function LayoutEntry ({
    layout,
    selected,
    onSelect,
    onSubmit,
}: LayoutEntryProps) {
    const { getThemeAwareClass } = useSettingsContext();

    const classStr = getClassString(
        "layout-entry",
        selected && "selected",
    )

    const layoutClass = getClassString(
        "layout-outline",
        getThemeAwareClass('white'),
    )

    return (
        <div className={classStr}
            onClick={handleSelect}
            onDoubleClick={() => onSubmit()}
        >
            <div className={layoutClass}>
                <Img src={FILE_PROTOCOL + layout.outlinePath} />
            </div>
            <div className="layout-name">
                {layout.layoutName}
            </div>
        </div>
    );

    function handleSelect () {
        onSelect();
    }
}


function trackPickerValueToString (track?: string | null, layout?: string | null) {
    if (track) {
        if (layout) {
            return `${track} > ${layout}`;
        }
        else {
            return track;
        }
    }
    else {
        return "<no track selected>"
    }
}

function buildTrackPickerItems (trackList: AcTrack[], width: number) {
    return trackList.map(t => {
        const ctry = getCountryIdByAssettoName(t.displayCountry);

        return {
            value: t.folderName,
            thumbnail: (
                <TrackThumbnail
                    track={t}
                    layout={t.layouts[0]}
                />
            )
        } as PickerElement;
    })
}

function getWidthString (width: {min: number, max: number} | null) {
    if (width === null) {
        return "<unknown>";
    }
    else if (width.min === width.max) {
        return `${width.min} m`;
    }
    else {
        return `${width.min} - ${width.max} m`;
    }
}

export default TrackPicker;
