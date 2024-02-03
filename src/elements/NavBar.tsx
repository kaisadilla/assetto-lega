import React from 'react';
import "styles/components/nav-bar.scss"
import NavBar_Item from './NavBar.Item';
import { getClassString } from 'utils';

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

    const classStr = getClassString(
        "horiz-nav-bar",
        size === NavBarSize.SMALL && "nav-bar-small",
        size === NavBarSize.REGULAR && "nav-bar-regular",
        size === NavBarSize.BIG && "nav-bar-big",
    )

    const getSet = {get, set};

    const getSetChildren = React.Children.map(children, c => {
        if (React.isValidElement(c)) {
            return React.cloneElement(c, getSet);
        }
    });

    return (
        <div className={classStr}>
            {getSetChildren}
        </div>
    );
}

NavBar.Item = NavBar_Item;

export default NavBar;