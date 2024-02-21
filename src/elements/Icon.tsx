import React from 'react';
import "@fortawesome/fontawesome-free/js/all";
import { getClassString } from 'utils';

export interface IconProps {
    name: string;
    className?: string;
}

// TODO: Remake 'name' to be a fixed list.
// TODO: Add classlist prop.
function Icon ({
    name,
    className,
}: IconProps) {
    const classStr = getClassString(
        `fa-solid ${name}`,
        className,
    )

    return <i className={classStr}></i>;
}

export default Icon;