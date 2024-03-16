import { Countries } from 'data/countries';
import { AcTrack, AcTrackLayout, LeagueDriver, LeagueTeam } from 'data/schemas';
import Ini from 'ini';
import { generateRandomQualifyingTable, generateRealisticQualifyingTable } from 'logic/raceStats';

export function setupRace () {
    
}

export interface CustomPlayerIdentity {
    name: string;
    number: string;
    country: string;
    initials: string;
}

export interface DriverRaceConfig {
    driverId: string;
    selectedSkin: string;
}

export interface RaceDriver {
    driverInfo: LeagueDriver,
    car: string;
    skin: string;
    ballast: number;
    restrictor: number;
}

export type StartingGridMode = 'random' | 'realistic' | 'custom';

export class Race {
    private track: AcTrack | null = null;
    private layout: AcTrackLayout | null = null;

    private spec: string | null = null;
    private teams: LeagueTeam[] | null = null;
    private drivers: LeagueDriver[] | null = null;
    /**
     * The id of the driver that the player is playing as. This
     * must be informed even if the player uses a custom identity.
     */
    private playerDriverId: string | null = null;
    private customPlayerIdentity: CustomPlayerIdentity | null = null;
    private startingGridMode: StartingGridMode = 'realistic';

    /**
     * The drivers of the race, in the order they'll start the race.
     */
    private startingGrid: LeagueDriver[] | null = null;

    public setTrack (track: AcTrack) {
        this.track = track;
    }

    public setLayout (layout: AcTrackLayout) {
        this.layout = layout;
    }

    public setSpec (spec: string) {
        this.spec = spec;
    }

    public setTeams (teams: LeagueTeam[]) {
        this.teams = teams;
    }

    public setDrivers (drivers: LeagueDriver[]) {
        this.drivers = drivers;
    }
    
    public setPlayerDriver (driverId: string) {
        this.playerDriverId = driverId;
    }

    public setCustomPlayerIdentity (identity: CustomPlayerIdentity | null) {
        this.customPlayerIdentity = identity;
    }

    public setGridMode (gridMode: StartingGridMode) {
        this.startingGridMode = gridMode;
    }

    public setStartingGrid (orderedDrivers: LeagueDriver[]) {
        this.startingGrid = orderedDrivers;
    }

    public generateRaceSettings () {
        if (this.spec === null) err("'spec' can't be null");
        if (this.teams === null) err("'teams' can't be null");
        if (this.drivers === null) err("'drivers' can't be null");
        if (this.playerDriverId === null) err("'playerDriverId' can't be null");

        if (this.startingGridMode === 'realistic') {
            this._generateStartingGridRealistic();
        }
        if (this.startingGridMode === 'random') {
            this._generateStartingGridRandom();
        }

        function err (msg: string) {
            throw msg;
        }
    }

    public getTrackNames () : {track: string, layout: string} {
        if (this.track === null || this.layout === null) {
            throw `Can't generate track names before track and layout are set.`;
        }

        return {
            track: this.track.folderName,
            layout: this.layout.folderName,
        }
    }

    public getDriverCount () : number {
        if (this.drivers === null) {
            throw `Can't count the drivers on a race with no drivers.`;
        }

        return this.drivers.length;
    }

    public getPlayerDriver () : RaceDriver {
        if (this.drivers === null || this.teams === null) {
            throw `Can't get player driver from a race with no drivers.`;
        }

        const player = this.drivers.find(d => d.internalName === this.playerDriverId)!;
        return this._getRaceDriver(player);
    }

    public getPlayerStartingPosition () : number {
        if (this.startingGrid === null) {
            throw `Can't get AI players before defining the starting grid.`;
        }

        return this.startingGrid.findIndex(d => d.internalName === this.playerDriverId)!;
    }

    public getAiDriversByGridOrder () : RaceDriver[] {
        if (this.startingGrid === null) {
            throw `Can't get AI players before defining the starting grid.`;
        }

        return this.startingGrid
            .filter(d => d.internalName !== this.playerDriverId)
            .map(d => this._getRaceDriver(d));
    }

    private _getRaceDriver (driver: LeagueDriver) : RaceDriver {
        if (this.teams === null) {
            throw `Can't get driver from a race with no teams.`;
        }

        const team = this.teams?.find(t => t.internalName === driver.team)!;

        return {
            driverInfo: driver,
            car: team.cars[this.spec!],
            skin: driver.defaultSkins[this.spec!],
            ballast: team.ballast,
            restrictor: team.restrictor,
        }
    }

    private _generateStartingGridRealistic () {
        if (this.drivers === null) {
            throw `Can't generate starting grid without drivers!`;
        }

        const table = generateRealisticQualifyingTable(this.drivers);
        
        this.startingGrid = table.map(gd => gd.driverInfo);
    }

    private _generateStartingGridRandom () {
        if (this.drivers === null) {
            throw `Can't generate starting grid without drivers!`;
        }

        const table = generateRandomQualifyingTable(this.drivers);
        
        this.startingGrid = table.map(gd => gd.driverInfo);
    }
}

export function createRaceIni (race: Race) {
    // hardcoded values for now
    const ini: {[key: string]: any} = {
        ["BENCHMARK"]: {
            ACTIVE: 0,
        },
        ["REPLAY"]: {
            ACTIVE: 0,
            FILENAME: "NO_REPLAY.acreplay",
        },
        ["REMOTE"]: {
            ACTIVE: 0,
            SERVER_IP: "",
            SERVER_PORT: "",
            NAME: "",
            TEAM: "",
            GUID: "",
            REQUESTED_CAR: "",
            PASSWORD: "",
        },
        ["RESTART"]: {
            ACTIVE: 0
        },
        ["HEADER"]: {
            VERSION: 2,
            __CM_FEATURE_SET: 1,
        },
        ["LAP_INVALIDATOR"]: {
            ALLOWED_TYRES_OUT: 1,
        },
        ["RACE"]: {
            MODEL: "",
            MODEL_CONFIG: "",
            SKIN: "",
            TRACK: "",
            CONFIG_TRACK: "",
            AI_LEVEL: 100,
            CARS: 0,
            DRIFT_MODE: 0,
            FIXED_SETUP: 0,
            PENALTIES: 0,
            JUMP_START_PENALTY: 0,
            RACE_LAPS: 9, // there's also SESSION_0 -> LAPS
        },
        ["OPTIONS"]: {
            USE_MPH: 0,
        },
        ["GHOST_CAR"]: {
            RECORDING: 0,
            PLAYING: 0,
            LOAD: 0,
            FILE: "",
            ENABLED: 0,
            SECONDS_ADVANTAGE: 0,
        },
        ["GROOVE"]: {
            VIRTUAL_LAPS: 10,
            MAX_LAPS: 30,
            STARTING_LAPS: 0,
        },
        ["TEMPERATURE"]: {
            AMBIENT: 26.0,
            ROAD: 37.0,
        },
        ["LIGHTING"]: {
            SUN_ANGLE: -16.00,
            TIME_MULT: 1.0,
            CLOUD_SPEED: 0.200,
            __TRACK_GEOTAG_LONG: 2.25,
            __TRACK_TIMEZONE_BASE_OFFSET: 3600,
            __TRACK_TIMEZONE_DTS: 0,
            __CM_WEATHER_CONTROLLER: "base",
            __CM_WEATHER_TYPE: 15,
            __TRACK_TIMEZONE_OFFSET: 3600,
            __TRACK_GEOTAG_LAT: 41.5533333333333,
        },
        ["WEATHER"]: {
            NAME: "3_clear",
        },
        ["WIND"]: {
            SPEED_KMH_MIN: 0,
            SPEED_KMH_MAX: 0,
            DIRECTION_DEG: 0,
        },
        ["DYNAMIC_TRACK"]: {
            SESSION_START: 100,
            RANDOMNESS: 0,
            LAP_GAIN: 1,
            SESSION_TRANSFER: 100,
        },
        ["__PREVIEW_GENERATION"]: {
            ACTIVE: 0,
        },
        ["SESSION_0"]: {
            NAME: "Quick Race",
            DURATION_MINUTES: 0,
            SPAWN_SET: "START",
            TYPE: 3,
            LAPS: 9, // there's also RACE -> RACE_LAPS
            STARTING_POSITION: 0,
        },
    };

    const trackNames = race.getTrackNames();
    ini["RACE"].TRACK = trackNames.track;
    ini["RACE"].CONFIG_TRACK = trackNames.layout;

    const playerDriver = race.getPlayerDriver();
    const playerCountry = Countries[playerDriver.driverInfo.country]!; // TODO: null
    ini["CAR_0"] = {
        SETUP: "",
        SKIN: playerDriver.skin,
        MODEL: "-",
        MODEL_CONFIG: "",
        BALLAST: 0,
        RESTRICTOR: 0,
        DRIVER_NAME: playerDriver.driverInfo.name,
        NATIONALITY: playerCountry.assettoCorsa?.name ?? "Unknown",
        NATION_CODE: playerCountry.assettoCorsa?.code ?? "AC",
    }
    ini["RACE"].MODEL = playerDriver.car;
    ini["RACE"].SKIN = playerDriver.skin;
    ini["SESSION_0"].STARTING_POSITION = race.getPlayerStartingPosition();

    const aiDrivers = race.getAiDriversByGridOrder();

    let iniDriverIndex = 1;
    for (const d of aiDrivers) {
        ini[`CAR_${iniDriverIndex}`] = _createRaceIniDriver(d);
        iniDriverIndex++;
    }
    ini["RACE"].CARS = race.getDriverCount();

    console.log(Ini.stringify(ini));
}

function _createRaceIniDriver (driver: RaceDriver) {
    const country = Countries[driver.driverInfo.country]!; // TODO: null

    return {
        MODEL: driver.car,
        SKIN: driver.skin,
        SETUP: "",
        MODEL_CONFIG: "",
        AI_LEVEL: driver.driverInfo.strength,
        AI_AGGRESSION: driver.driverInfo.aggression,
        DRIVER_NAME: driver.driverInfo.name,
        BALLAST: driver.ballast,
        RESTRICTOR: driver.restrictor,
        NATION_CODE: country.assettoCorsa?.code ?? "AC",
        NATIONALITY: country.assettoCorsa?.name ?? "Unknown",
    };
}