export interface UserSettings {
    assettoCorsaFolder: string | null;
}

export interface League {
    displayName: string;
    region: string;
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
    icon: string;
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
    default_skin: string;
    strength: number;
    aggression: number;
}

export interface LeagueCalendaryEntry {
    name: string;
    officialName: string;
    track: string;
    layout: string;
    laps: number;
}

export interface LeagueScoreSystem {
    /**
     * The amount of points given to each position, from the 1st position to the
     * last position that scores points.
     */
    position: number[] | null;
    /**
     * The minimum amount of points 
     */
    minimumPointsPerRace: number;
    fastestLap: number;
    qualifying: number[] | null;
}