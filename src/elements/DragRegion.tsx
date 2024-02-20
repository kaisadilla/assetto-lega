import React, { CSSProperties } from 'react';

export interface DragRegionProps {
    style?: CSSProperties;
}

function DragRegion ({
    style
}: DragRegionProps) {

    return (
        <div className="default-drag-region" style={style}>
            
        </div>
    );
}

export default DragRegion;
