import { useDataContext } from 'context/useDataContext';
import { FILE_PROTOCOL } from 'data/files';
import Img from 'elements/Img';
import React from 'react';
import { getClassString } from 'utils';

export interface CarLogoImageProps {
    carFolderName: string;
    className?: string;
}

function CarLogoImage ({
    carFolderName,
    className,
}: CarLogoImageProps) {
    const { settings } = useDataContext();

    const path = FILE_PROTOCOL + settings.assettoCorsaFolder + "/content/cars/"
        + carFolderName + "/ui/badge.png";

    const classStr = getClassString(
        className,
    )

    return (
        <Img className={classStr} src={path} alt={carFolderName} />
    );
}

export default CarLogoImage;
