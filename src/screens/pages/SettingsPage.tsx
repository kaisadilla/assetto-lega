import ColorField from 'components/ColorField';
import CountryField from 'components/CountryField';
import { AppTheme, DEFAULT_SETTINGS, SearchMode, useSettingsContext } from 'context/useSettings';
import DropdownField, { DropdownItem } from 'elements/DropdownField';
import LabeledControl from 'elements/LabeledControl';
import NavBar, { NavBarSize } from 'elements/NavBar';
import Textbox from 'elements/Textbox';
import React, { useState } from 'react';
import SettingsPage_AssettoLega from './SettingsPage.AssettoLega';

enum Page {
    ASSETTO_LEGA,
    ASSETTO_CORSA
};

export interface SettingsPageProps {
    
}

function SettingsPage (props: SettingsPageProps) {
    const [ page, setPage] = useState(Page.ASSETTO_CORSA);

    const ctx = useSettingsContext();

    return (
        <div className="settings-page">
            <NavBar size={NavBarSize.REGULAR} get={page} set={setPage}>
                <NavBar.Item text="lega" index={Page.ASSETTO_LEGA} />
                <NavBar.Item text="assetto corsa" index={Page.ASSETTO_CORSA} />
            </NavBar>
            {page === Page.ASSETTO_LEGA && <SettingsPage_AssettoLega />}
        </div>
    );
}

export default SettingsPage;
