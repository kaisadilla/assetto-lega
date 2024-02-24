import React from 'react';
import { getClassString } from 'utils';

export interface DropdownProps {
    children?: React.ReactNode;
    className?: string;
    tabIndex?: number;
}

function Dropdown ({
    children,
    className,
    tabIndex,
}: DropdownProps) {
    const classStr = getClassString(
        "default-dropdown",
        className,
    )

    return (
        <div className={classStr} tabIndex={tabIndex}>
            {children}
        </div>
    );
}

export default Dropdown;
