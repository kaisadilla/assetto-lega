import React from 'react';
import { getClassString } from 'utils';
import ToolboxRow_Status from './ToolboxRow.Status';

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

ToolboxRow.Status = ToolboxRow_Status;

export default ToolboxRow;