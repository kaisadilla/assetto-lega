import React, { FunctionComponent, useEffect, useState } from 'react';

type NavBar_ItemProps = {
    text: string;
    index: any;
    get?: any;
    set?: (index: any) => void;
}

const NavBar_Item: FunctionComponent<NavBar_ItemProps> = ({
    text,
    index,
    get = undefined,
    set = () => {},
}) => {
    let className = "nav-bar-item";
    if (index === get) className += " selected";

    return (
        <span className={className} onClick={() => set(index)}>
            {text}
        </span>
    );
}

export default NavBar_Item;