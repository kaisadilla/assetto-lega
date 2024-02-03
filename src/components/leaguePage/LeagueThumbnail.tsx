import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { Files } from 'data/files';
import { League } from 'data/schemas';
import Thumbnail from 'elements/Thumbnail';
import React from 'react';

export interface LeagueThumbnailProps {
    league: League;
    width: string;
}

function LeagueThumbnail ({league, width}: LeagueThumbnailProps) {
    const { dataPath } = useDataContext();

    const imgBackground = Files.getFilePath(
        dataPath, AssetFolder.leagueBackgrounds, league.background
    );
    const imgLogo = Files.getFilePath(
        dataPath, AssetFolder.leagueLogos, league.logo
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