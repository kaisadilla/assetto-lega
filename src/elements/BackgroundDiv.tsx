import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { Files } from 'data/files';
import React, { CSSProperties } from 'react';

export interface BackgroundDivProps {
    folder: AssetFolder;
    imageName: string;
    size?: 'contain' | 'contain-no-repeat' | 'cover';
    opacity?: number;
    className?: string;
    style?: CSSProperties;
    children: React.ReactNode;
}

function BackgroundDiv ({
    folder,
    imageName,
    size = 'cover',
    opacity = 1,
    className,
    style,
    children,
}: BackgroundDivProps) {
    const { dataPath } = useDataContext();

    const imgBackground = Files.getFilePath(
        dataPath, folder, imageName
    );

    const styleObj: CSSProperties = {
        ...style,
        backgroundImage: `linear-gradient(
                to right,
                rgba(0, 0, 0, ${1 - opacity}),
                rgba(0, 0, 0, ${1 - opacity})
            ),
            url(${imgBackground})`,
    };
    if (size === 'contain') {
        styleObj.backgroundSize = 'contain';
    }
    else if (size === 'contain-no-repeat') {
        styleObj.backgroundSize = 'contain';
        styleObj.backgroundRepeat = 'no-repeat';
    }
    else if (size === 'cover') {
        styleObj.backgroundSize = 'cover';
    }

    return (
        <div
            className={className}
            style={styleObj}
        >
            {children}
        </div>
    );
}

export default BackgroundDiv;
