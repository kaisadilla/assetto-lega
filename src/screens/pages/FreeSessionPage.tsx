import LeagueMenu from 'components/LeagueMenu';
import LS_KEYS from 'constants/localStorage';
import { LeagueCollection, useDataContext } from 'context/useDataContext';
import { UserProfile, useSettingsContext } from 'context/useSettings';
import { AssetFolder } from 'data/assets';
import { AcTrack, AcTrackLayout, League, LeagueCalendarEntry, LeagueTeam, LeagueTeamDriver, getLeagueDrivers } from 'data/schemas';
import AssetImage from 'elements/AssetImage';
import { CarAid, JumpStartPenalty, QualifyingMode, Race, StartingGridMode } from 'logic/Race';
import { createRaceIni } from 'logic/game/iniFiles';
import Ipc from 'main/ipc/ipcRenderer';
import { useState } from 'react';
import FreeSession_DriverPanel from './FreeSessionPage.DriverPanel';
import FreeSession_RaceInfoPanel from './FreeSessionPage.RaceInfoPanel';
import FreeSession_TrackPanel from './FreeSessionPage.TrackPanel';

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
    const { leaguesById } = useDataContext();

    const [section, setSection] = useState(Section.League);

    const [league, setLeague] = useState<League | null>(loadLeague(leaguesById));
    const [trackSettings, setTrackSettings] = useState(loadTrackSettings(false));
    const [driverSettings, setDriverSettings] = useState(loadDriverSettings(profile, false));
    const [raceSettings, setRaceSettings] = useState(loadRaceSettings(false));

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
                onChange={handleChangeTrackSettings}
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
                onChange={handleChangeDriverSettings}
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
                onChange={handleChangeRaceSettings}
                onExpand={() => handleExpandSection(Section.RaceInfo)}
                onStartRace={launchRace}
            />
        </div>
    );

    function handleChangeTrackSettings (settings: TrackSettings) {
        setTrackSettings(settings);
        saveTrackSettings(settings);
    }

    function handleChangeDriverSettings (settings: DriverSettings) {
        setDriverSettings(settings);
        saveDriverSettings(settings);
    }

    function handleChangeRaceSettings (settings: RaceSettings) {
        setRaceSettings(settings);
        saveRaceSettings(settings);
    }

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
        saveLeague(selectedLeague);

        setSection(Section.Track);
        setTrackSettings(loadTrackSettings(true));
        setDriverSettings(loadDriverSettings(profile, true));
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

function saveLeague (league: League) {
    localStorage.setItem(
        LS_KEYS.freeSession.league,
        league.internalName
    );
}

function saveTrackSettings (settings: TrackSettings) {
    localStorage.setItem(
        LS_KEYS.freeSession.trackSettings,
        JSON.stringify(settings)
    );
}

function saveDriverSettings (settings: DriverSettings) {
    localStorage.setItem(
        LS_KEYS.freeSession.driverSettings,
        JSON.stringify(settings)
    );
}

function saveRaceSettings (settings: RaceSettings) {
    localStorage.setItem(
        LS_KEYS.freeSession.raceSettings,
        JSON.stringify(settings)
    );
}

function loadLeague (leaguesById: LeagueCollection) : League | null {
    const leagueId = localStorage.getItem(LS_KEYS.freeSession.league) as string;
    if (!leagueId) {
        return null;
    }
    else {
        const league = leaguesById[leagueId];

        return league ?? null;
    }
}

/**
 * Loads track settings to use.
 */
function loadTrackSettings (reset: boolean) : TrackSettings {
    let settings = {} as TrackSettings;

    if (reset === false) {
        const json = localStorage.getItem(
            LS_KEYS.freeSession.trackSettings
        );

        settings = json ? JSON.parse(json) : {};
    }

    settings.event ??= null;
    settings.track ??= null;
    settings.layout ??= null;
    settings.startTime ??= 0.5;
    settings.timeMultiplier ??= 1.0;
    settings.randomTime ??= false;
    settings.trackCondition ??= TrackCondition.Auto;
    settings.ambientTemperature ??= 26.0;
    settings.roadTemperature ??= 36.7;
    settings.windSpeedMin ??= 0;
    settings.windSpeedMax ??= 0;
    settings.windDirection ??= 0;

    return settings;
}

function loadDriverSettings (profile: UserProfile, reset: boolean) : DriverSettings {
    let settings = {} as DriverSettings;

    if (reset === false) {
        const json = localStorage.getItem(
            LS_KEYS.freeSession.driverSettings
        );

        settings = json ? JSON.parse(json) : {};
    }

    settings.selectedTeam ??= null;
    settings.selectedDriver ??= null;
    settings.selectedSkin ??= null;
    settings.useDriverIdentity ??= true;
    settings.customDriverCountry ??= profile.country;
    settings.customDriverName ??= profile.name;
    settings.customDriverNumber ??= profile.number;
    settings.customDriverInitials ??= profile.initials;

    return settings;
}

function loadRaceSettings (reset: boolean) : RaceSettings {
    let settings = {} as RaceSettings;

    if (reset === false) {
        const json = localStorage.getItem(
            LS_KEYS.freeSession.raceSettings
        );

        settings = json ? JSON.parse(json) : {};
    }

    settings.driverEntries ??= null;
    settings.laps ??= 20;
    
    settings.hasPractice ??= false;
    settings.practiceLength ??= 30;
    
    settings.hasQualifying ??= false;
    settings.simulatedQualifyingMode ??= StartingGridMode.Realistic;
    settings.qualifyingMode ??= QualifyingMode.timeAttack;
    settings.qualifyingLength ??= 30;
    settings.customStartingPositionForPlayer ??= null;
    settings.gridOrder ??= null;
    
    settings.penaltiesEnabled ??= true;
    settings.jumpStartPenalty ??= JumpStartPenalty.DriveThrough;
    settings.tyreBlankets ??= true;
    
    settings.opponentStrength ??= 100;
    settings.opponentAggression ??= 100;
    
    settings.automaticShifting ??= true;
    settings.automaticClutch ??= true;
    settings.autoblip ??= true;
    settings.idealLine ??= true;
    settings.tractionControl ??= CarAid.On;
    settings.abs ??= CarAid.On;
    settings.stabilityControl ??= 100;
    settings.fuelConsumption ??= 1;
    settings.mechanicalDamage ??= 100;
    settings.tyreWear ??= 1;
    settings.slipstreamEffect ??= 1;

    return settings;
}

export default FreeSessionPage;