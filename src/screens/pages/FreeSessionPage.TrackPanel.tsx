import LeagueMenu from "components/LeagueMenu";
import { useDataContext } from "context/useDataContext";
import { AssetFolder } from "data/assets";
import { League, LeagueCalendarEntry } from "data/schemas";
import AssetImage from "elements/AssetImage";
import { AMBIENT_TEMP_TO_ROAD_RATIO, MAX_AMBIENT_TEMP, MAX_ROAD_TEMP, MAX_TIME_SCALE, MAX_WIND_SPEED_KMH, MIN_AMBIENT_TEMP, MIN_ROAD_TEMP, MIN_TIME_SCALE, MIN_WIND_SPEED_KMH, TEMP_STEP, TrackSettings } from "./FreeSessionPage";
import { useAcContext } from "context/useAcContext";
import { useEffect, useState } from "react";
import { getClassString, isStringNullOrEmpty, timeNumberToString, timeStringToNumber, truncateNumber } from "utils";
import TrackThumbnail from "elements/TrackThumbnail";
import BackgroundDiv from "elements/BackgroundDiv";
import TrackThumbnailField from "components/TrackThumbnailField";
import LabeledCheckbox from "elements/LabeledCheckbox";
import HourSlider from "components/HourSlider";
import LabeledControl from "elements/LabeledControl";
import Slider from "elements/Slider";
import DropdownField from "elements/DropdownField";
import DirectionCircleField from "elements/DirectionCircleField";
import Button from "elements/Button";
import { TrackPickerValue } from "components/TrackPicker";
import { useSettingsContext } from "context/useSettings";
import { FILE_PROTOCOL } from "data/files";
import FlagImage from "elements/images/FlagImage";
import Img from "elements/Img";

export interface FreeSession_TrackPanelProps {
    expanded: boolean;
    canBeExpanded: boolean;
    canContinue: boolean;
    league: League | null;
    trackSettings: TrackSettings;
    onChange: (trackSettings: TrackSettings) => void;
    setLaps: (laps: number) => void;
    onExpand: () => void;
    onContinue: () => void;
}

function FreeSession_TrackPanel ({
    expanded,
    canBeExpanded,
    canContinue,
    league,
    trackSettings,
    onChange,
    setLaps,
    onExpand,
    onContinue,
}: FreeSession_TrackPanelProps) {
    const { tracks } = useAcContext();

    // whether road temperature is calculated automatically from ambient temp.
    const [isRoadTempAuto, setRoadTempAuto] = useState(true);

    const track = trackSettings.track;
    const layout = trackSettings.layout;

    useEffect(() => {
        if (isRoadTempAuto) {
            handleFieldChange(
                'roadTemperature',
                truncateNumber(trackSettings.ambientTemperature * AMBIENT_TEMP_TO_ROAD_RATIO, 2)
            );
        }
    }, [trackSettings.ambientTemperature, isRoadTempAuto]);

    if (canBeExpanded === false) {
        return (
            <div className="section collapsed section-not-available">
                Track
            </div>
        )
    }

    if (league === null) throw `League can't be null.`;

    if (expanded === false && trackSettings.track === null) {
        return (
            <div
                className="section collapsed section-not-yet-opened"
                onClick={() => onExpand()}
            >
                Track
            </div>
        )
    }
    if (expanded === false) {
        const eventName = (() => {
            if (trackSettings.event) {
                if (isStringNullOrEmpty(trackSettings.event.officialName)) {
                    return trackSettings.event.name;
                }
                return trackSettings.event.officialName;
            }
            if (trackSettings.track && trackSettings.layout) {
                return `Custom event at '${trackSettings.layout.ui.name}'`;
            }
            return `Custom event`;
        })();

        const startTime = (() => {
            if (trackSettings.randomTime) return "Random"
            else return timeNumberToString(trackSettings.startTime);
        })();

        const temperature = `${trackSettings.ambientTemperature.toFixed(1)}° `
            + `(${trackSettings.roadTemperature.toFixed(1)}°)`;

        const windSpeed = (() => {
            if (trackSettings.windSpeedMin !== trackSettings.windSpeedMax) {
                return `${trackSettings.windSpeedMin}-${trackSettings.windSpeedMax} km/h`;
            }
            else {
                return `${trackSettings.windSpeedMin} km/h`;
            }
        })();

        const windDir = `${trackSettings.windDirection}°`;

        return (
            <div
                className="section collapsed track-section-collapsed"
                onClick={() => onExpand()}
            >
                <div className="section-collapsed-title">
                    TRACK
                </div>
                <div className="thumbnail-section">
                    <TrackThumbnail
                        track={track}
                        layout={layout}
                    />
                </div>
                <div className="info-section">
                    <div className="event-title">
                        {eventName}
                    </div>
                    <div className="layout">
                        <div className="datum">
                            <span className="name">Track and layout: </span>
                            <span className="value">
                                {trackSettings.layout?.ui?.name
                                    ?? trackSettings.track?.displayName}
                            </span>
                        </div>
                    </div>
                    <div className="event-data">
                        <div className="column">
                            <div className="datum">
                                <span className="name">Start time: </span>
                                <span className="value">{startTime}</span>
                            </div>
                            <div className="datum">
                                <span className="name">Weather: </span>
                                <span className="value">Clear</span>
                            </div>
                            <div className="datum">
                                <span className="name">Temperature: </span>
                                <span className="value">{temperature}</span>
                            </div>
                        </div>
                        <div className="column">
                            <div className="datum">
                                <span className="name">Track condition: </span>
                                <span className="value">Set by weather</span>
                            </div>
                            <div className="datum">
                                <span className="name">Wind speed: </span>
                                <span className="value">{windSpeed}</span>
                            </div>
                            <div className="datum">
                                <span className="name">Wind direction: </span>
                                <span className="value">{windDir}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <BackgroundDiv
            className="section expanded track-section-expanded"
            folder={AssetFolder.leagueBackgrounds}
            imageName={league?.background ?? ""}
            opacity={0.15}
        >
            <div className="event-section">
                <h2 className="header">Preset events</h2>
                <div className="event-container">
                    {league.calendar.map(e => <_Event
                        key={e.internalName}
                        entry={e}
                        selected={trackSettings.event?.internalName === e.internalName}
                        onSelect={() => handleSelectEvent(e)}
                    />)}
                </div>
            </div>
            <div className="customize-section">
                <h2 className="header">Race details</h2>
                <div className="section-content">
                    <TrackThumbnailField
                        className="track-thumbnail"
                        track={track}
                        layout={layout}
                        onTrackChange={handleTrackChange}
                    />
                    <div className="time-section">
                        <h3 className="header">Time</h3>
                        <LabeledCheckbox
                            label="Random time"
                            value={trackSettings.randomTime}
                            onChange={v => handleFieldChange('randomTime', v)}
                        />
                        <LabeledControl label="Start time">
                            <HourSlider
                                value={trackSettings.startTime}
                                onValueChange={
                                    v => handleFieldChange('startTime', v)
                                }
                                readonly={trackSettings.randomTime}
                            />
                        </LabeledControl>
                        <LabeledControl label="Time scale">
                            <Slider
                                mode='thumb'
                                className="time-scale-slider"
                                value={trackSettings.timeMultiplier}
                                onChange={
                                    v => handleFieldChange('timeMultiplier', v)
                                }
                                min={MIN_TIME_SCALE}
                                max={MAX_TIME_SCALE}
                                step={1}
                                showNumberBox
                                showFillTrack
                                markCount={10}
                            />
                        </LabeledControl>
                    </div>
                    <div className="conditions-section">
                        <h3 className="title header">Atmospheric conditions</h3>
                        <div className="weather-section">
                            <LabeledControl label="Weather">
                                <DropdownField
                                    items={[{displayName: "Clear", value: "Clear"}]}
                                    selectedItem="Clear"
                                />
                            </LabeledControl>
                            <h4 className="header">Temperatures</h4>
                            <LabeledCheckbox
                                label="Calculate road temperature automatically"
                                value={isRoadTempAuto}
                                onChange={setRoadTempAuto}
                            />
                            <LabeledControl label="Ambient">
                                <Slider
                                    mode='thumb'
                                    className="ambient-temperature-slider"
                                    value={trackSettings.ambientTemperature}
                                    onChange={
                                        v => handleFieldChange('ambientTemperature', v)
                                    }
                                    min={MIN_AMBIENT_TEMP}
                                    max={MAX_AMBIENT_TEMP}
                                    step={TEMP_STEP}
                                    showNumberBox
                                    showFillTrack
                                    markSpacing={5}
                                />
                            </LabeledControl>
                            <LabeledControl label="Road">
                                <Slider
                                    mode='thumb'
                                    className="road-temperature-slider"
                                    value={trackSettings.roadTemperature}
                                    onChange={
                                        v => handleFieldChange('roadTemperature', v)
                                    }
                                    min={MIN_ROAD_TEMP}
                                    max={MAX_ROAD_TEMP}
                                    step={TEMP_STEP}
                                    showNumberBox
                                    showFillTrack
                                    markSpacing={5}
                                    readonly={isRoadTempAuto}
                                />
                            </LabeledControl>
                        </div>
                        <div className="wind-section">
                            <LabeledControl label="Track condition">
                                <DropdownField
                                    items={[{displayName: "Set by weather", value: "auto"}]}
                                    selectedItem="auto"
                                />
                            </LabeledControl>
                            <LabeledControl label="Wind speed">
                                {/*TODO: range slider min-max*/}
                                <Slider
                                    mode='thumb'
                                    className="wind-speed-slider"
                                    value={trackSettings.windSpeedMin}
                                    onChange={
                                        v => onChange({
                                            ...trackSettings,
                                            windSpeedMin: v,
                                            windSpeedMax: v,
                                        })
                                    }
                                    min={MIN_WIND_SPEED_KMH}
                                    max={MAX_WIND_SPEED_KMH}
                                    step={1}
                                    showNumberBox
                                    showFillTrack
                                    markSpacing={5}
                                />
                            </LabeledControl>
                            <LabeledControl
                                className="wind-direction-label"
                                label="Wind direction"
                            >
                                <DirectionCircleField
                                    value={trackSettings.windDirection}
                                    onValueChange={v => handleFieldChange('windDirection', v)}
                                />
                            </LabeledControl>
                        </div>
                    </div>
                </div>
                <div className="section-controls">
                    <Button
                        highlighted
                        disabled={canContinue === false}
                        onClick={() => onContinue()}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </BackgroundDiv>
    );

    function handleSelectEvent (event: LeagueCalendarEntry) {
        const track = tracks.tracksById[event.track];
        const layout = track.layoutsById[event.layout];

        onChange({
            ...trackSettings,
            event: event,
            track: track,
            layout: layout,
            startTime: timeStringToNumber(event.raceStartHour) ?? trackSettings.startTime,
        })
        setLaps(event.laps);
    }

    function handleTrackChange (values: TrackPickerValue) {
        if (values.track === undefined || values.layout === undefined) return;
        const track = tracks.tracksById[values.track];
        const layout = track.layoutsById[values.layout];

        onChange({
            ...trackSettings,
            track,
            layout,
        })
    }

    function handleFieldChange (field: keyof TrackSettings, value: any) {
        onChange({
            ...trackSettings,
            [field]: value,
        });
    }
}

interface _EventProps {
    entry: LeagueCalendarEntry;
    selected: boolean;
    onSelect: () => void;
}

function _Event ({
    entry,
    selected,
    onSelect,
}: _EventProps) {
    const { getThemeAwareClass } = useSettingsContext();
    const { tracks } = useAcContext();
    
    const track = tracks.tracksById[entry.track];
    const layout = track.layoutsById[entry.layout];

    const outlineClass = getClassString(
        "outline-section",
        getThemeAwareClass('white'),
    )

    return (
        <div
            className={getClassString("event-entry", selected && "selected")}
            onClick={() => onSelect()}
        >
            <div className={outlineClass}>
                <Img src={FILE_PROTOCOL + layout.outlinePath} />
            </div>
            <div className="info-section">
                <div className="event-title">
                    <div className="event-flag">
                        <FlagImage country={entry.country} />
                    </div>
                    <div className="event-name">
                        {entry.name}
                    </div>
                </div>
                <div className="track-name">
                    {layout.ui.name}
                </div>
            </div>
        </div>
    );
}

export default FreeSession_TrackPanel;
