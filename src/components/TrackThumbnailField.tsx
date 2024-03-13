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
    className?: string;
}

function TrackThumbnailField (props: TrackThumbnailFieldProps) {
    const { track, layout, onTrackChange, className, ...rest } = props;

    const [isPickerOpen, setPickerOpen] = useState(false);

    const classStr = getClassString(
        "default-track-thumbnail-field",
        className,
    );

    const trackStr = isString(track) ? track as string : (track as AcTrack)?.folderName;
    const layoutStr = isString(layout) ? layout as string : (layout as AcTrackLayout)?.folderName;

    return (
        <div className={classStr} {...rest}>
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
        console.log(value);
    }
}

export default TrackThumbnailField;
