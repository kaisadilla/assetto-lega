export interface UserSettings {
    assettoCorsaFolder: string | null;
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



export interface CarData {
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
    skins: {[folderName: string]: CarSkin};
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

export interface CarSkin {
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