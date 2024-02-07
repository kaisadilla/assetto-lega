import React from 'react';
import { getClassString } from 'utils';

export interface ButtonProps {
    disabled?: boolean;
    highlighted?: boolean;
    onClick?: (evt: any) => void;
    className?: string;
    children?: React.ReactNode;
}

function Button ({
    disabled,
    highlighted,
    onClick,
    className,
    children,
}: ButtonProps) {
    const classStr = getClassString(
        "default-control",
        "default-button",
        disabled && "disabled",
        highlighted && "highlighted",
        className,
    );

    return (
        <button
            className={classStr}
            onClick={(evt) => onClick?.(evt)}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;