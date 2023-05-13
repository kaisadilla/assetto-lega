import React from 'react';
import "@fortawesome/fontawesome-free/js/all";

export interface IconProps {
    name: string;
}

function Icon (props: IconProps) {
    const className = `fa-solid ${props.name}`;

    return <i className={className}></i>;
}

export default Icon;