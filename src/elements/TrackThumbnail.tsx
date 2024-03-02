import { Countries } from 'data/countries';
import React from 'react';
import { getClassString } from 'utils';

export interface TrackThumbnailProps {
    name: string;
    country: string;
    previewPath: string;
    outlinePath: string;
    className?: string;
}

function TrackThumbnail ({
    name,
    country,
    previewPath,
    outlinePath,
    className,
}: TrackThumbnailProps) {
    const classStr = getClassString(
        "default-thumbnail",
        "default-track-thumbnail",
        className,
    )

    const flagImg = Countries[country]?.flag;

    return (
        <div className={classStr}>
            <div className="thumbnail-multi-layer-background">
                <div className="thumbnail-layer">
                    <img src={previewPath} />
                </div>
                <div className="thumbnail-layer layer-outline">
                    <img src={outlinePath} />
                </div>
            </div>
            <div className="thumbnail-info">
                <div className="thumbnail-flag">
                    <img src={flagImg} />
                </div>
                <div className="thumbnail-name">{name}</div>
            </div>
        </div>
    );
}

export default TrackThumbnail;
