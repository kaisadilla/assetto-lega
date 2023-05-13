import React from 'react';
import "styles/components/nav-bar.scss"
import NavBar_Item from './NavBar.Item';

/**
 * The index that is chosen as selected by default when no default index is
 * defined for this component.
 */
const DEFAULT_DEFAULT_SELECTED_INDEX = 0;

export enum NavBarSize {
    REGULAR,
    SMALL,
    BIG
}

const NAV_BAR_SIZES = {
    [NavBarSize.REGULAR]: "12pt",
    [NavBarSize.SMALL]: "10pt",
    [NavBarSize.BIG]: "16pt",
}

export interface NavBarProps {
    /**
     * The current value
     */
    get: any;
    set: (index: any) => void;
    size?: NavBarSize;
    children: React.ReactNode;
}

function NavBar ({
    get,
    set,
    size = NavBarSize.REGULAR,
    children,
}: NavBarProps) {
    const fontSize = NAV_BAR_SIZES[size];

    const getSet = {get, set};

    const getSetChildren = React.Children.map(children, c => {
        if (React.isValidElement(c)) {
            return React.cloneElement(c, getSet);
        }
    });

    return (
        <div className="horiz-nav-bar" style={{fontSize: fontSize}}>
            {getSetChildren}
        </div>
    );
}

NavBar.Item = NavBar_Item;

export default NavBar;