import { LeagueTeam, LeagueTeamDriver, LeagueTeamDriverQualifying } from "data/schemas";
import { Gaussian } from "ts-gaussian";

export interface LeagueDriver {
    team: number;
    driver: number;
    driverInfo: LeagueTeamDriver;
}

export interface DriverRanking {
    team: number;
    driver: number;
    driverInfo: LeagueTeamDriver;
    position: number;
    disaster: boolean;
}

export function getLeagueDrivers (teams: LeagueTeam[]) {
    const col = [] as LeagueDriver[];

    for (let t = 0; t < teams.length; t++) {
        const team = teams[t];

        for (let d = 0; d < team.drivers.length; d++) {
            const driver = team.drivers[d];

            col.push({
                team: t,
                driver: d,
                driverInfo: driver,
            });
        }
    }

    return col;
}

export function generateQualifyingTable (drivers: LeagueDriver[]) {
    const DISASTER_OFFSET = 1_000_000;

    let driversByPos = [] as DriverRanking[];

    for (const d of drivers) {
        let mean = d.driverInfo.qualifying.mean;
        let variance = d.driverInfo.qualifying.deviation ** 2;

        if (mean === 0) mean = 0.001;
        if (variance === 0) variance = 0.00001;

        const gaussian = new Gaussian(mean, variance);
        let val = gaussian.ppf(Math.random());
        const disaster = Math.random() < d.driverInfo.qualifying.disasterChance;

        if (disaster) {
            // half the time, the disaster is being randomly rerolled all
            // across the grid, but never to improve your position. If the
            // initial value is 0.36, then the randomly generated number will
            // make the value be between 0.36 and 1, but never 0.30.
            if (Math.random() < 0.5) {
                // the maximum amount of value to add.
                const margin = 1 - val;
                if (margin > 0) {
                    const offset = Math.random() * margin;
                    val += offset;
                }
            }
            else {
                val += DISASTER_OFFSET + (Math.random() * 3);
            }
        }

        const driverObj = {
            team: d.team,
            driver: d.driver,
            driverInfo: d.driverInfo,
            position: val,
            disaster,
        }

        driversByPos.push(driverObj);
    }

    driversByPos = driversByPos.sort((a, b) => a.position - b.position);

    for (let i = 0; i < driversByPos.length; i++) {
        driversByPos[i].position = i + 1;
    }

    return driversByPos;
}