import React from 'react';
import { getClassString } from 'utils';

export interface DialogProps {
    className?: string;
    children?: React.ReactNode;
}

function Dialog ({
    className,
    children,
}: DialogProps) {
    const classStr = getClassString(
        "default-dialog",
        "default-window-dialog",
        className,
    )

    return (
        <div className={classStr}>
            {children}
        </div>
    );
}

export default Dialog;