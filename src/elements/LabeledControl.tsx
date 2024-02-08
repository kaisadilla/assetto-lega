import React from 'react';
import { getClassString } from 'utils';

export interface LabeledControlProps {
    label: string;
    required?: boolean;
    className?: string;
    children?: React.ReactNode;
}

/**
 * Creates a component with a label and whatever is passed as children. The
 * label will be inside a class called "label" and the children, inside a class
 * called "value".
 * @returns 
 */
function LabeledControl ({
    label,
    required,
    className,
    children,
}: LabeledControlProps) {
    const classStr = getClassString(
        "default-control",
        "default-labeled-control",
        className,
    );

    return (
        <div className={classStr}>
            <div className="label">
                <label>{label}</label>
                {required && <span className="label-required">*</span>}
            </div>
            <div className="value">
                {children}
            </div>
        </div>
    );
}

export default LabeledControl;