import CircularSlider from '@fseehawer/react-circular-slider';
import React from 'react';
import { getClassString } from 'utils';

const WIND_DIRECTIONS = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW"
]

export interface DirectionCircleFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    onValueChange?: (value: number) => void;
}

function DirectionCircleField ({
    value,
    onValueChange,
    className,
    ...divProps
}: DirectionCircleFieldProps) {
    const classStr = getClassString(
        "default-direction-circle-field",
        className,
    );

    return (
        <div className={classStr} {...divProps} style={{width: "32px"}}>
            <CircularSlider
                initialValue={value}
                onChange={(v: number) => onValueChange?.(v)}
                width={80}
                data={WIND_DIRECTIONS}
                knobColor="var(--highlight-color)"
                knobSize={22}
                knobDraggable={true}
                label="."
                labelColor="#eeeeee"
                valueFontSize="10pt"
                trackColor="var(--component-color-3)"
                progressSize={0}
                progressColorFrom="var(--component-color-5)"
                progressColorTo="var(--component-color-5)"
                trackSize={6}
                trackDraggable={false}
            />
        </div>
    );
}

export default DirectionCircleField;
