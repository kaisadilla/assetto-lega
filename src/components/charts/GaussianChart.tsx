import React, { useEffect, useState } from 'react';

import { Line } from 'react-chartjs-2';
import { truncateNumber } from 'utils';
import { Gaussian } from 'ts-gaussian';

export interface GaussianChartProps {
    mean: number;
    standardDeviation: number;
}

function GaussianChart ({
    mean,
    standardDeviation: stDev,
}: GaussianChartProps) {
    const [xValues, setXValues] = useState<number[]>([]);
    const [yValues, setYValues] = useState<(number | null)[]>([]);

    useEffect(() => {
        // chart limits
        let leftLimit = mean - (stDev * 6);
        let rightLimit = mean + (stDev * 6);

        let ticks = [leftLimit];
        let steps = 100; // steps corresponds to the size of the output array
        let stepSize = truncateNumber((rightLimit - leftLimit) / steps, 4);

        let tickVal = leftLimit;

        for (let i = 0; i <= steps; i++) {
            ticks.push(truncateNumber(tickVal, 4));
            tickVal += stepSize;
        }

        setXValues(ticks);
    }, [mean, stDev]);

    useEffect(() => {
        // todo: use pdf(x)
        const densityNormal = (value: number, mean: number, stDev: number) => {
            const SQRT_2_PI = Math.sqrt(2 * Math.PI);
            const z = (value - (mean || 0)) / stDev;

            return Math.exp(-0.5 * z * z) / (stDev * SQRT_2_PI);
        };

        let yValues = xValues.map((item: number) => {
            //const pdfValue = densityNormal(item, mean, stDev);
            const pdfValue = new Gaussian(mean, Math.pow(stDev, 2)).pdf(item);
            return pdfValue === Infinity ? null : pdfValue;
        });

        setYValues(yValues);
    }, [xValues])

    return (
        <div>
            {yValues && xValues && <div>
                <Line
                    options={{
                        elements: {
                            line: {
                                tension: 0,
                                borderWidth: 0.5,
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
                            }
                        }
                        
                    }}
                    data={{
                        labels: xValues.map((x, i) => truncateNumber(x, 2)),
                        datasets: [
                            {
                                label: "Dataset 1",
                                data: yValues,
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            }
                        ]
                    }}
                />
            </div>}
        </div>
    );
}

export default GaussianChart;
