import LabeledControl from 'elements/LabeledControl';
import Slider from 'elements/Slider';
import React from 'react';
import { getClassString, timeNumberToString, timeStringToNumber } from 'utils';

export interface HourSliderProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    readonly?: boolean;
    onValueChange?: (hour: number) => void;
}

function HourSlider ({
    value,
    readonly = false,
    onValueChange,
    className,
    ...rest
}: HourSliderProps) {
    const HOUR_TRACK_MULT = 24;

    const classStr = getClassString(
        "hour-slider",
        className,
    )

    return (
        <div className={classStr} {...rest}>
            <Slider
                mode='thumb'
                className="time-slider"
                value={value * HOUR_TRACK_MULT}
                onChange={v => onValueChange?.(v / HOUR_TRACK_MULT)}
                min={timeStringToNumber("00:00")! * HOUR_TRACK_MULT}
                max={timeStringToNumber("24:00")! * HOUR_TRACK_MULT - 0.0001}
                step={0.0001}
                longStep={1}
                showFillTrack
                markCount={24}
                readonly={readonly}
            />
            <div className="hour-text">
                {timeNumberToString(value)}
            </div>
        </div>
    );
}

export default HourSlider;
