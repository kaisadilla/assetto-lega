import ColorField from 'components/ColorField';
import CountryField from 'components/CountryField';
import { AppTheme, DEFAULT_SETTINGS, SearchMode, useSettingsContext } from 'context/useSettings';
import DropdownField, { DropdownItem } from 'elements/DropdownField';
import LabeledControl from 'elements/LabeledControl';
import Textbox from 'elements/Textbox';
import React from 'react';

const ACCENT_SUGGESTIONS = [
    DEFAULT_SETTINGS.accent,
    "#57518b",
    "#00f7cb",
    "#00c232",
    "#ffcc00",
    "#ff7200",
    "#ff1e00",
    "#ff0048",
    "#5e00ec",
    "#2321C7",
    "#0064ec",
    "#b3b3b3",
    "#6b6b6b",
    "#542b10",
    "#7f7521"
];

export interface SettingsPageProps {
    
}

function SettingsPage (props: SettingsPageProps) {
    const ctx = useSettingsContext();

    return (
        <div className="settings-page">
            <LabeledControl label="Theme">
                <DropdownField
                    items={[
                        {value: 'dark', displayName: "Dark"},
                        {value: 'light', displayName: "Light"},
                    ] as DropdownItem<AppTheme>[]}
                    selectedItem={ctx.theme}
                    onSelect={v => ctx.setTheme(v)}
                />
            </LabeledControl>
            <LabeledControl label="Accent color">
                <ColorField
                    value={ctx.accent}
                    onChange={v => ctx.setAccent(v)}
                    suggestions={ACCENT_SUGGESTIONS}
                />
            </LabeledControl>
            <LabeledControl label="Search mode">
                <DropdownField
                    items={[
                        {value: 'literal', displayName: "Literal"},
                        {value: 'smart', displayName: "Smart"},
                    ] as DropdownItem<SearchMode>[]}
                    selectedItem={ctx.searchMode}
                    onSelect={v => ctx.setSearchMode(v)}
                />
            </LabeledControl>
            <LabeledControl label="Profile country">
                <CountryField
                    value={ctx.profile.country}
                    onChange={c => ctx.setProfileField('country', c)}
                    allowRegions
                />
            </LabeledControl>
            <LabeledControl label="Profile number">
                <Textbox
                    value={ctx.profile.number}
                    onChange={str => ctx.setProfileField('number', str)}
                />
            </LabeledControl>
            <LabeledControl label="Profile name">
                <Textbox
                    value={ctx.profile.name}
                    onChange={str => ctx.setProfileField('name', str)}
                />
            </LabeledControl>
            <LabeledControl label="Profile initials">
                <Textbox
                    value={ctx.profile.initials}
                    onChange={str => ctx.setProfileField('initials', str)}
                />
            </LabeledControl>
        </div>
    );
}

export default SettingsPage;
