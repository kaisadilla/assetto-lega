import { AcTrack, AcTrackLayout } from 'data/schemas';
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
    onChange?: (value: TrackPickerValue) => void;
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
    const [layoutData, setLayoutData] = useState<AcTrackLayout | null>(null);
    const [isPickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        loadLayout();
    }, [track, layout]);

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
            {layoutData === null && <TrackFieldLabel_NoTrack
                onClick={handleClick}
            />}
            {layoutData !== null && <TrackFieldLabel
                key={[track, layout].join("")}
                layoutData={layoutData}
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
        onChange?.(value);
    }

    async function loadLayout () {
        if (track) {
            const trackData = await Ipc.getTrack(track);

            if (trackData === null) {
                throw `Couldn't find track '${track}.'`;
            }

            const _layoutData = trackData?.layoutsById[layout ?? ""];

            if (_layoutData === null) {
                throw `Couldn't find layout '${layout}' for track ${track}.`;
            }

            setLayoutData(_layoutData);
        }
        else {
            setLayoutData(null);
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
    layoutData: AcTrackLayout;
    onClick: () => void;
}

function TrackFieldLabel ({
    layoutData,
    onClick,
}: TrackFieldLabelProps) {
    const displayName = layoutData.ui.name ?? layoutData.folderName;
    const country = getCountryIdByAssettoName(layoutData.ui.country);

    return (
        <div className="picker-content track-content" onClick={onClick}>
            {layoutData && <div className="picker-image track-image">
                <FlagImage country={country} />
            </div>}
            <div className="picker-name track-name">{displayName}</div>
        </div>
    );
}



export default TrackField;
