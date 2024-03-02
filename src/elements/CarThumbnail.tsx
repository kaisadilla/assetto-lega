import React from 'react';
import { getClassString } from 'utils';

export interface CarThumbnailProps {
    name: string;
    badgePath: string;
    previewPath: string;
    className?: string;
}

function CarThumbnail ({
    name,
    badgePath,
    previewPath,
    className,
}: CarThumbnailProps) {
    const classStr = getClassString(
        "default-thumbnail",
        "default-car-thumbnail",
        className,
    )

    return (
        <div className={classStr}>
            <div className="thumbnail-background">
                <img src={previewPath} />
            </div>
            <div className="thumbnail-info">
                <div className="thumbnail-badge">
                    <img src={badgePath} />
                </div>
                <div className="thumbnail-name">{name}</div>
            </div>
        </div>
    );
}

export default CarThumbnail;
