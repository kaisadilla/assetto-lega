export interface RaceIni {
    ["BENCHMARK"]: {
        ACTIVE: 0 | 1;
    };
    ["REPLAY"]: {
        ACTIVE: 0 | 1;
        FILENAME: string;
    };
    ["REMOTE"]: {
        ACTIVE: 0 | 1;
        SERVER_IP: string;
        SERVER_PORT: string;
        NAME: string;
        TEAM: string;
        GUID: string;
        REQUESTED_CAR: string;
        PASSWORD: string;
    };
    ["RESTART"]: {
        ACTIVE: 0 | 1;
    };
    ["HEADER"]: {
        VERSION: number;
        __CM_FEATURE_SET?: number;
    };
    ["LAP_INVALIDATOR"]: {
        ALLOWED_TYRES_OUT: 0 | 1;
    };
	["RACE"]: {
		MODEL: string;
		MODEL_CONFIG: string;
		SKIN: string;
		TRACK: string;
		CONFIG_TRACK: string;
		AI_LEVEL: number;
		CARS: number;
		DRIFT_MODE: number;
		FIXED_SETUP: number;
		PENALTIES: 0 | 1;
		JUMP_START_PENALTY: 0 | 1 | 2; // none / pits / drive-through
		RACE_LAPS: number; // there's also SESSION_0 -> LAPS
	};
	["OPTIONS"]: {
		USE_MPH: 0 | 1;
	};
	["GHOST_CAR"]: {
		RECORDING: 0 | 1;
		PLAYING: number;
		LOAD: number;
		FILE: string;
		ENABLED: 0 | 1;
		SECONDS_ADVANTAGE: number;
	};
	["GROOVE"]: {
		VIRTUAL_LAPS: number;
		MAX_LAPS: number;
		STARTING_LAPS: number;
	};
	["TEMPERATURE"]: {
		AMBIENT: number;
		ROAD: number;
	};
	["LIGHTING"]: {
		SUN_ANGLE: number;
		TIME_MULT: number;
		CLOUD_SPEED: number;
		__TRACK_GEOTAG_LONG?: number;
		__TRACK_TIMEZONE_BASE_OFFSET?: number;
		__TRACK_TIMEZONE_DTS?: number;
		__CM_WEATHER_CONTROLLER?: string;
		__CM_WEATHER_TYPE?: number;
		__TRACK_TIMEZONE_OFFSET?: number;
		__TRACK_GEOTAG_LAT?: number;
	};
	["WEATHER"]: {
		NAME: string;
	};
	["WIND"]: {
		SPEED_KMH_MIN: number;
		SPEED_KMH_MAX: number;
		DIRECTION_DEG: number;
	};
	["DYNAMIC_TRACK"]: {
		SESSION_START: number;
		RANDOMNESS: number;
		LAP_GAIN: number;
		SESSION_TRANSFER: number;
	};
	["__PREVIEW_GENERATION"]: {
		ACTIVE: number;
	};
    [key: string]: any;
}

export interface RaceIniRaceSession {
    NAME: string;
    DURATION_MINUTES: number;
    SPAWN_SET: string;
    TYPE: number;
    LAPS: number; // there's also RACE -> RACE_LAPS
    STARTING_POSITION: number;
}

export interface RaceIniCar {
    SETUP: string;
    SKIN: string;
    MODEL: string;
    MODEL_CONFIG: string;
    BALLAST: number;
    RESTRICTOR: number;
    DRIVER_NAME: string;
    NATIONALITY: string;
    NATION_CODE: string;
}

export interface RaceIniAiCar extends RaceIniCar {
    AI_LEVEL: string;
    AI_AGGRESSION: string;
}