import React from 'react';
import ReactSlider from 'react-slider';
import { TextColor, countDecimalPlaces, getClassString, isInteger } from 'utils';
import NumericBox from './NumericBox';

export interface SliderProps {
    mode: 'fill' | 'thumb';
    value: number;
    min: number;
    max: number;
    step?: number;
    readonly?: boolean;
    showFillTrack?: boolean;
    markCount?: number;
    markSpacing?: number;
    onChange?: (value: number) => void;
    showNumberBox?: boolean;
    className?: string;
    tabIndex?: number;
    textColor?: TextColor;
}

function Slider ({
    mode,
    value,
    min,
    max,
    step = 0.1,
    readonly = false,
    showFillTrack = false,
    markCount,
    markSpacing,
    onChange,
    showNumberBox = false,
    className,
    tabIndex = 1,
    textColor,
}: SliderProps) {

    let marks = undefined;

    if (markCount !== undefined) {
        const markStep = (max - min) / markCount;
        marks = [];
        for (let i = min; i <= max + 0.01; i += markStep) {
            marks.push(i);
        }
        console.log(max);
        console.log(marks);
        //marks = [...Array(markCount).keys()].map(n => Number(n));
    }
    else if (markSpacing !== undefined) {

    }
    
    if (mode === 'fill') {
        return <_FillSlider
            value={value}
            min={min}
            max={max}
            step={step}
            readonly={readonly}
            onChange={handleChange}
            showNumberBox={showNumberBox}
            className={className}
            tabIndex={tabIndex}
            textColor={textColor}
        />
    }
    else if (mode === 'thumb') {
        return <_ThumbSlider
            value={value}
            min={min}
            max={max}
            step={step}
            readonly={readonly}
            showFillTrack={showFillTrack}
            marks={marks}
            onChange={handleChange}
            showNumberBox={showNumberBox}
            className={className}
            tabIndex={tabIndex}
            textColor={textColor}
        />
    }
    else {
        throw `Invalid mode`;
    }

    function handleChange (value: number) {
        if (readonly) return;

        onChange?.(value);
    }
}

interface _FillSliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    readonly?: boolean;
    onChange?: (value: number) => void;
    showNumberBox?: boolean;
    className?: string;
    tabIndex?: number;
    textColor?: TextColor;
}

function _FillSlider ({
    value,
    min,
    max,
    step = 0.1,
    readonly = false,
    onChange,
    showNumberBox = false,
    className,
    tabIndex = 1,
    textColor,
}: _FillSliderProps) {
    const classStr = getClassString(
        "default-control",
        "default-fill-slider",
        readonly && "readonly",
        textColor === 'black' && "text-black",
        textColor === 'white' && "text-white",
        className,
    )

    return (
        <div className={classStr}>
            <div className="slider-container" tabIndex={tabIndex}>
                <ReactSlider
                    className="slider-main"
                    min={min}
                    max={max}
                    value={value}
                    onChange={onChange}
                    trackClassName="slider-track"
                    thumbClassName="slider-thumb"
                    markClassName="slider-mark"
                    step={step}
                    disabled={readonly}
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
                    onChange={onChange}
                    readonly={readonly}
                    textColor={textColor}
                />
            </div>}
        </div>
    );
}

interface _ThumbSliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    readonly?: boolean;
    showFillTrack?: boolean;
    marks?: number[];
    onChange?: (value: number) => void;
    showNumberBox?: boolean;
    className?: string;
    tabIndex?: number;
    textColor?: TextColor;
}

function _ThumbSlider ({
    value,
    min,
    max,
    step = 0.1,
    readonly = false,
    showFillTrack,
    marks,
    onChange,
    showNumberBox = false,
    className,
    tabIndex = 1,
    textColor,
}: _ThumbSliderProps) {
    const classStr = getClassString(
        "default-control",
        "default-thumb-slider",
        readonly && "readonly",
        textColor === 'black' && "text-black",
        textColor === 'white' && "text-white",
        className,
    );

    return (
        <div className={classStr}>
            <div className="slider-area">
                <div className="slider-container" tabIndex={tabIndex}>
                    <ReactSlider
                        className="slider-main"
                        min={min}
                        max={max}
                        value={value}
                        onChange={onChange}
                        trackClassName={getClassString(
                            "slider-track",
                            showFillTrack && "show-fill-track",
                        )}
                        thumbClassName="slider-thumb"
                        markClassName="slider-mark"
                        step={step}
                        disabled={readonly}
                        marks={marks}
                    />
                </div>
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
                    onChange={onChange}
                    readonly={readonly}
                    textColor={textColor}
                />
            </div>}
        </div>
    );
}


export default Slider;
