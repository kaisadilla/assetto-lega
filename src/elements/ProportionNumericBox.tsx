import React, { useEffect, useState } from 'react';
import { TextColor, getClassString, truncateNumber } from 'utils';
import NumericBox from './NumericBox';

export interface ProportionNumericBoxProps {
    value: number;
    decimalPlaces?: number;
    readonly?: boolean;
    onChange?: (value: number) => void;
    className?: string;
    tabIndex?: number;
    textColor?: TextColor;
}

function ProportionNumericBox ({
    value,
    decimalPlaces = 3,
    readonly = false,
    onChange,
    className,
    tabIndex = 1,
    textColor,
}: ProportionNumericBoxProps) {
    const [proportion, setProportion] = useState(1 / value);

    useEffect(() => {
        setProportion(truncateNumber(1 / value, 0));
    }, [value]);

    const classStr = getClassString(
        "default-control",
        "default-proportion-numeric-box",
        readonly && "readonly",
        textColor === 'black' && "text-black",
        textColor === 'white' && "text-white",
        className,
    )

    return (
        <div className={classStr}>
            <div className="value">
                <NumericBox
                    value={value}
                    min={0}
                    max={1}
                    onChange={handleMagnitudeChange}
                    allowDecimals
                    maxDecimalPlaces={decimalPlaces}
                    readonly={readonly}
                    textColor={textColor}
                />
            </div>
            <div className="proportion">
                <span className="proportion-dividend">1/</span>
                <NumericBox
                    className="proportion-divisor"
                    value={proportion}
                    min={1}
                    onChange={handleProportionChange}
                    onBlur={handleProportionBlur}
                    readonly={readonly}
                    textColor={textColor}
                />
            </div>
        </div>
    );

    function handleMagnitudeChange (magnitude: number) {
        onChange?.(magnitude);
    }

    function handleProportionChange (proportion: number) {
        setProportion(proportion);
    }

    function handleProportionBlur (proportion: number) {
        const value = truncateNumber(1 / proportion, decimalPlaces);
        onChange?.(value);
    }
}

export default ProportionNumericBox;
