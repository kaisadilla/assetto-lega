import GaussianChart from 'components/charts/GaussianChart';
import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { Files } from 'data/files';
import { League, LeagueTeam, LeagueTeamDriver, LeagueTeamDriverQualifying } from 'data/schemas';
import Button from 'elements/Button';
import NavBar from 'elements/NavBar';
import RangeSlider from 'elements/RangeSlider';
import Slider from 'elements/Slider';
import ToolboxRow from 'elements/ToolboxRow';
import { DriverRanking, generateQualifyingTable, getLeagueDrivers } from 'logic/raceStats';
import React, { useCallback, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useResizeDetector } from 'react-resize-detector';
import { Gaussian } from 'ts-gaussian';
import { chooseW3CTextColor, getClassString, truncateNumber } from 'utils';

const GAUSSIAN_MIN_MEAN = 0;
const GAUSSIAN_MAX_MEAN = 1;
const GAUSSIAN_MIN_DEV = 0.01;
const GAUSSIAN_MAX_DEV = 0.5;
const GAUSSIAN_SLIDER_STEP = 0.01;
const GAUSSIAN_GRAPH_MARGIN = 0.5;
const GAUSSIAN_GRAPH_STEPS = 200;

enum DriversTabSection {
    Editor,
    Chart,
}

export interface DriversTabProps {
    league: League;
    onChange: (newTeams: LeagueTeam[]) => void;
}

function DriversTab ({
    league,
    onChange,
}: DriversTabProps) {
    const [section, setSection] = useState(DriversTabSection.Editor);

    return (
        <div className="editor-tab drivers-tab">
            <div className="drivers-section">
                <NavBar get={section} set={setSection}>
                    <NavBar.Item text="edit drivers" index={DriversTabSection.Editor} />
                    <NavBar.Item text="chart" index={DriversTabSection.Chart} />
                </NavBar>
                <div className="drivers-list-header">
                    (header)
                </div>
                <DriverList teams={league.teams} onChange={onChange} />
            </div>
            <SimulatorSection teams={league.teams} />
        </div>
    );
}

interface DriverListProps {
    teams: LeagueTeam[]
    onChange: (newTeams: LeagueTeam[]) => void;
}

function DriverList ({
    teams,
    onChange,
}: DriverListProps) {
    return (
        <div className="driver-list">
            {teams.map((team, t) => (
                <>
                    {team.drivers.map((driver, d) => (
                        <DriverEntry
                            driver={driver}
                            team={team}
                            onChange={(field, value) => handleDriverChange(
                                t, d, field, value
                            )}
                        />
                    ))}
                </>
            ))}
        </div>
    );

    function handleDriverChange (
        teamIndex: number, driverIndex: number,
        field: keyof LeagueTeamDriver, value: any
    ) {        
        const updatedTeams = [...teams];
        updatedTeams[teamIndex].drivers = [...teams[teamIndex].drivers];
        updatedTeams[teamIndex].drivers[driverIndex] = {
            ...updatedTeams[teamIndex].drivers[driverIndex],
            [field]: value,
        }

        onChange(updatedTeams);
    }
}


interface DriverEntryProps {
    driver: LeagueTeamDriver;
    team: LeagueTeam;
    onChange: (field: keyof LeagueTeamDriver, value: any) => void;
}

function DriverEntry ({
    driver,
    team,
    onChange,
}: DriverEntryProps) {
    const { dataPath } = useDataContext();

    const [mean, setMean] = useState(0.05);
    const [dev, setDev] = useState(0.12);

    const badgeImg = Files.getFilePath(
        dataPath, AssetFolder.teamBadges, team.badge
    );

    const calcTextColor = chooseW3CTextColor(team.color);

    const classStr = getClassString(
        "driver-entry",
        calcTextColor === 'black' && "driver-entry-text-black",
        calcTextColor === 'white' && "driver-entry-text-white",
    );

    const style = {
        backgroundColor: team.color,
        borderColor: team.color,
    }

    return (
        <div className={classStr} style={style}>
            <div className="driver-team-badge">
                <img src={badgeImg} />
            </div>
            <div className="driver-name">
                {driver.name}
            </div>
            <div className="driver-stat">
                <Slider
                    value={driver.strength}
                    min={70}
                    max={100}
                    onChange={val => {}}
                    showNumberBox
                />
            </div>
            <div className="driver-stat">
                <Slider
                    value={driver.aggression}
                    min={0}
                    max={100}
                    onChange={val => {}}
                    showNumberBox
                />
            </div>
            <div className="driver-qualifying-graph">
                <QualifyingGaussianChart
                    mean={driver.qualifying.mean}
                    standardDeviation={driver.qualifying.deviation}
                />
                <div className="range-slider-full-range-viz">
                    <div className="range-slider-mean-range-viz">
                    <div className="range-slider-container">
                    <RangeSlider
                        value={driver.qualifying.mean}
                        min={GAUSSIAN_MIN_MEAN}
                        max={GAUSSIAN_MAX_MEAN}
                        deviation={driver.qualifying.deviation}
                        minDeviation={GAUSSIAN_MIN_DEV}
                        maxDeviation={GAUSSIAN_MAX_DEV}
                        step={GAUSSIAN_SLIDER_STEP}
                        onValueChange={
                            n => handleQualifyingChange('mean', n)
                        }
                        onDeviationChange={
                            n => handleQualifyingChange('deviation', n)
                        }
                    />
                    </div>
                    </div>
                </div>
            </div>
            <div className="driver-qualifying-stats">
                <div className="stat">
                    <span className="symbol">μ: </span>
                    <span className="value">{driver.qualifying.mean}</span>
                </div>
                <div className="stat">
                    <span className="symbol">σ: </span>
                    <span className="value">{driver.qualifying.deviation}</span>
                </div>
            </div>
            <div className="driver-chance">
                <div className="value">0.125</div>
                <div className="proportion">1/8</div>
            </div>
            <div className="driver-chance">
                <div className="value">0.05</div>
                <div className="proportion">1/20</div>
            </div>
        </div>
    );

    function handleDevChange (value: number) {
        console.log(value);
        setDev(value);
    }

    function handleFieldChange (field: keyof LeagueTeamDriver, value: any) {
        onChange(field, value);
    }

    function handleQualifyingChange (
        field: keyof LeagueTeamDriverQualifying, value: number
    ) {
        const qualifying = {...driver.qualifying};
        qualifying[field] = value;
        onChange('qualifying', qualifying);
    }
}


interface QualifyingGaussianChartProps {
    mean: number;
    standardDeviation: number;
}

function QualifyingGaussianChart ({
    mean,
    standardDeviation: stDev,
}: QualifyingGaussianChartProps) {

    const [xValues, setXValues] = useState([] as number[]);
    const [yValues, setYValues] = useState([] as (number | null)[]);

    useEffect(() => {
        const leftLimit = GAUSSIAN_MIN_MEAN - GAUSSIAN_GRAPH_MARGIN;
        const rightLimit = GAUSSIAN_MAX_MEAN + GAUSSIAN_GRAPH_MARGIN;

        const _xValues = [leftLimit];
        const stepSize = (rightLimit - leftLimit) / GAUSSIAN_GRAPH_STEPS;

        let currentTick = _xValues[0];

        for (let i = 0; i <= GAUSSIAN_GRAPH_STEPS; i++) {
            _xValues.push(truncateNumber(currentTick, 3));
            currentTick += stepSize;
        }

        const gaussian = new Gaussian(mean, Math.pow(stDev, 2));
        const _yValues = _xValues.map(x => {
            const pdf = gaussian.pdf(x);
            return pdf === Infinity ? null : pdf;
        })

        setXValues(_xValues);
        setYValues(_yValues);
    }, [mean, stDev]);

    return (
        <div className="qualifying-gaussian-chart">
            {xValues && yValues && <Line
                //height={40}
                //width={300}
                options={{
                    elements: {
                        line: {
                            tension: 0,
                        },
                        point: {
                            radius: 0,
                        },
                    },
                    scales: {
                        x: {
                            display: false,
                        },
                        y: {
                            display: false,
                            max: 6, //8,
                        },
                    },
                    events: [],
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 0,
                    }
                }}
                data={{
                    labels: xValues.map(x => truncateNumber(x, 2)),
                    datasets: [
                        {
                            label: "Qualifying",
                            data: yValues,
                            fill: {
                                value: 0,
                                above: "#a1032520",
                                below: '#00000000'
                            },
                            borderColor: "#a10325",
                            borderWidth: 1,
                            backgroundColor: "#a1032520",
                        }
                    ]
                }}
            />}
        </div>
    );
}

interface SimulatorSectionProps {
    teams: LeagueTeam[];
}

function SimulatorSection ({
    teams,
}: SimulatorSectionProps) {
    const drivers = getLeagueDrivers(teams);

    const [positions, setPositions] = useState(
        generateQualifyingTable(drivers)
    );

    return (
        <div className="simulator-section">
            <div className="title">Simulator</div>
            <div className="qualifying-list">
                {positions.map(p => <SimulatorSectionDriver
                    driver={p}
                    team={teams[p.team]}
                    highlight={p.position < 11}
                />)}
            </div>
            <ToolboxRow className="simulator-toolbox">
                <Button onClick={handleUpdate}>Update</Button>
            </ToolboxRow>
        </div>
    );

    function handleUpdate () {
        setPositions(generateQualifyingTable(drivers));
    }
}

interface SimulatorSectionDriverProps {
    driver: DriverRanking;
    team: LeagueTeam;
    highlight: boolean;
}

function SimulatorSectionDriver ({
    driver,
    team,
    highlight,
}: SimulatorSectionDriverProps) {
    const { dataPath } = useDataContext();

    const badgeImg = Files.getFilePath(
        dataPath, AssetFolder.teamBadges, team.badge
    );

    const classStr = getClassString(
        "qualifying-table-entry",
        driver.position === 1 && "first-position",
        highlight && "highlight",
    )

    return (
        <div className={classStr}>
            <div className="position">
                {driver.position}
            </div>
            <div className="driver">
                <div className="team-badge">
                    <img src={badgeImg} />
                </div>
                <div className="name">
                    {driver.driverInfo.name}
                </div>
            </div>
        </div>
    );
}



export default DriversTab;
