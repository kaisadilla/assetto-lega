import { AcTrack, AcTrackLayout, LeagueDriver, LeagueTeam } from "data/schemas";
import { generateRandomQualifyingTable, generateRealisticQualifyingTable } from "./raceStats";


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

export enum StartingGridMode {
    Realistic,
    Random,
    Custom,
}

export enum QualifyingMode {
    timeAttack,
}

export enum JumpStartPenalty {
    None = 0,
    BoxRestart = 1,
    DriveThrough = 2,
}

export enum CarAid {
    On,
    Off,
    RealSetting,
}

export class Race {
    private track: AcTrack | null = null;
    private layout: AcTrackLayout | null = null;
    private raceLaps: number | null = null;

    private penalties: boolean | null = null;
    private jumpStartPenalty: JumpStartPenalty | null = null;

    private ambientTemp: number | null = null;
    private roadTemp: number | null = null;
    private windSpeedMin: number | null = null;
    private windSpeedMax: number | null = null;
    private windDegrees: number | null = null;

    private spec: string | null = null;
    private teams: LeagueTeam[] | null = null;
    private drivers: LeagueDriver[] | null = null;
    /**
     * The id of the driver that the player is playing as. This
     * must be informed even if the player uses a custom identity.
     */
    private playerDriverId: string | null = null;
    private customPlayerIdentity: CustomPlayerIdentity | null = null;
    private startingGridMode = StartingGridMode.Realistic;

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

    public setRaceLaps (laps: number) {
        this.raceLaps = laps;
    }

    public setPenalties (penalties: boolean, jumpStartPenalty: JumpStartPenalty) {
        this.penalties = penalties;
        this.jumpStartPenalty = jumpStartPenalty;
    }

    public setTemperatures (ambientTemp: number, roadTemp: number) {
        this.ambientTemp = ambientTemp;
        this.roadTemp = roadTemp;
    }

    public setWind (min: number, max: number, direction: number) {
        this.windSpeedMin = min;
        this.windSpeedMax = max;
        this.windDegrees = direction;
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

    public calculateRaceSettings () {
        if (this.spec === null) err("'spec' can't be null");
        if (this.teams === null) err("'teams' can't be null");
        if (this.drivers === null) err("'drivers' can't be null");
        if (this.playerDriverId === null) err("'playerDriverId' can't be null");

        if (this.startingGridMode === StartingGridMode.Realistic) {
            this._generateStartingGridRealistic();
        }
        if (this.startingGridMode === StartingGridMode.Random) {
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

    public getLaps () : number {
        if (this.raceLaps === null ) throw `Race has no laps.`;
        return this.raceLaps;
    }

    public getPenalties () : { penalties: boolean, jumpStart: JumpStartPenalty } {
        if (this.penalties === null || this.jumpStartPenalty === null) {
            throw `Penalties haen't been set yet.`;
        }

        return {
            penalties: this.penalties,
            jumpStart: this.jumpStartPenalty,
        };
    }

    public getTemperatures () : { ambient: number, road: number } {
        if (this.ambientTemp === null || this.roadTemp === null) {
            throw `Temperatures haen't been set yet.`;
        }
        
        return {
            ambient: this.ambientTemp,
            road: this.roadTemp,
        };
    }

    public getWind () {
        if (this.windSpeedMin === null || this.windSpeedMax === null || this.windDegrees === null) {
            throw `Wind hasn't been set yet`;
        }

        return {
            minSpeed: this.windSpeedMin,
            maxSpeed: this.windSpeedMax,
            directionInDegs: this.windDegrees,
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

        return this.startingGrid.findIndex(d => d.internalName === this.playerDriverId)! + 1;
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