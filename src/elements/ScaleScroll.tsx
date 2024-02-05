import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import Button from './Button';
import Icon from './Icon';

export interface ScaleScrollProps {
    min: number;
    max: number;
    value: number;
    onChange?: (value: number) => void;
    defaultValue?: number;
    marks?: number | readonly number[];
    showReset?: boolean;
}

function ScaleScroll ({
    min,
    max,
    value,
    defaultValue,
    onChange,
    marks,
    showReset = false,
}: ScaleScrollProps) {
    return (
        <div className="default-scale-scroll">
            <ReactSlider
                className="scale-scroll-main"
                min={min}
                max={max}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                marks={marks}
                trackClassName="scroll-track"
                thumbClassName="scroll-thumb"
                markClassName="scroll-mark"
            />
            {showReset && defaultValue !== undefined && (
                <Button className="reset-button" onClick={handleReset}>
                    <Icon name="fa-rotate-left" />
                </Button>
            )}
        </div>
    );

    function handleReset () {
        if (defaultValue !== undefined) {
            onChange?.(defaultValue);
        }
    }
}

export default ScaleScroll;