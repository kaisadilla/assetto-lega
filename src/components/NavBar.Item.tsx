import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavBarContext } from './useNavBar';

type NavBar_ItemProps = {
    text: string;
    index: number;
}

const NavBar_Item: FunctionComponent<NavBar_ItemProps> = ({
    text,
    index,
}) => {
    const { selectedIndex, setSelectedIndex } = useNavBarContext();

    const selected = index === selectedIndex;

    let className = "nav-bar-item";
    if (selected) className += " selected";

    const onClick = () => setSelectedIndex(index);

    return (
        <span className={className} onClick={onClick}>
            {text}
        </span>
    );
}

export default NavBar_Item;