import { LeagueDriver, LeagueTeam, LeagueTeamDriver, LeagueTeamDriverQualifying } from "data/schemas";
import { Gaussian } from "ts-gaussian";

export interface GridDriver {
    driverInfo: LeagueDriver;
    position: number;
    disaster: boolean;
}

export function generateRealisticQualifyingTable (drivers: LeagueDriver[]) {
    const DISASTER_OFFSET = 1_000_000;

    let driversByPos = [] as GridDriver[];

    for (const d of drivers) {
        let mean = d.qualifying.mean;
        let variance = d.qualifying.deviation ** 2;

        if (mean === 0) mean = 0.001;
        if (variance === 0) variance = 0.00001;

        const gaussian = new Gaussian(mean, variance);
        let val = gaussian.ppf(Math.random());
        const disaster = Math.random() < d.qualifying.disasterChance;

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

        const driverObj: GridDriver = {
            driverInfo: d,
            position: val,
            disaster,
        };

        driversByPos.push(driverObj);
    }

    driversByPos = driversByPos.sort((a, b) => a.position - b.position);

    for (let i = 0; i < driversByPos.length; i++) {
        driversByPos[i].position = i + 1;
    }

    return driversByPos;
}

export function generateRandomQualifyingTable (drivers: LeagueDriver[]) {
    let driversByPos = drivers.map(d => ({
        driverInfo: d,
        position: Math.random(),
        disaster: false
    } as GridDriver));

    driversByPos = driversByPos.sort((a, b) => a.position - b.position);
    
    for (let i = 0; i < driversByPos.length; i++) {
        driversByPos[i].position = i + 1;
    }

    return driversByPos;
}