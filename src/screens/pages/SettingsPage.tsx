import ColorField from 'components/ColorField';
import { AppTheme, DEFAULT_SETTINGS, SearchMode, useSettingsContext } from 'context/useSettings';
import DropdownField, { DropdownItem } from 'elements/DropdownField';
import LabeledControl from 'elements/LabeledControl';
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
        </div>
    );
}

export default SettingsPage;
