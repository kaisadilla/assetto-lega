import { useAcContext } from 'context/useAcContext';
import { Countries, getCountryIdByAssettoName } from 'data/countries';
import { FILE_PROTOCOL } from 'data/files';
import { AcTrack, AcTrackLayout } from 'data/schemas';
import React from 'react';
import { getClassString, isString } from 'utils';
import FlagImage from './images/FlagImage';
import Img from './Img';

export interface TrackThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
    track: string | AcTrack | null | undefined;
    layout: string | AcTrackLayout | null | undefined;
    className?: string;
}

function TrackThumbnail ({
    track,
    layout,
    className,
    ...divProps
}: TrackThumbnailProps) {
    
    const { tracks } = useAcContext();

    track ??= null;
    layout ??= null;

    if (isString(track)) {
        track = tracks.tracksById[track as string] ?? null;
    }
    if (track === null) {
        layout = null;
    }
    else if (isString(layout)) {
        layout = (track as AcTrack)?.layoutsById[layout as string];
        layout ??= (track as AcTrack)?.layouts[0];
    }
    
    const classStr = getClassString(
        "default-thumbnail",
        "default-track-thumbnail",
        className,
    )

    if (track === null || layout === null) {
        return (
            <div className={classStr} {...divProps}>
                <div className="thumbnail-background no-content-thumbnail">
                    <div>&lt; no track selected &gt;</div>
                </div>
                <div className="thumbnail-info">
                    <div className="thumbnail-flag">
                        
                    </div>
                    <div className="thumbnail-name"></div>
                </div>
            </div>
        );
    }

    const trackObj = track as AcTrack;
    const layoutObj = layout as AcTrackLayout;

    //const flagImg = Countries[country]?.flag;

    return (
        <div className={classStr} {...divProps}>
            <div className="thumbnail-multi-layer-background">
                <div className="thumbnail-layer">
                    <Img src={FILE_PROTOCOL + layoutObj.previewPath} />
                </div>
                <div className="thumbnail-layer layer-outline">
                    <Img src={FILE_PROTOCOL + layoutObj.outlinePath} />
                </div>
            </div>
            <div className="thumbnail-info">
                <div className="thumbnail-flag">
                    <FlagImage country={getCountryIdByAssettoName(trackObj.displayCountry)} />
                </div>
                <div className="thumbnail-name">{layoutObj.ui.name}</div>
            </div>
        </div>
    );
}

export default TrackThumbnail;
