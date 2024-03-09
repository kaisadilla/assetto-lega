import React, { CSSProperties } from 'react';
import { getClassString } from 'utils';

export interface DropdownProps {
    children?: React.ReactNode;
    className?: string;
    style?: CSSProperties;
    tabIndex?: number;
}

function Dropdown ({
    children,
    className,
    style,
    tabIndex,
}: DropdownProps) {
    const classStr = getClassString(
        "default-dropdown",
        className,
    )

    return (
        <div className={classStr} tabIndex={tabIndex} style={style}>
            {children}
        </div>
    );
}

export default Dropdown;
