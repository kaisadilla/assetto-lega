import React, { CSSProperties } from 'react';
import { getClassString } from 'utils';

export interface DragRegionProps extends React.HTMLAttributes<HTMLDivElement> {
    
}

function DragRegion ({
    className,
    ...divProps
}: DragRegionProps) {
    const classStr = getClassString(
        "default-drag-region",
        className,
    )

    return (
        <div className={classStr} {...divProps}>
            
        </div>
    );
}

export default DragRegion;
