import { CURRENT_VERSION } from "versioning";

export interface UserSettings {
    assettoCorsaFolder: string | null;
}

export enum Tier {
    Legendary = "legendary",
    Epic = "epic",
    Distinguished = "distinguished",
    Regular = "regular",
}

export const TierNames = {
    [Tier.Legendary]: "Legendary",
    [Tier.Epic]: "Epic",
    [Tier.Distinguished]: "Distinguished",
    [Tier.Regular]: "Regular",
}

export interface League {
    internalName: string;
    series: string;
    year: number;
    displayName?: string;
    // TODO: classes: string[]; a checkmark that indicates whether the league has classes
    era?: string;
    makers?: string;
    region: string;
    color: string;
    categories: string[];
    logo: string;
    background: string;
    useRandomSkins: boolean;
    specs: string[];
    classes: string[] | null;
    teams: LeagueTeam[];
    tracks: string[];
    calendar: LeagueCalendarEntry[];
    scoreSystem: LeagueScoreSystem;
    version: number;
}

export const LeagueRequiredFields: (keyof League)[] = [
    'internalName',
    'series',
    'year',
    // TODO 'classes',
    'region',
    'color',
    'categories',
    'logo',
    'background',
    'specs',
    'classes',
    'teams',
    'tracks',
    'calendar',
    'scoreSystem',
];

export interface LeagueTeam {
    internalName: string;
    name: string;
    shortName?: string;
    constructorName?: string;
    className: string | null;
    cars: {[spec: string]: string};
    country: string;
    logo: string;
    badge: string;
    color: string;
    ballast: number;
    restrictor: number;
    mainDriver: number;
    drivers: LeagueTeamDriver[];
}

export const LeagueTeamRequiredFields: (keyof LeagueTeam)[] = [
    'name',
    'className',
    'cars',
    'country',
    'logo',
    'badge',
    'color',
    'ballast',
    'restrictor',
    'mainDriver',
    'drivers',
];

export interface LeagueTeamDriver {
    internalName: string;
    number: string; // a driver's number is a string because it includes
                    // its stylization (e.g. '6' vs '06').
    name: string;
    initials: string;
    country: string;
    picture: string | null;
    enabledByDefault: boolean; // TODO: Implement.
    skins: {[spec: string]: string[]};
    defaultSkins: {[spec: string]: string};
    strength: number;
    aggression: number;
    qualifying: LeagueTeamDriverQualifying;
    isReserveDriver: boolean;
}

export interface LeagueDriver extends LeagueTeamDriver {
    team: string; // the internal name of the team this driver belongs to.
}

export interface LeagueTeamDriverQualifying {
    mean: number;
    deviation: number;
    miracleChance: number;
    disasterChance: number;
}

export const LeagueTeamDriverRequiredFields: (keyof LeagueTeamDriver)[] = [
    'number',
    'name',
    'initials',
    'country',
    'skins',
    'defaultSkins',
    'strength',
    'aggression',
    'qualifying',
    'isReserveDriver',
];

export interface LeagueCalendarEntry {
    internalName: string;
    name: string;
    officialName?: string;
    country: string;
    date?: string;
    track: string;
    layout: string;
    laps: number;
    qualifyingStartHour?: string;
    raceStartHour?: string;
    weathers: string[];
    spec: string;
    teamLineups: {[team: string]: string[]};
    driverSkins: {[driver: string]: string[]};
}

export const LeagueCalendarEntryRequiredFields: (keyof LeagueCalendarEntry)[] = [
    'name',
    'country',
    'track',
    'layout',
    'laps',
    'qualifyingStartHour',
    'raceStartHour',
    'weathers',
    'spec',
    'teamLineups',
    'driverSkins',
];

export interface LeagueScoreSystem {
    /**
     * The amount of points given to each position, from the 1st position to the
     * last position that scores points.
     */
    position: number[] | null;
    /**
     * The minimum amount of points given to each participant in the race.
     */
    defaultPointsPerRace: number;
    /**
     * The amount of points awarded to the participant with the fastest lap.
     */
    fastestLap: number;
    /**
     * The minimum position (inclusive) that awards points for the fastest lap.
     */
    fastestLapThreshold: number;
    /**
     * The amount of points given to each position of the qualifying.
     * Works the same as the 'position' array.
     */
    qualifying: number[] | null;
}

export interface AcCarCollection {
    carList: AcCar[];
    carsById: {[folderName: string]: AcCar};
    brands: AcCarBrand[];
    brandsById: {[brandName: string]: AcCarBrand};
    tags: string[];
}

export interface AcTrackCollection {
    trackList: AcTrack[];
    tracksById: {[folderName: string]: AcTrack};
    tags: string[];
    presentCountries: string[];
}

export interface AcCarSkinCollection {
    [folderName: string]: AcCarSkin;
}
export interface AcTrackLayoutCollection {
    [folderName: string]: AcTrackLayout;
}

export interface AcCar {
    folderName: string;
    /**
     * The absolute path to the folder containing this car.
     */
    folderPath: string;
    /**
     * The absolute path to the badge image of this car.
     */
    badgePath: string;
    displayName: string;
    ui: CarUi;
    /**
     * The skins present in this car's folder. Each key corresponds to the name
     * of a folder, and each value holds information about that skin.
     */
    skinsById: AcCarSkinCollection;
    /**
     * An array with all the skins present in this car's folder.
     */
    skins: AcCarSkin[];
}

export function getCarDefaultSkin (carData: AcCar) {
    const firstSkin = Object.keys(carData.skinsById)[0];
    return carData.skinsById[firstSkin];
}

// Assetto Corsa's game data.

export interface CarUi {
    name?: string;
    brand?: string;
    country?: string;
    year?: number;
    description?: string;
    tags?: string[];
    class?: string;
    specs?: CarUiSpecs;
    torqueCurve?: [number, number][];
    powerCurve?: [number, number][];
    author?: string;
    version?: string;
    url?: string;
}

export interface CarUiSpecs {
    bhp?: string;
    torque?: string;
    weight?: string;
    topspeed?: string;
    acceleration?: string;
    pwratio?: string;
}

export interface AcCarSkin {
    folderName: string;
    folderPath: string;
    /**
     * The path to the preview image of the skin.
     */
    previewPath: string;
    /**
     * The path to the icon of the skin (generally a square with the car's number).
     */
    liveryPath: string;
    displayName: string;
    ui: CarSkinUi;
}

export interface CarSkinUi {
    skinname?: string;
    country?: string;
    drivername?: string;
    team?: string;
    number?: string;
    priority?: number;
}

export interface AcCarBrand {
    displayName: string;
    badgePath: string;
}

export interface AcTrack {
    folderName: string;
    /**
     * The absolute path to the folder containing this track.
     */
    folderPath: string;
    /**
     * The display name of the track, calculated from the names in the layouts.
     */
    displayName: string;
    /**
     * The country to display, taken from the default (or first) layout available.
     */
    displayCountry: string;
    /**
     * Whether the first layout in the layouts array is in the root "ui" folder,
     * rather than an extra layout.
     */
    firstLayoutIsDefault: boolean;
    layouts: AcTrackLayout[];
    layoutsById: AcTrackLayoutCollection;
}

export interface AcTrackLayout {
    folderName: string;
    folderPath: string;
    previewPath: string;
    outlinePath: string;
    /**
     * The name of the layout itself, removing the part that names the track.
     */
    layoutName: string;
    length: number | null; // in meters
    width: {min: number, max: number} | null; // in meters
    ui: AcTrackLayoutUi;
}

export interface AcTrackLayoutUi {
    name?: string;
    description?: string;
    tags?: string[];
    geotags?: string[],
    country?: string;
    city?: string;
    length?: string;
    width?: string;
    pitboxes?: string;
    run?: string;
    author?: string;
    version?: string;
    url?: string;
}

export function createNewLeague () : League {
    return {
        internalName: "",
        series: "",
        year: 1900,
        //displayName?: "",
        //era?: "",
        //makers?: "",
        region: "world",
        color: "#ffffff",
        categories: [] as string[],
        logo: "@f1-1994",
        background: "@ac-spa",
        useRandomSkins: false,
        specs: ["Default"],
        classes: null,
        teams: [] as LeagueTeam[],
        tracks: [] as string[],
        calendar: [] as LeagueCalendarEntry[],
        scoreSystem: {
            position: null,
            defaultPointsPerRace: 0,
            fastestLap: 0,
            fastestLapThreshold: 0,
            qualifying: null,
        },
        version: CURRENT_VERSION,
    } as League;
}

export function createNewTeam () : LeagueTeam {
    return {
        internalName: "",
        //name: "(new team)",
        //shortName: "(new team)",
        className: null,
        cars: {},
        country: "world",
        logo: "@default",
        badge: "@default",
        color: "#ffffff",
        ballast: 0,
        restrictor: 0,
        mainDriver: 0,
        drivers: [
            createNewDriver(),
        ],
    } as LeagueTeam;
}

export function createNewDriver () : LeagueTeamDriver {
    return {
        internalName: "",
        //number: "1",
        //name: "(no name)",
        //initials: "???",
        country: "world",
        picture: null,
        skins: {},
        defaultSkins: {},
        strength: 85,
        aggression: 50,
        qualifying: {
            mean: 0.5,
            deviation: 0.25,
            miracleChance: 0.05,
            disasterChance: 0.05,
        },
        isReserveDriver: false,
    } as LeagueTeamDriver;
}

export function createNewCalendarEntry () : LeagueCalendarEntry {
    return {
        internalName: "",
        //name: "(no name)",
        //officialName: "(no official name)",
        country: "world",
        date: "2000-01-31",
        //track: trackId,
        //layout: layoutId,
        laps: 70,
        qualifyingStartHour: "16:00",
        raceStartHour: "16:00",
        weathers: [] as string[],
        teamLineups: {},
        driverSkins: {},
    } as LeagueCalendarEntry;
}

export function getTeamName (team: LeagueTeam) {
    return (team.shortName ? team.shortName : team.name) ?? "<no name>";
}

export function getCarName (car: AcCar) {
    return (car.ui.name ? car.ui.name : car.folderName) ?? "<no name>";
}

export function getCarSkinName (skin: AcCarSkin) {
    return (skin.ui.skinname ? skin.ui.skinname : skin.folderName) ?? "<no name>";
}

export function getLeagueDrivers (teams: LeagueTeam[]) {
    const drivers = [] as LeagueDriver[];

    for (const t of teams) {
        for (const d of t.drivers) {
            drivers.push({
                ...d,
                team: t.internalName,
            });
        }
    }

    return drivers;
}