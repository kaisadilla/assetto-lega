export interface UserSettings {
    assettoCorsaFolder: string | null;
}

export enum Tier {
    Legendary = "Legendary",
    Epic = "Epic",
    Distinguished = "Distinguished",
    Regular = "Regular",
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
    teams: LeagueTeam[];
    tracks: string[];
    calendar: LeagueCalendaryEntry[];
    scoreSystem: LeagueScoreSystem[];
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
    'teams',
    'tracks',
    'calendar',
    'scoreSystem',
];

export interface LeagueTeam {
    name: string;
    shortName?: string;
    constructorName?: string;
    // TODO class?: string;
    car: string;
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
    'car',
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
    number: string; // a driver's number is a string because it includes
                    // its stylization (e.g. '6' vs '06').
    name: string;
    initials: string;
    country: string;
    picture: string | null;
    enabledByDefault: boolean; // TODO: Implement.
    skins: string[];
    defaultSkin: string;
    strength: number;
    aggression: number;
    qualifying: LeagueTeamDriverQualifying;
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
    'defaultSkin',
    'strength',
    'aggression',
    'qualifying',
];

export interface LeagueCalendaryEntry {
    name: string;
    officialName: string;
    track: string;
    layout?: string;
    laps: number;
}

export interface LeagueScoreSystem {
    /**
     * The amount of points given to each position, from the 1st position to the
     * last position that scores points.
     */
    position: number[] | null;
    /**
     * The minimum amount of points given to each participant in the race.
     */
    minimumPointsPerRace: number;
    /**
     * The amount of points awarded to the participant with the fastest lap.
     */
    fastestLap: number;
    /**
     * The amount of points given to each position of the qualifying.
     * Works the same as the 'position' array.
     */
    qualifying: number[] | null;
}

export interface AcCarCollection {
    carList: AcCar[],
    carsById: {[folderName: string]: AcCar},
    brands: AcCarBrand[],
    brandsById: {[brandName: string]: AcCarBrand},
    tags: string[],
}

export interface AcCarSkinCollection {
    [folderName: string]: AcCarSkin;
}

export interface AcCar {
    folderName: string;
    /**
     * The absolute path to the folder containing this car.
     */
    folderPath: string;
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

export function createNewTeam () : LeagueTeam {
    return {
        //name: "(new team)",
        //shortName: "(new team)",
        //car: carId,
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
        //number: "1",
        //name: "(no name)",
        //initials: "???",
        country: "world",
        picture: null,
        //skins: [skinId],
        //defaultSkin: skinId,
        strength: 85,
        aggression: 50,
        qualifying: {
            mean: 1.5,
            deviation: 0.25,
            miracleChance: 0,
            disasterChance: 0,
        }
    } as LeagueTeamDriver;
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