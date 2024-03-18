import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { Files } from 'data/files';
import React, { CSSProperties } from 'react';
import Img from './Img';

export interface AssetImageProps {
    folder: AssetFolder;
    imageName: string;
    alt?: string;
    className?: string;
    style?: CSSProperties;
}

function AssetImage ({
    folder,
    imageName,
    alt,
    className,
    style,
}: AssetImageProps) {
    const { dataPath } = useDataContext();

    const src = Files.getFilePath(
        dataPath, folder, imageName
    );

    return (
        <Img className={className} style={style} src={src} alt={alt} />
    );
}

export default AssetImage;
