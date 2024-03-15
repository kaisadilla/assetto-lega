import CircularSlider from '@fseehawer/react-circular-slider';
import { CSS_VARIABLES } from 'context/useSettings';
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
        <div className={classStr} {...divProps}>
            <CircularSlider
                initialValue={value}
                min={0}
                max={359}
                onChange={(v: number) => onValueChange?.(v)}
                width={80}
                //data={WIND_DIRECTIONS}
                knobColor={`var(${CSS_VARIABLES.HighlightColor0})`}
                knobSize={22}
                knobDraggable={true}
                label=""
                labelColor="#eeeeee"
                valueFontSize="10pt"
                trackColor={`var(${CSS_VARIABLES.ComponentColorTheme3})`}
                progressSize={0}
                progressColorFrom={`var(${CSS_VARIABLES.ComponentColorTheme5})`}
                progressColorTo={`var(${CSS_VARIABLES.ComponentColorTheme5})`}
                trackSize={6}
                trackDraggable={false}
            />
        </div>
    );
}

export default DirectionCircleField;
