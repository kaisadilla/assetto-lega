import React from 'react';
import "@fortawesome/fontawesome-free/js/all";

export interface IconProps {
    name: string;
}

// TODO: Remake 'name' to be a fixed list.
// TODO: Add classlist prop.
function Icon (props: IconProps) {
    const className = `fa-solid ${props.name}`;

    return <i className={className}></i>;
}

export default Icon;