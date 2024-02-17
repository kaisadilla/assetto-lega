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