import React, { useRef, useState } from 'react';
import ReactSlider from 'react-slider';
import { getClassString } from 'utils';

export interface RangeSliderProps {
    value: number;
    min: number;
    max: number;
    deviation: number;
    minDeviation: number;
    maxDeviation: number;
    step?: number;
    readonly?: boolean;
    onValueChange?: (value: number) => void;
    onDeviationChange?: (deviation: number) => void;
    className?: string;
    tabIndex?: number;
}

function RangeSlider ({
    value,
    deviation,
    min,
    max,
    minDeviation,
    maxDeviation,
    step = 0.1,
    readonly = false,
    onValueChange,
    onDeviationChange,
    className,
    tabIndex = 1,
}: RangeSliderProps) {
    const classStr = getClassString(
        "default-control",
        "default-range-slider",
        className,
    )

    return (
        <div className={classStr}>
            <div className="slider-main-container">
                <ReactSlider
                    className="slider-main"
                    min={min}
                    max={max}
                    value={value}
                    onChange={handleMainChange}
                    trackClassName="slider-track"
                    thumbClassName="slider-thumb"
                    markClassName="slider-mark"
                    step={step}
                    renderThumb={(props, state) => (
                        <div {...props}>
                            <ReactSlider
                                className="slider-range slider-range-left"
                                min={-maxDeviation}
                                max={-minDeviation}
                                value={-deviation}
                                onChange={val => handleDevChange(-val)}
                                trackClassName="slider-track"
                                thumbClassName="slider-thumb"
                                markClassName="slider-mark"
                                step={0.01}
                                renderThumb={(props, state) => <div {...props}></div>}
                            />
                            <ReactSlider
                                className="slider-range slider-range-right"
                                min={minDeviation}
                                max={maxDeviation}
                                value={deviation}
                                onChange={val => handleDevChange(val)}
                                trackClassName="slider-track"
                                thumbClassName="slider-thumb"
                                markClassName="slider-mark"
                                step={0.01}
                            />
                        </div>
                    )}
                />
            </div>
        </div>
    );

    function handleMainChange (v: number) {
        onValueChange?.(v);
    }

    function handleDevChange (v: number) {
        onDeviationChange?.(v);
    }
}

export default RangeSlider;
