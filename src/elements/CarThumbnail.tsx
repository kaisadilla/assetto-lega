import { useAcContext } from 'context/useAcContext';
import { FILE_PROTOCOL } from 'data/files';
import { AcCar, AcCarSkin } from 'data/schemas';
import React from 'react';
import { getClassString, isString } from 'utils';
import Img from './Img';

export interface CarThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
    car: AcCar | string | null | undefined;
    carSkin: AcCarSkin | string;
    className?: string;
}

function CarThumbnail ({
    car,
    carSkin,
    className,
    ...divProps
}: CarThumbnailProps) {
    const classStr = getClassString(
        "default-thumbnail",
        "default-car-thumbnail",
        className,
    );

    const { cars } = useAcContext();

    if (isString(car)) {
        car = cars.carsById[car];
    }

    if (car === null || car === undefined) {
        return (
            <div className={classStr} {...divProps}>
                <div className="thumbnail-background no-content-thumbnail">
                    <div>&lt; no car selected &gt;</div>
                </div>
                <div className="thumbnail-info">
                    <div className="thumbnail-flag">
                        
                    </div>
                    <div className="thumbnail-name"></div>
                </div>
            </div>
        );
    }

    const carObj = car as AcCar;

    if (isString(carSkin)) {
        carSkin = carObj.skinsById[carSkin];
    }
    const carSkinObj = carSkin as AcCarSkin;

    return (
        <div className={classStr} {...divProps}>
            <div className="thumbnail-background">
                <Img src={FILE_PROTOCOL + carSkinObj.previewPath} />
            </div>
            <div className="thumbnail-info">
                <div className="thumbnail-badge">
                    <Img src={FILE_PROTOCOL + carObj.badgePath} />
                </div>
                <div className="thumbnail-name">{carObj.ui.name}</div>
            </div>
        </div>
    );
}

export default CarThumbnail;
