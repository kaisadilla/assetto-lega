import { useDataContext } from 'context/useDataContext';
import { Files } from 'data/files';
import { League } from 'data/schemas';
import Thumbnail from 'elements/Thumbnail';
import React from 'react';

export interface LeagueThumbnailProps {
    league: League;
    width: string;
}

function LeagueThumbnail ({league, width}: LeagueThumbnailProps) {
    const { userDataPath } = useDataContext();

    const imgBackground = Files.getFilePath(
        userDataPath, "img/league-bg", league.background
    );
    const imgLogo = Files.getFilePath(
        userDataPath, "img/league-logos", league.logo
    );

    return (
        <div>
            <Thumbnail
                width={width}
                background={imgBackground}
                logo={imgLogo}
                name={league.displayName}
                flag={league.region}
            />
        </div>
    );
}

export default LeagueThumbnail;