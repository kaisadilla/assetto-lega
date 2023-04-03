import React, { FunctionComponent, useEffect, useState } from 'react';
import { useHorizontalNavBarContext } from './useHorizontalNavBar';

type HorizontalNavBar_ItemProps = {
    text: string;
    index: number;
}

const HorizontalNavBar_Item: FunctionComponent<HorizontalNavBar_ItemProps> = ({
    text,
    index,
}) => {
    const { selectedIndex, setSelectedIndex } = useHorizontalNavBarContext();

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

export default HorizontalNavBar_Item;