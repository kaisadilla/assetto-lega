import { useDataContext } from 'context/useDataContext';
import { CSS_VARIABLES, useSettingsContext } from 'context/useSettings';
import { AssetFolder } from 'data/assets';
import { Files } from 'data/files';
import React, { CSSProperties } from 'react';
import { numberToBaseString, truncateNumber } from 'utils';

export interface BackgroundDivProps {
    folder: AssetFolder;
    imageName: string;
    size?: 'contain' | 'contain-no-repeat' | 'cover';
    opacity?: number;
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
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
    const { getCssVariableValue } = useSettingsContext();
    const { dataPath } = useDataContext();

    const imgBackground = Files.getFilePath(
        dataPath, folder, imageName
    );

    const varBgColor = getCssVariableValue(CSS_VARIABLES.BgColor);
    const opacity255 = ((1 - opacity) * 255) | 0;

    const styleObj: CSSProperties = {
        ...style,
        backgroundImage: `linear-gradient(
                to right,
                ${varBgColor}${opacity255.toString(16)},
                ${varBgColor}${opacity255.toString(16)}
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
