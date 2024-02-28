import React from 'react';
import { getClassString } from 'utils';

export interface ToggleButtonProps {
    value: boolean;
    disabled?: boolean;
    onChange?: (value: boolean) => void;
    className?: string;
    children?: React.ReactNode;
}

function ToggleButton ({
    value,
    disabled,
    onChange,
    className,
    children,
}: ToggleButtonProps) {
    const classStr = getClassString(
        "default-control",
        "default-button",
        "default-toggle-button",
        disabled && "disabled",
        value && "toggled-on",
        className,
    );

    return (
        <button
            className={classStr}
            onClick={() => onChange?.(!value)}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default ToggleButton;
