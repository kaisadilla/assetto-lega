import React from 'react';

export interface LabeledControlProps {
    label: string;
    required?: boolean;
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
    children,
}: LabeledControlProps) {
    return (
        <div className="default-control default-labeled-control">
            <div className="label">
                <label>{label}</label>
            </div>
            <div className="value">
                {children}
            </div>
        </div>
    );
}

export default LabeledControl;