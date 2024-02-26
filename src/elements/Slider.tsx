import React from 'react';
import ReactSlider from 'react-slider';
import { countDecimalPlaces, getClassString, isInteger } from 'utils';
import NumericBox from './NumericBox';

export interface SliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    readonly?: boolean;
    onChange?: (value: number) => void;
    showNumberBox?: boolean;
    className?: string;
    tabIndex?: number;
}

function Slider ({
    value,
    min,
    max,
    step = 0.1,
    readonly = false, // TODO: Implement
    onChange,
    showNumberBox = false,
    className,
    tabIndex = 1,
}: SliderProps) {
    const classStr = getClassString(
        "default-control",
        "default-slider",
        className,
    )

    return (
        <div className={classStr}>
            <div className="slider-container">
                <ReactSlider
                    className="slider-main"
                    min={min}
                    max={max}
                    value={value}
                    onChange={handleChange}
                    trackClassName="slider-track"
                    thumbClassName="slider-thumb"
                    markClassName="slider-mark"
                    step={step}
                />
            </div>
            {showNumberBox && <div className="number-box-container">
                <NumericBox
                    className="number-box"
                    value={value}
                    min={min}
                    max={max}
                    allowDecimals={isInteger(step) === false}
                    maxDecimalPlaces={countDecimalPlaces(step)}
                    step={step}
                    onChange={handleChange}
                />
            </div>}
        </div>
    );

    function handleChange (value: number | null) {
        if (value === null) return;

        onChange?.(value);
    }
}

export default Slider;
