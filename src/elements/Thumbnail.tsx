import React, { useState } from 'react';
import outline from "../../assets/outline.png";
import flag from "../../assets/flags/eu.png";
import { Countries } from 'data/countries';

export interface ThumbnailProps {
    /** The name of the background file. */
    background: string;
    name: string;
    flag: keyof typeof Countries;
    logo: string;
    width: string;
}

function Thumbnail ({
    background,
    logo,
    name,
    flag,
    width,
}: ThumbnailProps) {
    const [showTools, setShowTools] = useState(false);

    const flagPath = Countries[flag].flag;

    return (
        <div
            className="thumbnail"
            style={{width: width}}
            onMouseEnter={() => setShowTools(true)}
            onMouseLeave={() => setShowTools(false)}
        >
            <img className="background" src={background} />
            <img className="logo" src={logo} />
            <div className="title">
                <div className="flag-container">
                    <img className="flag" src={flagPath} />
                </div>
                <div className="name">{name}</div>
            </div>
            {
                showTools &&
                <div className="hover-tools">
    
                </div>
            }
        </div>
    );
}


export default Thumbnail;