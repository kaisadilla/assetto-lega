import CarThumbnail from 'elements/CarThumbnail';
import Thumbnail from 'elements/Thumbnail';
import React from 'react';

export interface PickerDialog_ThumbnailProps {
    name: string;
    src: string;
    selected: boolean;
    width: number;
    onClick: () => void;
    onDoubleClick: () => void;
    className?: string;
    tabIndex?: number;
}

function PickerDialog_Thumbnail ({
    name,
    src,
    selected,
    width,
    onClick,
    onDoubleClick,
    className,
    tabIndex,
}: PickerDialog_ThumbnailProps) {

    return (
        <CarThumbnail
            name={name}
            badgePath={"asset://X:/SteamLibrary/steamapps/common/assettocorsa/content/cars/acfl_2006_ferrari/ui/badge.png"}
            previewPath={src}
            width={width}
        />
    );
}

export default PickerDialog_Thumbnail;
