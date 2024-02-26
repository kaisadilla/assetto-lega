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
    let driversByPos = [] as DriverRanking[];

    for (const d of drivers) {
        const mean = d.driverInfo.qualifying.mean;
        const variance = d.driverInfo.qualifying.deviation ** 2;
        const gaussian = new Gaussian(mean, variance);
        const val = gaussian.ppf(Math.random());

        const driverObj = {
            team: d.team,
            driver: d.driver,
            driverInfo: d.driverInfo,
            position: val,
        }

        driversByPos.push(driverObj);
    }

    driversByPos = driversByPos.sort((a, b) => a.position - b.position);

    for (let i = 0; i < driversByPos.length; i++) {
        driversByPos[i].position = i + 1;
    }

    return driversByPos;
}