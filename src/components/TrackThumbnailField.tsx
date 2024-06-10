import { AcTrack, AcTrackLayout } from 'data/schemas';
import CoverPanel from 'elements/CoverPanel';
import TrackThumbnail from 'elements/TrackThumbnail';
import React, { useState } from 'react';
import { getClassString, isString } from 'utils';
import TrackPicker, { TrackPickerValue } from './TrackPicker';

export interface TrackThumbnailFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    track: string | AcTrack | null | undefined;
    layout: string | AcTrackLayout | null | undefined;
    onTrackChange?: (value: TrackPickerValue) => void;
}

function TrackThumbnailField ({
    track,
    layout,
    onTrackChange,
    className,
    ...divProps
}: TrackThumbnailFieldProps) {
    const [isPickerOpen, setPickerOpen] = useState(false);

    const classStr = getClassString(
        "default-track-thumbnail-field",
        className,
    );

    const trackStr = isString(track) ? track : track?.folderName;
    const layoutStr = isString(layout) ? layout : layout?.folderName;

    return (
        <div className={classStr} {...divProps}>
            <TrackThumbnail
                className="track-content"
                track={track}
                layout={layout}
                onClick={() => setPickerOpen(true)}
            />
            {isPickerOpen && (<CoverPanel>
                <TrackPicker
                    preSelectedTrack={{track: trackStr, layout: layoutStr}}
                    onSelect={handlePickerSelect}
                    onCancel={() => setPickerOpen(false)}
                />
            </CoverPanel>)}
        </div>
    );

    function handlePickerSelect (value: TrackPickerValue) {
        setPickerOpen(false);
        onTrackChange?.(value);
    }
}

export default TrackThumbnailField;
