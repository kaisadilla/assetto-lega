import React, { CSSProperties } from 'react';
import { chooseW3CTextColor, getClassString } from 'utils';

export interface CheckboxProps {
    value?: boolean;
    readonly?: boolean;
    onChange?: (value: boolean) => void;
    checkboxColor?: string;
    className?: string;
}

function Checkbox ({
    value,
    readonly,
    onChange,
    checkboxColor,
    className,
}: CheckboxProps) {
    const classStr = getClassString(
        "default-control",
        "default-checkbox",
        readonly && "readonly",
        className,
    );

    const checkboxBgStyle = {} as CSSProperties;
    let checkmarkClass = "default-checkbox-checkmark";

    if (value && checkboxColor) {
        const textColor = chooseW3CTextColor(checkboxColor);

        checkboxBgStyle.backgroundColor = checkboxColor;
        checkmarkClass = getClassString(
            checkmarkClass,
            `color-${textColor}`
        );
    }
    
    return (
        <label className={classStr}>
            <div className="default-checkbox-container">
                <input
                    className="default-checkbox-input"
                    type="checkbox"
                    checked={value}
                    onChange={handleChange}
                    readOnly={readonly}
                />
                <span
                    className={checkmarkClass}
                    style={checkboxBgStyle}
                />
            </div>
        </label>
    );

    function handleChange (evt: React.ChangeEvent<HTMLInputElement>) {
        if (readonly) return;
        onChange?.(evt.target.checked);
    }
}

export default Checkbox;
