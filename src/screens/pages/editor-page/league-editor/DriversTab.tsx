import GaussianChart from 'components/charts/GaussianChart';
import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { Files } from 'data/files';
import { League, LeagueTeam, LeagueTeamDriver, LeagueTeamDriverQualifying } from 'data/schemas';
import Button from 'elements/Button';
import MaterialSymbol from 'elements/MaterialSymbol';
import NavBar from 'elements/NavBar';
import NumericBox from 'elements/NumericBox';
import ProportionNumericBox from 'elements/ProportionNumericBox';
import RangeSlider from 'elements/RangeSlider';
import Slider from 'elements/Slider';
import ToggleButton from 'elements/ToggleButton';
import ToolboxRow from 'elements/ToolboxRow';
import { DriverRanking, generateQualifyingTable, getLeagueDrivers } from 'logic/raceStats';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
                <NavBar className="nav-bar-header" get={section} set={setSection}>
                    <NavBar.Item text="edit drivers" index={DriversTabSection.Editor} />
                    <NavBar.Item text="chart" index={DriversTabSection.Chart} />
                </NavBar>
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
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [isListScrollShown, setListScrollShown] = useState(false);

    const [isStrengthUnlocked, setStrengthUnlocked] = useState(false);
    const [isAggressionUnlocked, setAggressionUnlocked] = useState(false);

    const $div = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize)
        return (() => {
            window.removeEventListener('resize', handleWindowResize);
        });
    });

    useEffect(() => {
        const n = $div.current;
        if (!n) return;

        const scrollShown = n.scrollHeight > n.clientHeight;
        setListScrollShown(scrollShown);
    }, [windowHeight, teams.length, $div.current]);

    const headerClassStr = getClassString(
        "driver-list-header",
        "driver-list-row",
        isListScrollShown && "scroll-shown"
    );

    return (
        <div className="driver-list">
            <div className={headerClassStr}>
                <div className="cell-badge">Team</div>
                <div className="cell-name">Name</div>
                <div className="cell-strength unlockable-field">
                    <span>Strength</span>
                    <ToggleButton
                        value={isStrengthUnlocked}
                        onChange={setStrengthUnlocked}
                    >
                        <MaterialSymbol
                            symbol={isStrengthUnlocked ? 'lock_open' : 'lock'}
                        />
                    </ToggleButton>
                </div>
                <div className="cell-aggression unlockable-field">
                    <span>Aggression</span>
                    <ToggleButton
                        value={isAggressionUnlocked}
                        onChange={setAggressionUnlocked}
                    >
                        <MaterialSymbol
                            symbol={isAggressionUnlocked ? 'lock_open' : 'lock'}
                        />
                    </ToggleButton>
                </div>
                <div className="cell-qualifying">Qualifying</div>
                {/*<div className="cell-qualifying-numbers"></div>*/}
                <div className="cell-disaster">Disaster</div>
            </div>
            <div ref={$div} className="driver-list-body">
                {teams.map((team, t) => (
                    <>
                        {team.drivers.map((driver, d) => (
                            <DriverEntry
                                driver={driver}
                                team={team}
                                onChange={(field, value) => handleDriverChange(
                                    t, d, field, value
                                )}
                                strengthEnabled={isStrengthUnlocked}
                                aggressionEnabled={isAggressionUnlocked}
                            />
                        ))}
                    </>
                ))}
            </div>
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

    function handleWindowResize () {
        setWindowHeight(window.innerHeight);
    }
}


interface DriverEntryProps {
    driver: LeagueTeamDriver;
    team: LeagueTeam;
    onChange: (field: keyof LeagueTeamDriver, value: any) => void;
    strengthEnabled: boolean,
    aggressionEnabled: boolean,
}

function DriverEntry ({
    driver,
    team,
    onChange,
    strengthEnabled,
    aggressionEnabled,
}: DriverEntryProps) {
    const { dataPath } = useDataContext();

    const badgeImg = Files.getFilePath(
        dataPath, AssetFolder.teamBadges, team.badge
    );

    const textColor = chooseW3CTextColor(team.color);

    const classStr = getClassString(
        "driver-entry",
        "driver-list-row",
        textColor === 'black' && "driver-entry-text-black",
        textColor === 'white' && "driver-entry-text-white",
    );

    const style = {
        backgroundColor: team.color,
        borderColor: team.color,
    }

    return (
        <div className={classStr} style={style}>
            <div className="cell-badge driver-team-badge">
                <img src={badgeImg} />
            </div>
            <div className="cell-name driver-name">
                {driver.name}
            </div>
            <div className="cell-strength driver-stat">
                <Slider
                    value={driver.strength}
                    min={70}
                    max={100}
                    onChange={val => handleChange('strength', val)}
                    showNumberBox
                    readonly={strengthEnabled === false}
                    textColor={textColor}
                />
            </div>
            <div className="cell-strength driver-stat">
                <Slider
                    value={driver.aggression}
                    min={0}
                    max={100}
                    onChange={val => handleChange('aggression', val)}
                    showNumberBox
                    readonly={aggressionEnabled === false}
                    textColor={textColor}
                />
            </div>
            <div className="cell-qualifying driver-qualifying-graph">
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
            <div className="cell-qualifying-numbers driver-qualifying-stats">
                <div className="stat">
                    <span className="symbol">μ: </span>
                    <span className="value">
                        <NumericBox
                            className="value-input"
                            value={driver.qualifying.mean}
                            allowDecimals
                            maxDecimalPlaces={2}
                            min={GAUSSIAN_MIN_MEAN}
                            max={GAUSSIAN_MAX_MEAN}
                            step={GAUSSIAN_SLIDER_STEP}
                            onChange={n => handleQualifyingChange('mean', n ?? 0.5)}
                            textColor={textColor}
                        />
                    </span>
                </div>
                <div className="stat">
                    <span className="symbol">σ: </span>
                    <span className="value">
                        <NumericBox
                            className="value-input"
                            value={driver.qualifying.deviation}
                            allowDecimals
                            maxDecimalPlaces={2}
                            min={GAUSSIAN_MIN_MEAN}
                            max={GAUSSIAN_MAX_MEAN}
                            step={GAUSSIAN_SLIDER_STEP}
                            onChange={
                                n => handleQualifyingChange('deviation', n ?? 0.25)
                            }
                            textColor={textColor}
                        />
                    </span>
                </div>
            </div>
            <div className="cell-disaster driver-chance">
                <ProportionNumericBox
                    value={driver.qualifying.disasterChance}
                    onChange={n => handleQualifyingChange('disasterChance', n)}
                    textColor={textColor}
                />
            </div>
        </div>
    );

    function handleChange (field: keyof LeagueTeamDriver, value: number) {
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
            <h3 className="h3-header">Simulator</h3>
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
                    {driver.disaster && <MaterialSymbol
                        className="disaster-symbol"
                        symbol='brightness_alert'
                    />}
                </div>
            </div>
        </div>
    );
}



export default DriversTab;
