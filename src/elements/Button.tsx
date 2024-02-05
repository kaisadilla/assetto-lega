import React from 'react';
import "styles/elements/button.scss";
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