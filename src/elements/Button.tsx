import React from 'react';
import "styles/elements/button.scss";
import { getClassString } from 'utils';

export interface ButtonProps {
    disabled?: boolean;
    onClick?: (evt: any) => void;
    children?: React.ReactNode;
    className?: string;
}

function Button ({
    disabled,
    onClick,
    children,
    className,
}: ButtonProps) {
    const classStr = getClassString(
        "default-button",
        disabled && "disabled",
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