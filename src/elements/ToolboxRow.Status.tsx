import React from 'react';
import { getClassString } from 'utils';

export interface ToolboxRow_StatusProps {
    text?: string | null;
    className?: string;
}

function ToolboxRow_Status ({
    text,
    className,
}: ToolboxRow_StatusProps) {
    const classStr = getClassString(
        "default-status",
        className,
    )

    return (
        <div className={classStr}>
            {text ?? ""}
        </div>
    );
}

export default ToolboxRow_Status;
