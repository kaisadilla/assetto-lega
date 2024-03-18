import { Countries } from 'data/countries';
import Img from 'elements/Img';
import React from 'react';

export interface FlagImageProps {
    country: string;
    className?: string;
}

function FlagImage ({
    country,
    className,
}: FlagImageProps) {
    const countryObj = Countries[country];
    const path = (countryObj ?? Countries["assetto_corsa"]).flag;

    return (
        <Img className={className} src={path} />
    );
}

export default FlagImage;
