import React from 'react';
import { getClassString } from 'utils';

export interface NumericBoxProps {
    value?: number | null;
    allowEmpty?: boolean;
    allowDecimals?: boolean;
    maxDecimalPlaces?: number;
    showArrows?: boolean;
    step?: number;
    onChange?: (value: number | null) => void;
    className?: string;
}

function NumericBox ({
    value = 0,
    allowEmpty,
    allowDecimals,
    maxDecimalPlaces,
    showArrows,
    step,
    onChange,
    className,
}: NumericBoxProps) {
    const classStr = getClassString(
        "default-control",
        "default-typebox",
        "default-numeric-box",
        className,
    );

    return (
        <div className={classStr}>
            <input
                className="input-field"
                type="numeric"
                value={value ?? ""}
                onChange={handleChange}
            />
        </div>
    );

    function handleChange (evt: React.ChangeEvent<HTMLInputElement>) {
        if (onChange === undefined) return;

        const str = evt.target.value;

        if (str === "") {
            if (allowEmpty) {
                onChange(null);
            }
        }

        // if the string contains a decimal point.
        if (str.includes('.')) {
            // if it can't.
            if (!allowDecimals) return;

            const points = str.match(/\./g);
            // when there's more than one decimal point.
            if (!points || points.length && points.length > 1) {
                return;
            }

            if (maxDecimalPlaces !== undefined) {
                const decimalPart = str.split('.')[1];
                // when there's more decimals than allowed.
                if (decimalPart.length > maxDecimalPlaces) {
                    return;
                }
            }
        }
        const num = parseFloat(str);

        if (isNaN(num)) {
            if (!allowEmpty && str === "") {
                onChange(0);
                return;
            }
            else {
                return;
            }
        }

        onChange(num);
    }
}

export default NumericBox;