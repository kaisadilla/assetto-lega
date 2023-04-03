import React from 'react';
import "styles/components/horizontal-nav-bar.scss"
import HorizontalNavBar_Item from './HorizontalNavBar.Item';
import { HorizontalNavBarContextProvider } from './useHorizontalNavBar';

export interface HorizontalNavBarProps {
    children?: any[] // TODO: JSX.Element or HorizontalNavBar_Item
}

function HorizontalNavBar (props: HorizontalNavBarProps) {
    return (
        <HorizontalNavBarContextProvider>
            <div className="horiz-nav-bar">
                {props.children}
            </div>
        </HorizontalNavBarContextProvider>
    );
}

HorizontalNavBar.Item = HorizontalNavBar_Item;

export default HorizontalNavBar;