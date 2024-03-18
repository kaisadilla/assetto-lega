import React from 'react';
import { cureHtmlPath } from 'utils';

export interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    
}

function Img ({
    src,
    ...imgProps
}: ImgProps) {
    if (src) {
        src = cureHtmlPath(src);
    }

    return (
        <img src={src} {...imgProps} />
    );
}

export default Img;
