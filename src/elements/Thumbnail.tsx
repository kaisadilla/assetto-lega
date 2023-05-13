import React, { useState } from 'react';
import preview from "../../assets/preview.png";
import outline from "../../assets/outline.png";
import flag from "../../assets/flags/eu.png";
import "styles/elements/thumbnail.scss";

export interface ThumbnailProps {
    width: string;
}

function Thumbnail (props: ThumbnailProps) {
    const [ showTools, setShowTools ] = useState(false);

    return (
        <div
            className="thumbnail"
            style={{width: props.width}}
            onMouseEnter={() => setShowTools(true)}
            onMouseLeave={() => setShowTools(false)}
        >
            <img className="background" src={preview} />
            <img className="logo" src={outline} />
            <div className="title">
                <div className="flag-container">
                    <img className="flag" src={flag} />
                </div>
                <div className="name">F1 (2012)</div>
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