import { League } from 'data/schemas';
import Thumbnail from 'elements/Thumbnail';
import React from 'react';

export interface LeagueThumbnailProps {
    league: League;
    width: string;
}

function LeagueThumbnail ({
    league,
    width,
}: LeagueThumbnailProps) {
    return (
        <div>
            <Thumbnail
                name={league.displayName}
                flag={league.region}
                width={width}
            />
        </div>
    );
}

export default LeagueThumbnail;