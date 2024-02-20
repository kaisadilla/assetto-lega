import DragRegion from 'elements/DragRegion';
import React from 'react';

export interface ReadingAcContentScreenProps {
    
}

function ReadingAcContentScreen (props: ReadingAcContentScreenProps) {

    return (
        <div>
            <DragRegion style={{height: "64px", width: "100%", background: "red"}}/>
            Reading ac content...
        </div>
    );
}

export default ReadingAcContentScreen;
