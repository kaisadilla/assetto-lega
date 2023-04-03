import React from 'react';
import "styles/components/horizontal-nav-bar.scss"
import NavBar_Item from './NavBar.Item';
import { NavBarContextProvider } from './useNavBar';

/**
 * The index that is chosen as selected by default when no default index is
 * defined for this component.
 */
const DEFAULT_DEFAULT_SELECTED_INDEX = 0;

export interface NavBarProps {
    /**
     * The index of the item selected by default.
     * If not defined, this index will be 0.
     */
    startingIndex?: number;
    children?: any[] // TODO: JSX.Element or NavBar_Item
}

function NavBar (props: NavBarProps) {
    const index = props.startingIndex ?? DEFAULT_DEFAULT_SELECTED_INDEX;

    return (
        <NavBarContextProvider index={index}>
            <div className="horiz-nav-bar">
                {props.children}
            </div>
        </NavBarContextProvider>
    );
}

NavBar.Item = NavBar_Item;

export default NavBar;