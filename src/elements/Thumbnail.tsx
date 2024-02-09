import React, { useState } from 'react';
import preview from "../../assets/preview.png";
import outline from "../../assets/outline.png";
import flag from "../../assets/flags/eu.png";
import "styles/elements/thumbnail.scss";

export interface ThumbnailProps {
    name: string;
    flag: string;
    width: string;
}

function Thumbnail ({
    name,
    flag,
    width,
}: ThumbnailProps) {
    const [ showTools, setShowTools ] = useState(false);

    const spain = Math.random() < 0.5 ? "spain" : "france";
    const fl = require("../../assets/flags/" + flag + ".png");

    return (
        <div
            className="thumbnail"
            style={{width: width}}
            onMouseEnter={() => setShowTools(true)}
            onMouseLeave={() => setShowTools(false)}
        >
            <img className="background" src={preview} />
            <img className="logo" src={outline} />
            <div className="title">
                <div className="flag-container">
                    <img className="flag" src={fl} />
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