import { AcTrack } from 'data/schemas';
import CoverPanel from 'elements/CoverPanel';
import FlagImage from 'elements/images/FlagImage';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';
import { getClassString } from 'utils';
import TrackPicker, { TrackPickerValue } from './TrackPicker';
import { getCountryIdByAssettoName } from 'data/countries';

export interface TrackFieldProps {
    track?: string;
    layout?: string;
    onChange?: (value: string) => void;
    className?: string;
    tabIndex?: number;
}

function TrackField ({
    track,
    layout,
    onChange,
    className,
    tabIndex = 1,
}: TrackFieldProps) {
    const [fieldLoaded, setFieldLoaded] = useState(false);
    const [trackData, setTrackData] = useState<AcTrack | null>(null);
    const [isPickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        loadTrack();
    }, [track]);

    const classStr = getClassString(
        "default-control",
        "default-picker-field",
        "default-track-field",
        className,
    );

    if (fieldLoaded === false) {
        return (
            <div className={classStr} tabIndex={tabIndex}>
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className={classStr} tabIndex={tabIndex}>
            {trackData === null && <TrackFieldLabel_NoTrack
                onClick={handleClick}
            />}
            {trackData !== null && <TrackFieldLabel
                trackData={trackData}
                layout={layout}
                onClick={handleClick}
            />}
            {isPickerOpen && (
            <CoverPanel>
                <TrackPicker
                    preSelectedTrack={{track: track, layout: layout}}
                    onSelect={handlePickerSelect}
                    onCancel={() => setPickerOpen(false)}
                />
            </CoverPanel>
            )}
        </div>
    );

    function handleClick () {
        setPickerOpen(true);
    }

    function handlePickerSelect (value: TrackPickerValue) {
        setPickerOpen(false);
        //onChange?.(value);
    }

    async function loadTrack () {
        if (track) {
            const trackData = await Ipc.getTrack(track);
            setTrackData(trackData);
        }
        else {
            setTrackData(null);
        }

        setFieldLoaded(true);
    }
}

interface TrackFieldLabel_NoTrackProps {
    onClick: () => void;
}

function TrackFieldLabel_NoTrack ({
    onClick,
}: TrackFieldLabel_NoTrackProps) {

    return (
        <div className="picker-content track-content" onClick={onClick}>
            <div className="picker-name track-name">&lt;no track&gt;</div>
        </div>
    );
}

interface TrackFieldLabelProps {
    trackData: AcTrack;
    layout: string | undefined;
    onClick: () => void;
}

function TrackFieldLabel ({
    trackData,
    layout,
    onClick,
}: TrackFieldLabelProps) {
    const layoutId = layout ?? "";
    const layoutInfo = trackData.layoutsById[layoutId];

    if (!layoutInfo) {
        console.log(
            `Cannot find layout '${layoutId}' for track '${trackData.folderName}'`,
            trackData
        );
    }

    const displayName = layoutInfo?.ui.name ?? trackData.displayName;
    const country = getCountryIdByAssettoName(layoutInfo.ui.country);

    return (
        <div className="picker-content track-content" onClick={onClick}>
            {trackData && <div className="picker-image track-image">
                <FlagImage country={country} />
            </div>}
            <div className="picker-name track-name">{displayName}</div>
        </div>
    );
}



export default TrackField;
