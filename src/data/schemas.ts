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
    displayName: string;
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

export interface LeagueTeam {
    name: string;
    shortName: string;
    constructorName?: string;
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

export interface LeagueTeamDriver {
    number: string; // a driver's number is a string because it includes
                    // its stylization (e.g. '6' vs '06').
    name: string;
    initials: string;
    country: string;
    picture: string | null;
    skins: string[];
    defaultSkin: string;
    strength: number;
    aggression: number;
    classifying: {
        value: number;
        delta: number;
        consistency: number;
        miracleChance: number;
        disasterChance: number;
    }
}

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
    skins: AcCarSkinCollection;
}

export function getCarDefaultSkin (carData: AcCar) {
    const firstSkin = Object.keys(carData.skins)[0];
    return carData.skins[firstSkin];
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

export function createNewTeam (carId: string, skinId: string) : LeagueTeam {
    return {
        name: "(new team)",
        shortName: "(new team)",
        car: carId,
        country: "world",
        logo: "@default",
        badge: "@default",
        color: "#ffffff",
        ballast: 0,
        restrictor: 0,
        mainDriver: 0,
        drivers: [
            {
                number: "1",
                name: "(no name)",
                initials: "???",
                country: "world",
                picture: null,
                skins: [skinId],
                defaultSkin: skinId,
                strength: 85,
                aggression: 50,
                classifying: {
                    value: 1.5,
                    delta: 0.25,
                    consistency: 1,
                    miracleChance: 0,
                    disasterChance: 0,
                }
            }
        ],
    };
}