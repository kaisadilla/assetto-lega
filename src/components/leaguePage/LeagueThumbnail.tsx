import Thumbnail from 'elements/Thumbnail';
import React from 'react';

export interface LeagueThumbnailProps {
    width: string;
}

function LeagueThumbnail (props: LeagueThumbnailProps) {
    return (
        <div>
            <Thumbnail width={props.width} />
        </div>
    );
}

export default LeagueThumbnail;