import GaussianChart from 'components/charts/GaussianChart';
import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { Files } from 'data/files';
import { League } from 'data/schemas';
import Slider from 'elements/Slider';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Gaussian } from 'ts-gaussian';
import { truncateNumber } from 'utils';

export interface DriversTabProps {
    league: League;
    onChange: (field: keyof League, value: any) => void;
}

function DriversTab ({
    league,
    onChange,
}: DriversTabProps) {
    const { dataPath } = useDataContext();

    const badgeImg = Files.getFilePath(dataPath, AssetFolder.teamBadges, "@red-bull");

    return (
        <div className="editor-tab drivers-tab">
            <div className="drivers-section">
                <div className="driver-list">
                    <div className="driver-entry">
                        <div className="driver-team-badge">
                            <img src={badgeImg} />
                        </div>
                        <div className="driver-name">
                            Max Verstappen
                        </div>
                        <div className="driver-stat">
                            <Slider
                                value={98.5}
                                min={70}
                                max={100}
                                onChange={val => {}}
                                showNumberBox
                            />
                        </div>
                        <div className="driver-stat">
                            <Slider
                                value={95.1}
                                min={70}
                                max={100}
                                onChange={val => {}}
                                showNumberBox
                            />
                        </div>
                        <div className="driver-qualifying-graph">
                            <QualifyingGaussianChart
                                mean={0.05}
                                standardDeviation={0.12}
                            />
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
                </div>
                {/*<GaussianChart
                    mean={1}
                    standardDeviation={2}
                />*/}
            </div>
            <div className="simulator-section">
                <h3>Simulator</h3>
            </div>
        </div>
    );
}

interface QualifyingGaussianChartProps {
    mean: number;
    standardDeviation: number;
}

function QualifyingGaussianChart ({
    mean,
    standardDeviation: stDev,
}: QualifyingGaussianChartProps) {
    const STEPS = 100;

    const [xValues, setXValues] = useState([] as number[]);
    const [yValues, setYValues] = useState([] as (number | null)[]);

    useEffect(() => {
        const leftLimit = -0.5;
        const rightLimit = 1.5;

        const _xValues = [leftLimit];
        const stepSize = (rightLimit - leftLimit) / STEPS;

        let currentTick = _xValues[0];

        for (let i = 0; i <= STEPS; i++) {
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
                height={40}
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
                        },
                    },
                    events: [],
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    responsive: true,
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


export default DriversTab;
