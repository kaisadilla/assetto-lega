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
import { createRaceIni } from 'logic/game/iniFiles';
import CountryField from 'components/CountryField';
import Textbox from 'elements/Textbox';
import CarSkinThumbnailField from 'components/CarSkinThumbnailField';
import CarThumbnail from 'elements/CarThumbnail';
import FreeSession_RaceInfoPanel from './FreeSessionPage.RaceInfoPanel';
import Img from 'elements/Img';
import FreeSession_TrackPanel from './FreeSessionPage.TrackPanel';
import FreeSession_DriverPanel from './FreeSessionPage.DriverPanel';
import { CarAid, JumpStartPenalty, QualifyingMode, Race, StartingGridMode } from 'logic/Race';
import Ipc from 'main/ipc/ipcRenderer';

export const MIN_TIME_SCALE = 0;
export const MAX_TIME_SCALE = 100;
export const MIN_AMBIENT_TEMP = 0;
export const MAX_AMBIENT_TEMP = 50;
export const AMBIENT_TEMP_TO_ROAD_RATIO = 1.4;
export const MIN_ROAD_TEMP = MIN_AMBIENT_TEMP * AMBIENT_TEMP_TO_ROAD_RATIO;
export const MAX_ROAD_TEMP = MAX_AMBIENT_TEMP * AMBIENT_TEMP_TO_ROAD_RATIO;
export const TEMP_STEP = 0.1;
export const MIN_WIND_SPEED_KMH = 0;
export const MAX_WIND_SPEED_KMH = 60;

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
    event: LeagueCalendarEntry | null;
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
    laps: number;

    hasPractice: boolean;
    practiceLength: number;

    hasQualifying: boolean;
    simulatedQualifyingMode: StartingGridMode;
    qualifyingMode: QualifyingMode;
    qualifyingLength: number;
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
            <FreeSession_TrackPanel
                expanded={section === Section.Track}
                canBeExpanded={canOpenTrackSection}
                canContinue={canOpenDriverSection}
                league={league}
                trackSettings={trackSettings}
                onChange={setTrackSettings}
                setLaps={handleSetLaps}
                onExpand={() => handleExpandSection(Section.Track)}
                onContinue={() => handleExpandSection(Section.Driver)}
            />
            <FreeSession_DriverPanel
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
                onStartRace={launchRace}
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

    function handleSetLaps (laps: number) {
        setRaceSettings(prevState => ({
            ...prevState,
            laps,
        }))
    }

    function launchRace () {
        const allDrivers = getLeagueDrivers(league!.teams);
        const raceDrivers = allDrivers.filter(
            d => raceSettings.driverEntries!.includes(d.internalName)
        );

        const race = new Race();
        race.setTrack(trackSettings.track!);
        race.setLayout(trackSettings.layout!);
        race.setRaceLaps(raceSettings.laps);
        race.setPenalties(
            raceSettings.penaltiesEnabled, raceSettings.jumpStartPenalty,
        );
        race.setTemperatures(
            trackSettings.ambientTemperature, trackSettings.roadTemperature,
        );
        race.setWind(
            trackSettings.windSpeedMin,
            trackSettings.windSpeedMax,
            trackSettings.windDirection,
        );
        race.setSpec(league!.specs[0]);
        race.setTeams(league!.teams);
        race.setDrivers(raceDrivers);

        race.setPlayerDriver(driverSettings.selectedDriver!.internalName);
        if (driverSettings.useDriverIdentity === false) {
            race.setCustomPlayerIdentity({
                name: driverSettings.customDriverName,
                number: driverSettings.customDriverNumber,
                country: driverSettings.customDriverCountry,
                initials: driverSettings.customDriverInitials,
            });
        }

        // TODO: Custom player position.

        race.setGridMode(raceSettings.simulatedQualifyingMode);
        race.calculateRaceSettings();

        const raceIni = createRaceIni(race);

        Ipc.launchRace(raceIni);
    }
}

export interface _LeagueSectionProps {
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

/**
 * Loads track settings to use.
 */
function loadTrackSettings () : TrackSettings {
    return {
        event: null,
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
        laps: 20,
    
        hasPractice: false,
        practiceLength: 30,
    
        hasQualifying: false,
        simulatedQualifyingMode: StartingGridMode.Realistic,
        qualifyingMode: QualifyingMode.timeAttack,
        qualifyingLength: 30,
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
        mechanicalDamage: 100,
        tyreWear: 1,
        slipstreamEffect: 1,
    }
}

export default FreeSessionPage;