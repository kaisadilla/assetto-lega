import { useDataContext } from 'context/useDataContext';
import { AcTrack, AcTrackLayout, League, LeagueCalendarEntry, LeagueTeam, LeagueTeamDriver, getLeagueDrivers } from 'data/schemas';
import React, { useEffect, useState } from 'react';
import LeagueMenu from 'components/LeagueMenu';
import { FILE_PROTOCOL } from 'data/files';
import { AssetFolder } from 'data/assets';
import BackgroundDiv from 'elements/BackgroundDiv';
import AssetImage from 'elements/AssetImage';
import FlagImage from 'elements/images/FlagImage';
import { chooseW3CTextColor, getClassString, isStringNullOrEmpty, timeNumberToString, timeStringToNumber, truncateNumber } from 'utils';
import { useAcContext } from 'context/useAcContext';
import TrackThumbnailField from 'components/TrackThumbnailField';
import { TrackPickerValue } from 'components/TrackPicker';
import Slider from 'elements/Slider';
import LabeledControl from 'elements/LabeledControl';
import HourSlider from 'components/HourSlider';
import DropdownField from 'elements/DropdownField';
import LabeledCheckbox from 'elements/LabeledCheckbox';
import DirectionCircleField from 'elements/DirectionCircleField';
import { UserProfile, useSettingsContext } from 'context/useSettings';
import TrackThumbnail from 'elements/TrackThumbnail';
import Button from 'elements/Button';
import TeamGallery from 'components/TeamGallery';
import DefaultHighlighter from 'elements/Highlighter';
import SelectableItem from 'elements/SelectableItem';
import { CarAid, JumpStartPenalty, QualifyingMode, Race, StartingGridMode, createRaceIni } from 'logic/game/game';
import CountryField from 'components/CountryField';
import Textbox from 'elements/Textbox';
import CarSkinThumbnailField from 'components/CarSkinThumbnailField';
import CarThumbnail from 'elements/CarThumbnail';
import FreeSession_RaceInfoPanel from './FreeSessionPage.RaceInfoPanel';

const MIN_TIME_SCALE = 0;
const MAX_TIME_SCALE = 100;
const MIN_AMBIENT_TEMP = 0;
const MAX_AMBIENT_TEMP = 50;
const AMBIENT_TEMP_TO_ROAD_RATIO = 1.4;
const MIN_ROAD_TEMP = MIN_AMBIENT_TEMP * AMBIENT_TEMP_TO_ROAD_RATIO;
const MAX_ROAD_TEMP = MAX_AMBIENT_TEMP * AMBIENT_TEMP_TO_ROAD_RATIO;
const TEMP_STEP = 0.1;
const MIN_WIND_SPEED_KMH = 0;
const MAX_WIND_SPEED_KMH = 60;

enum Section {
    League,
    Track,
    Driver,
    RaceInfo,
}

enum TrackCondition {
    Auto,
    Dusty, // 86%
    Old, // 89%
    Green, // 95%
    Slow, // 96%
    Fast, // 98%
    Optimal, // 100%
}

export interface TrackSettings {
    track: AcTrack | null;
    layout: AcTrackLayout | null;
    startTime: number;
    timeMultiplier: number;
    randomTime: boolean;
    trackCondition: TrackCondition;
    ambientTemperature: number;
    roadTemperature: number;
    windSpeedMin: number; // in km/h
    windSpeedMax: number; // in km/h
    windDirection: number; // in degrees (0-360).
}

export interface DriverSettings {
    selectedTeam: LeagueTeam | null;
    selectedDriver: LeagueTeamDriver | null;
    selectedSkin: string | null;
    useDriverIdentity: boolean;
    customDriverCountry: string;
    customDriverName: string;
    customDriverNumber: string;
    customDriverInitials: string;
}

export interface RaceSettings {
    driverEntries: string[] | null;

    hasPractice: boolean;
    practiceLength: number;

    hasQualifying: boolean;
    simulatedQualifyingMode?: StartingGridMode;
    qualifyingMode: QualifyingMode;
    customStartingPositionForPlayer: number | null;
    gridOrder: string[] | null;

    penaltiesEnabled: boolean;
    jumpStartPenalty: JumpStartPenalty;
    tyreBlankets: boolean;

    opponentStrength: number;
    opponentAggression: number;

    automaticShifting: boolean;
    automaticClutch: boolean;
    autoblip: boolean;
    idealLine: boolean;
    tractionControl: CarAid;
    abs: CarAid;
    stabilityControl: number;
    fuelConsumption: number;
    mechanicalDamage: number;
    tyreWear: number;
    slipstreamEffect: number;
}

export interface FreeSessionPageProps {

}

function FreeSessionPage (props: FreeSessionPageProps) {
    const { profile } = useSettingsContext();

    const [section, setSection] = useState(Section.League);

    const [league, setLeague] = useState<League | null>(null);
    const [trackSettings, setTrackSettings] = useState(loadTrackSettings());
    const [driverSettings, setDriverSettings] = useState(loadDriverSettings(profile));
    const [raceSettings, setRaceSettings] = useState(loadRaceSettings());

    const canOpenTrackSection = league !== null;
    const canOpenDriverSection = canOpenTrackSection && trackSettings.track !== null;
    const canOpenRaceSection = canOpenDriverSection && driverSettings.selectedTeam !== null
        && driverSettings.selectedDriver  !== null && driverSettings.selectedSkin !== null;

    return (
        <div className="free-session-page">
            <_LeagueSection
                expanded={section === Section.League}
                selectedLeague={league}
                onSelectLeague={handleSelectLeague}
                onExpand={() => handleExpandSection(Section.League)}
            />
            <_TrackSection
                expanded={section === Section.Track}
                canBeExpanded={canOpenTrackSection}
                canContinue={canOpenDriverSection}
                league={league}
                trackSettings={trackSettings}
                onChange={setTrackSettings}
                onExpand={() => handleExpandSection(Section.Track)}
                onContinue={() => handleExpandSection(Section.Driver)}
            />
            <_DriverSection
                expanded={section === Section.Driver}
                canBeExpanded={canOpenDriverSection}
                canContinue={canOpenRaceSection}
                league={league}
                trackSettings={trackSettings}
                driverSettings={driverSettings}
                onChange={setDriverSettings}
                onExpand={() => handleExpandSection(Section.Driver)}
                onContinue={() => handleExpandSection(Section.RaceInfo)}
            />
            <FreeSession_RaceInfoPanel
                expanded={section === Section.RaceInfo}
                canBeExpanded={canOpenRaceSection}
                league={league}
                trackSettings={trackSettings}
                driverSettings={driverSettings}
                raceSettings={raceSettings}
                onChange={setRaceSettings}
                onExpand={() => handleExpandSection(Section.RaceInfo)}
                onContinue={() => handleExpandSection(Section.RaceInfo)}
            />
        </div>
    );

    function handleExpandSection (section: Section) {
        setSection(section);
    }

    function handleSelectLeague (selectedLeague: League) {
        // don't do anything if the user selects what's already selected.
        if (selectedLeague.internalName === league?.internalName) {
            setSection(Section.Track);
            return;
        }

        setLeague(selectedLeague);
        setSection(Section.Track);
        // track settings are valid across all leagues, but driver settings
        // are not.
        setDriverSettings(loadDriverSettings(profile));
        setRaceSettings(prevState => ({
            ...prevState,
            driverEntries: null,
        }));
    }
}

interface _LeagueSectionProps {
    expanded: boolean;
    selectedLeague: League | null;
    onSelectLeague: (league: League) => void;
    onExpand: () => void;
}

function _LeagueSection ({
    expanded,
    selectedLeague,
    onSelectLeague,
    onExpand,
}: _LeagueSectionProps) {
    const { leagues, leaguesById } = useDataContext();

    if (expanded === false) {
        const leagueName = selectedLeague
            ? `${selectedLeague.series} > ${selectedLeague?.displayName ?? selectedLeague.year}`
            : "No league selected";

        return (
            <div
                className="section collapsed league-section-collapsed"
                onClick={() => onExpand()}
            >
                {selectedLeague && <AssetImage
                    className="league-icon"
                    folder={AssetFolder.leagueLogos}
                    imageName={selectedLeague.logo}
                />}
                <div className="league-name">{leagueName}</div>
            </div>
        )
    }

    return (
        <div className="section expanded league-section-expanded">
            <LeagueMenu
                leagues={leagues}
                onSelect={l => onSelectLeague(leaguesById[l])}
                selectedLeague={selectedLeague?.internalName}
            />
        </div>
    );
}

interface _TrackSectionProps {
    expanded: boolean;
    canBeExpanded: boolean;
    canContinue: boolean;
    league: League | null;
    trackSettings: TrackSettings;
    onChange: (trackSettings: TrackSettings) => void;
    onExpand: () => void;
    onContinue: () => void;
}

function _TrackSection ({
    expanded,
    canBeExpanded,
    canContinue,
    league,
    trackSettings,
    onChange,
    onExpand,
    onContinue,
}: _TrackSectionProps) {
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
        const selectedEvent = getCurrentlySelectedEvent();
        const eventName = (() => {
            if (selectedEvent) {
                if (isStringNullOrEmpty(selectedEvent.officialName)) {
                    return selectedEvent.name;
                }
                return selectedEvent.officialName;
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
                    {league.calendar.map(e => <_TrackSectionEvent
                        key={e.internalName}
                        entry={e}
                        selected={getCurrentlySelectedEvent()?.internalName === e.internalName}
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
            track: track,
            layout: layout,
            startTime: timeStringToNumber(event.raceStartHour) ?? trackSettings.startTime,
        })
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

    function getCurrentlySelectedEvent () {
        return league?.calendar.find(
            e => e.track === trackSettings.track?.folderName
        ) ?? null;
    }
}

interface _TrackSectionEventProps {
    entry: LeagueCalendarEntry;
    selected: boolean;
    onSelect: () => void;
}

function _TrackSectionEvent ({
    entry,
    selected,
    onSelect,
}: _TrackSectionEventProps) {
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
                <img src={FILE_PROTOCOL + layout.outlinePath} />
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

interface _DriverSectionProps {
    expanded: boolean;
    canBeExpanded: boolean;
    canContinue: boolean;
    league: League | null;
    trackSettings: TrackSettings;
    driverSettings: DriverSettings;
    onChange: (driverSettings: DriverSettings) => void;
    onExpand: () => void;
    onContinue: () => void;
}

function _DriverSection ({
    expanded,
    canBeExpanded,
    canContinue,
    league,
    trackSettings,
    driverSettings,
    onChange,
    onExpand,
    onContinue,
}: _DriverSectionProps) {

    if (canBeExpanded === false) {
        return (
            <div className="section collapsed section-not-available">
                Driver
            </div>
        )
    }

    if (expanded === false) {
        if (driverSettings.selectedTeam === null || driverSettings.selectedDriver === null) {
            return (
                <div
                    className="section collapsed section-not-yet-opened"
                    onClick={() => onExpand()}
                >
                    Driver
                </div>
            )
        }
        else {
            const { cars } = useAcContext();

            const team = driverSettings.selectedTeam;
            const driver = driverSettings.selectedDriver;

            const teamCar = cars.carsById[team.cars[league!.specs[0]]];

            const textColor = chooseW3CTextColor(team.color);

            const driverInfoClass = getClassString(
                "driver-info",
                textColor === 'black' && "text-black",
                textColor === 'white' && "text-white",
            );

            const playerIdentity = getPlayerIdentity(driverSettings);

            return (
                <div
                    className="section collapsed driver-section-collapsed"
                    onClick={() => onExpand()}
                >
                    <div className="section-collapsed-title">
                        DRIVER
                    </div>
                    <div className="team-logo" style={{borderColor: team.color}}>
                        <AssetImage folder={AssetFolder.teamLogos} imageName={team.logo} />
                    </div>
                    <div className={driverInfoClass}>
                        <div className="driver-entry" style={{backgroundColor: team.color}}>
                            <div className="driver-number">
                                <div>{playerIdentity.number}</div>
                            </div>
                            <div className="driver-flag-container">
                                <FlagImage country={playerIdentity.country} />
                            </div>
                            <span className="driver-initials">{playerIdentity.initials}</span>
                            <span className="driver-name">{playerIdentity.name}</span>
                        </div>
                        <div className="car-info" style={{backgroundColor: team.color}}>
                            <div className="team-name">
                                {team.name}
                            </div>
                            <div className="car-name">
                                {teamCar.displayName}
                            </div>
                            <div className="team-bop">
                                <div className="team-datum ballast">
                                    <span className="name">ballast </span>
                                    <span className="value">{team.ballast}</span>
                                </div>
                                <div className="team-datum restrictor">
                                    <span className="name">restrictor </span>
                                    <span className="value">{team.restrictor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CarThumbnail
                        className="driver-skin"
                        car={teamCar}
                        carSkin={driverSettings.selectedSkin!}
                        style={{borderColor: team.color}}
                    />
                </div>
            )
        }
    }

    return (
        <BackgroundDiv
            className="section expanded driver-section-expanded"
            folder={AssetFolder.leagueBackgrounds}
            imageName={league?.background ?? ""}
            opacity={0.15}
        >
            <div className="team-section">
                <h2 className="header">Teams</h2>
                <div className="team-container">
                    {league?.teams.map(t => <_DriverSectionTeam
                        key={t.internalName}
                        team={t}
                        spec={league.specs[0]}
                        selectedTeam={driverSettings.selectedTeam}
                        onSelect={() => handleTeamSelection(t)}
                    />)}
                </div>
            </div>
            <div className="driver-section">
                <h2 className="header">Drivers</h2>
                <div className="driver-container">
                    {driverSettings.selectedTeam?.drivers.map(d => <_DriverSectionDriver
                        key={d.internalName}
                        team={driverSettings.selectedTeam!}
                        driver={d}
                        spec={league!.specs[0]}
                        selectedDriver={driverSettings.selectedDriver}
                        onSelect={() => handleDriverSelection(d)}
                    />)}
                </div>
            </div>
            <div className="driver-settings-section">
                <h2 className="header">Driver settings</h2>
                {driverSettings.selectedTeam && driverSettings.selectedDriver && <_DriverSelectionCustomization
                    trackSettings={trackSettings}
                    driverSettings={driverSettings}
                    spec={league!.specs[0]}
                    canContinue={canContinue}
                    onChange={onChange}
                    onContinue={onContinue}
                />}
            </div>
        </BackgroundDiv>
    );

    // todo: remove
    function __HANDLE_RACE () {
        const race = new Race();

        race.setTrack(trackSettings.track!);
        race.setLayout(trackSettings.layout!);
        race.setSpec(league!.specs[0]);
        race.setTeams(league!.teams);
        race.setDrivers(getLeagueDrivers(league!.teams).filter(d => !d.isReserveDriver));
        race.setPlayerDriver(driverSettings.selectedDriver!.internalName);
        race.setCustomPlayerIdentity(null);
        race.setGridMode('realistic');
        race.generateRaceSettings();

        createRaceIni(race);
    }

    function handleFieldChange (field: keyof DriverSettings, value: any) {
        onChange({
            ...driverSettings,
            [field]: value,
        });
    }

    function handleTeamSelection (team: LeagueTeam) {
        if (team.internalName === driverSettings.selectedTeam?.internalName) {
            return;
        }
        onChange({
            ...driverSettings,
            selectedTeam: team,
            selectedDriver: null,
        });
    }

    function handleDriverSelection (driver: LeagueTeamDriver) {
        if (driver.internalName === driverSettings.selectedDriver?.internalName) {
            return;
        }
        onChange({
            ...driverSettings,
            selectedDriver: driver,
            selectedSkin: driver.defaultSkins[league!.specs[0]],
        });
    }
}

interface _DriverSectionTeamProps {
    team: LeagueTeam;
    spec: string;
    selectedTeam: LeagueTeam | null;
    onSelect: () => void;
}

function _DriverSectionTeam ({
    team,
    spec,
    selectedTeam,
    onSelect,
}: _DriverSectionTeamProps) {
    const { cars } = useAcContext();

    const teamCar = cars.carsById[team.cars[spec]];

    // TODO: Manage this situation
    if (teamCar === undefined) {
        throw `Car not found.`;
    }

    const textColor = chooseW3CTextColor(team.color);

    const entryClass = getClassString(
        "team-entry",
        textColor === 'black' && "text-black",
        textColor === 'white' && "text-white",
    );

    const style = {
        backgroundColor: team.color,
        borderColor: team.color,
    }

    return (
        <SelectableItem
            className="team-entry-container"
            selectionMode='opacity'
            value={team.internalName}
            selectedValue={selectedTeam?.internalName}
            onClick={() => onSelect()}
        >

        <div className={entryClass} style={style}>
            <div className="team-color" />
            <div className="team-logo">
                <AssetImage folder={AssetFolder.teamLogos} imageName={team.logo} />
            </div>
            <div className="team-data">
                <div className="team-identity">
                    <FlagImage className="flag" country={team.country} />
                    <div className="team-names">
                        <div className="team-name">
                            {team.shortName ?? team.name}
                        </div>
                        <div className="constructor-name">
                            {team.constructorName ?? ""}
                        </div>
                    </div>
                </div>
                <div className="car-data">
                    <div className="team-car">
                        <img className="team-badge" src={FILE_PROTOCOL + teamCar.badgePath} />
                        <div>{teamCar.ui.name ?? teamCar.folderName}</div>
                    </div>
                    <div className="team-bop">
                        <div className="team-datum ballast">
                            <span className="name">ballast </span>
                            <span className="value">{team.ballast}</span>
                        </div>
                        <div className="team-datum restrictor">
                            <span className="name">restrictor </span>
                            <span className="value">{team.restrictor}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </SelectableItem>
    );
}

interface _DriverSectionDriverProps {
    team: LeagueTeam;
    driver: LeagueTeamDriver;
    spec: string;
    selectedDriver: LeagueTeamDriver | null;
    onSelect: () => void;
}

function _DriverSectionDriver ({
    team,
    driver,
    spec,
    selectedDriver,
    onSelect,
}: _DriverSectionDriverProps) {

    const textColor = chooseW3CTextColor(team.color);

    const entryClass = getClassString(
        "driver-entry",
        textColor === 'black' && "text-black",
        textColor === 'white' && "text-white",
    );

    const style = {
        backgroundColor: team.color,
        borderColor: team.color,
    }

    return (
        <SelectableItem
            className="driver-entry-container"
            selectionMode='opacity'
            value={driver.internalName}
            selectedValue={selectedDriver?.internalName}
            onClick={() => onSelect()}
        >

        <div className={entryClass} style={style}>
            <div className="driver-number">
                <div>{driver.number}</div>
            </div>
            <div className="driver-flag-container">
                <FlagImage country={driver.country} />
            </div>
            <span className="driver-initials">{driver.initials}</span>
            <span className="driver-name">{driver.name}</span>
        </div>

        </SelectableItem>
    );
}

interface _DriverSelectionCustomizationProps {
    trackSettings: TrackSettings;
    driverSettings: DriverSettings;
    spec: string;
    canContinue: boolean;
    onChange: (driverSettings: DriverSettings) => void;
    onContinue: () => void;
}

function _DriverSelectionCustomization ({
    trackSettings,
    driverSettings,
    spec,
    canContinue,
    onChange,
    onContinue,
}: _DriverSelectionCustomizationProps) {
    const countryValue = driverSettings.useDriverIdentity
        ? driverSettings.selectedDriver!.country
        : driverSettings.customDriverCountry;

    const nameValue = driverSettings.useDriverIdentity
        ? driverSettings.selectedDriver!.name
        : driverSettings.customDriverName;

    const numberValue = driverSettings.useDriverIdentity
        ? driverSettings.selectedDriver!.number
        : driverSettings.customDriverNumber;

    const initialsValue = driverSettings.useDriverIdentity
        ? driverSettings.selectedDriver!.initials
        : driverSettings.customDriverInitials;

    return (
        <div className="driver-settings-container">
            <div className="driver-settings-form">
                <LabeledCheckbox
                    label="Use driver's name"
                    value={driverSettings.useDriverIdentity}
                    onChange={v => handleFieldChange('useDriverIdentity', v)}
                />
                <LabeledControl label="Country">
                    <CountryField
                        value={countryValue}
                        readonly={driverSettings.useDriverIdentity}
                        onChange={ctry => handleFieldChange('customDriverCountry', ctry)}
                    />
                </LabeledControl>
                <LabeledControl label="Name">
                    <Textbox
                        value={nameValue}
                        readonly={driverSettings.useDriverIdentity}
                        onChange={str => handleFieldChange('customDriverName', str)}
                    />
                </LabeledControl>
                <LabeledControl label="Number">
                    <Textbox
                        value={numberValue}
                        readonly={driverSettings.useDriverIdentity}
                        onChange={str => handleFieldChange('customDriverNumber', str)}
                    />
                </LabeledControl>
                <LabeledControl label="Initials">
                    <Textbox
                        value={initialsValue}
                        readonly={driverSettings.useDriverIdentity}
                        onChange={str => handleFieldChange('customDriverInitials', str)}
                    />
                </LabeledControl>
                <h3 className="header">Skin</h3>
                <CarSkinThumbnailField
                    className="selected-skin"
                    car={driverSettings.selectedTeam!.cars[spec]}
                    selectedSkin={driverSettings.selectedSkin}
                    availableSkins={driverSettings.selectedDriver!.skins[spec]}
                    onSkinChange={s => handleFieldChange('selectedSkin', s)}
                />
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
    );

    function handleFieldChange (field: keyof DriverSettings, value: any) {
        onChange({
            ...driverSettings,
            [field]: value,
        });
    }
}

/**
 * Loads track settings to use.
 */
function loadTrackSettings () : TrackSettings {
    return {
        track: null,
        layout: null,
        startTime: 0.5,
        timeMultiplier: 1.0,
        randomTime: false,
        trackCondition: TrackCondition.Auto,
        ambientTemperature: 26.0,
        roadTemperature: 36.7,
        windSpeedMin: 0,
        windSpeedMax: 0,
        windDirection: 0,
    }
}

function loadDriverSettings (profile: UserProfile) : DriverSettings {
    return {
        selectedTeam: null,
        selectedDriver: null,
        selectedSkin: null,
        useDriverIdentity: true,
        customDriverCountry: profile.country,
        customDriverName: profile.name,
        customDriverNumber: profile.number,
        customDriverInitials: profile.initials,
    }
}

function loadRaceSettings () : RaceSettings {
    return {
        driverEntries: null,
    
        hasPractice: false,
        practiceLength: 30,
    
        hasQualifying: false,
        simulatedQualifyingMode: 'realistic',
        qualifyingMode: QualifyingMode.timeAttack,
        customStartingPositionForPlayer: null,
        gridOrder: null,
    
        penaltiesEnabled: true,
        jumpStartPenalty: JumpStartPenalty.DriveThrough,
        tyreBlankets: true,
    
        opponentStrength: 100,
        opponentAggression: 100,
    
        automaticShifting: true,
        automaticClutch: true,
        autoblip: true,
        idealLine: true,
        tractionControl: CarAid.On,
        abs: CarAid.On,
        stabilityControl: 100,
        fuelConsumption: 1,
        mechanicalDamage: 1,
        tyreWear: 1,
        slipstreamEffect: 1,
    }
}

function getPlayerIdentity (driverSettings: DriverSettings) {
    if (driverSettings.selectedDriver === null) {
        throw `No driver selected.`;
    }

    if (driverSettings.useDriverIdentity) return {
        name: driverSettings.selectedDriver.name,
        number: driverSettings.selectedDriver.number,
        country: driverSettings.selectedDriver.country,
        initials: driverSettings.selectedDriver.initials,
    }
    else return {
        name: driverSettings.customDriverName,
        number: driverSettings.customDriverNumber,
        country: driverSettings.customDriverCountry,
        initials: driverSettings.customDriverInitials,
    }
}

export default FreeSessionPage;