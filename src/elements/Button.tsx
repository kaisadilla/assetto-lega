import React from 'react';
import "styles/elements/button.scss";

export interface ButtonProps {
    disabled?: boolean;
    onClick?: (evt: any) => void;
    children?: React.ReactNode;
}

function Button ({
    disabled = false,
    onClick = () => {},
    children,
}: ButtonProps) {
    return (
        <button
            className="default-button"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;