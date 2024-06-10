import { Countries } from 'data/countries';
import { AcTrack, AcTrackLayout, LeagueDriver, LeagueTeam } from 'data/schemas';
import { Race, RaceDriver } from 'logic/Race';
import { generateRandomQualifyingTable, generateRealisticQualifyingTable } from 'logic/raceStats';
import { RaceIni } from './iniSchemas';

export function setupRace () {
    
}

export function createRaceIni (race: Race) {
    const trackNames = race.getTrackNames();

    const playerDriver = race.getPlayerDriver();
    const playerCountry = Countries[playerDriver.driverInfo.country] ?? Countries["assetto_corsa"];
    const penalties = race.getPenalties();
    const temps = race.getTemperatures();
    const wind = race.getWind();

    // hardcoded values for now
    const ini = _newRaceIni();

    ini["RACE"].TRACK = trackNames.track;
    ini["RACE"].CONFIG_TRACK = trackNames.layout;
    ini["RACE"].RACE_LAPS = race.getLaps();
    ini["SESSION_0"].LAPS = race.getLaps();
    ini["RACE"].PENALTIES = penalties.penalties ? 1 : 0;
    ini["RACE"].JUMP_START_PENALTY = penalties.jumpStart;

    ini["TEMPERATURE"].AMBIENT = temps.ambient;
    ini["TEMPERATURE"].ROAD = temps.road;
    ini["WIND"].SPEED_KMH_MIN = wind.minSpeed;
    ini["WIND"].SPEED_KMH_MAX = wind.maxSpeed;
    ini["WIND"].DIRECTION_DEG = wind.directionInDegs;

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
    ini["RACE"].MODEL = playerDriver.car.toLowerCase();
    ini["RACE"].SKIN = playerDriver.skin;
    ini["SESSION_0"].STARTING_POSITION = race.getPlayerStartingPosition();

    const aiDrivers = race.getAiDriversByGridOrder();

    let iniDriverIndex = 1;
    for (const d of aiDrivers) {
        ini[`CAR_${iniDriverIndex}`] = _createRaceIniDriver(d);
        iniDriverIndex++;
    }
    ini["RACE"].CARS = race.getDriverCount();

    return ini;
}

function _createRaceIniDriver (driver: RaceDriver) {
    const country = Countries[driver.driverInfo.country]!; // TODO: null

    return {
        MODEL: driver.car.toLowerCase(),
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

function _newRaceIni () : RaceIni {
    return {
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
            STARTING_POSITION: 1,
        },
    };
}