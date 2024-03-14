import React from 'react';
import Checkbox, { CheckboxProps } from './Checkbox';
import { getClassString } from 'utils';

export interface LabeledCheckboxProps extends CheckboxProps {
    label: string;
}

function LabeledCheckbox ({
    label,
    className,
    onChange,
    ...checkboxProps
}: LabeledCheckboxProps) {
    const classStr = getClassString(
        "default-labeled-checkbox",
        className,
    )

    return (
        <div className={classStr}>
            <Checkbox onChange={onChange} {...checkboxProps} />
            <div className="default-labeled-checkbox-label">
                {label}
            </div>
        </div>
    );
}

export default LabeledCheckbox;
