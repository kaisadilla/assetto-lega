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
    readonly, // TODO: don't ignore readonly.
    onChange,
    className,
}: CheckboxProps) {
    const classStr = getClassString(
        "default-control",
        "default-checkbox",
        className,
    );

    return (
        <label className={classStr}>
            <div className="default-checkbox-container">
                <input
                    className="default-checkbox-input"
                    type="checkbox"
                    checked={value}
                    onChange={evt => onChange?.(evt.target.checked)}
                />
                <span className="default-checkbox-checkmark" />
            </div>
        </label>
    );
}

export default Checkbox;
