import React, { useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { TextColor, countDecimalPlaces, getClassString, isInteger } from 'utils';
import NumericBox from './NumericBox';

const LONG_STEP_KEY = "Control";

interface _CommonSliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    readonly?: boolean;
    showFillTrack?: boolean;
    //logarithmic?: boolean;
    onChange?: (value: number) => void;
    showNumberBox?: boolean | 'left' | 'right';
    className?: string;
    tabIndex?: number;
    textColor?: TextColor;
}

export interface SliderProps extends _CommonSliderProps {
    mode: 'fill' | 'thumb';
    longStep?: number;
    markCount?: number;
    markSpacing?: number;
}

function Slider ({
    mode,
    value,
    min,
    max,
    step = 0.1,
    longStep = step,
    readonly = false,
    showFillTrack = false,
    //logarithmic = false,
    markCount,
    markSpacing,
    onChange,
    showNumberBox = false,
    className,
    tabIndex = 1,
    textColor,
}: SliderProps) {
    const [isLongStep, setLongStep] = useState(false);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    let marks = undefined;
    step = isLongStep ? longStep : step;

    if (markCount !== undefined) {
        marks = [];
        for (let i = 0; i <= markCount; i++) {
            const markPos = min + ((max / markCount) * i);
            if (markPos > max) break;

            marks.push(markPos);
        }
    }
    else if (markSpacing !== undefined) {
        marks = [];
        for (let i = 0; i <= max; i += markSpacing) {
            marks.push(i);
        }
    }
    
    if (mode === 'fill') {
        return <_FillSlider
            sliderDisplayValue={getSliderDisplayValue()}
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
            sliderDisplayValue={getSliderDisplayValue()}
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

    function getSliderDisplayValue () {
        return value;
    }

    function handleChange (newValue: number) {
        if (readonly) return;

        onChange?.(newValue);
    }

    function handleKeyDown (evt: KeyboardEvent) {
        if (evt.key === LONG_STEP_KEY) {
            setLongStep(true);
        }
    }

    function handleKeyUp (evt: KeyboardEvent) {
        if (evt.key === LONG_STEP_KEY) {
            setLongStep(false);
        }
    }
}

interface _FillSliderProps extends _CommonSliderProps {
    sliderDisplayValue: number;
}

function _FillSlider ({
    sliderDisplayValue,
    value,
    min,
    max,
    step = 0.01,
    readonly,
    onChange,
    showNumberBox,
    className,
    tabIndex,
    textColor,
}: _FillSliderProps) {
    const classStr = getClassString(
        "default-control",
        "default-slider",
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

interface _ThumbSliderProps extends _CommonSliderProps {
    sliderDisplayValue: number;
    marks: number[] | undefined;
    step: number;
}

function _ThumbSlider ({
    sliderDisplayValue,
    value,
    min,
    max,
    step,
    readonly,
    showFillTrack,
    marks,
    onChange,
    showNumberBox,
    className,
    tabIndex,
    textColor,
}: _ThumbSliderProps) {
    const classStr = getClassString(
        "default-control",
        "default-slider",
        "default-thumb-slider",
        readonly && "readonly",
        textColor === 'black' && "text-black",
        textColor === 'white' && "text-white",
        className,
    );

    const numboxClass = getClassString(
        "number-box-container",
        showNumberBox === 'left' && "number-box-left"
    )

    return (
        <div className={classStr}>
            <div className="slider-area">
                <div className="slider-container" tabIndex={tabIndex}>
                    <ReactSlider
                        className="slider-main"
                        min={min}
                        max={max}
                        value={sliderDisplayValue}
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
            {showNumberBox && <div className={numboxClass}>
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
