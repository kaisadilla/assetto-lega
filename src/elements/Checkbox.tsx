import React from 'react';
import { getClassString } from 'utils';

export interface CheckboxProps {
    value?: boolean;
    readonly?: boolean;
    onChange?: (value: boolean) => void;
    className?: string;
}

function Checkbox ({
    value,
    readonly,
    onChange,
    className,
}: CheckboxProps) {
    const classStr = getClassString(
        "default-control",
        "default-checkbox",
        readonly && "readonly",
        className,
    );

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
                <span className="default-checkbox-checkmark" />
            </div>
        </label>
    );

    function handleChange (evt: React.ChangeEvent<HTMLInputElement>) {
        if (readonly) return;
        onChange?.(evt.target.checked);
    }
}

export default Checkbox;
