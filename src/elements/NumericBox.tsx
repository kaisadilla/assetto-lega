import React, { useEffect, useState } from 'react';
import { clampNumber, getClassString } from 'utils';

export interface NumericBoxProps {
    value?: number | null;
    allowEmpty?: boolean;
    allowDecimals?: boolean;
    maxDecimalPlaces?: number;
    showArrows?: boolean;
    step?: number;
    minValue?: number;
    maxValue?: number;
    onChange?: (value: number | null) => void;
    className?: string;
    tabIndex?: number;
}

function NumericBox ({
    value = 0,
    allowEmpty,
    allowDecimals,
    maxDecimalPlaces,
    showArrows,
    step,
    minValue,
    maxValue,
    onChange,
    className,
    tabIndex = 1,
}: NumericBoxProps) {
    // the value typed by the user, which may or may not be a valid number.
    const [tempValue, setTempValue] = useState((value ?? "").toString());

    useEffect(() => {
        // update the displayed text when the value given in the props changes,
        // but only if the current text isn't a valid representation of such
        // value.
        if (parseFloat(tempValue) !== value) {
            setTempValue((value ?? "").toString());
        }
    }, [value]);

    const validChars = allowDecimals ? /^[0-9\.]*$/ : /^[0-9]*$/;

    const classStr = getClassString(
        "default-control",
        "default-typebox",
        "default-numeric-box",
        className,
    );

    return (
        <div className={classStr} onBlur={handleBlur} tabIndex={tabIndex}>
            <input
                className="input-field"
                type="numeric"
                value={tempValue}
                onChange={handleChange}
            />
        </div>
    );

    function handleChange (evt: React.ChangeEvent<HTMLInputElement>) {
        const str = evt.target.value;
        
        // when there's an invalid character, ignore changes.
        if (validChars.test(str) === false) return;

        const points = str.match(/\./g);
        // find decimal points.
        if (points && points.length) {
            // when there's more than one decimal point, ignore changes.
            if (points?.length > 1) {
                return;
            }
            // if there's a point, check max amount of decimal places
            if (maxDecimalPlaces !== undefined) {
                const decimalPart = str.split('.')[1];
                // when there's more decimals than allowed, ignore changes.
                if (decimalPart.length > maxDecimalPlaces) {
                    return;
                }
            }
        }

        setTempValue(str);

        // trigger onChange value if the current value is a valid one.
        let num = parseFloat(str);

        if (isNaN(num)) {
            return;
        }

        if (minValue && num < minValue) {
            return;
        }
        if (maxValue && num > maxValue) {
            return;
        }

        onChange?.(num);
    }

    function handleBlur () {
        let num = parseFloat(tempValue);

        if (isNaN(num)) {
            if (!allowEmpty && tempValue === "") {
                num = 0;
            }
            else {
                return;
            }
        }

        if (minValue && num < minValue) {
            num = minValue;
        }
        if (maxValue && num > maxValue) {
            num = maxValue;
        }

        onChange?.(num);

        setTempValue((value ?? "").toString());
    }
}

export default NumericBox;