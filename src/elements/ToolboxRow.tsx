import React from 'react';
import { getClassString } from 'utils';

export interface ToolboxRowProps {
    className?: string;
    children?: React.ReactNode;
}

function ToolboxRow ({
    className,
    children,
}: ToolboxRowProps) {
    const classStr = getClassString(
        "default-toolbox-row",
        className,
    )

    return (
        <div className={classStr}>
            {children}
        </div>
    );
}

export default ToolboxRow;