import { Countries } from 'data/countries';
import Button from 'elements/Button';
import Dialog from 'elements/Dialog';
import ToolboxRow from 'elements/ToolboxRow';
import { TAB_INDICES } from 'names';
import React, { useState } from 'react';
import { getClassString } from 'utils';

export interface CountryPickerProps {
    preSelectedCountry: string | null;
    allowRegions?: boolean;
    onSelect: (selectedCountry: string | null) => void;
    onCancel?: (selectedCountry: string | null) => void;
}

function CountryPicker ({
    preSelectedCountry,
    allowRegions,
    onSelect,
    onCancel,
}: CountryPickerProps) {
    const [selectedCountry, setSelectedCountry] = useState(
        preSelectedCountry ?? null
    );

    let tabIndex = TAB_INDICES.CountryPicker;

    const [$countries, $regions] = buildNodeArrays();

    return (
        <Dialog className="default-country-picker">
            <div className="country-list">
                {allowRegions && <h2>Regions</h2>}
                {allowRegions && (
                    <div className="country-container">
                        {$regions}
                    </div>
                )}
                <h2>Countries</h2>
                <div className="country-container">
                    {$countries}
                </div>
            </div>
            <ToolboxRow className="image-picker-toolbox">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                    highlighted
                    disabled={selectedCountry === null}
                    onClick={handleSelect}
                >
                    Select
                </Button>
            </ToolboxRow>
        </Dialog>
    );

    async function handleCountryDoubleClick (country: string) {
        onSelect(country);
    }

    async function handleSelect () {
        onSelect(selectedCountry);
    }

    async function handleCancel () {
        onCancel?.(selectedCountry);
    }

    function buildNodeArrays () {
        const countries = [];
        const regions = [];

        for (const c in Countries) {
            const country = Countries[c];
            const $element = (
                <SelectableCountry
                    name={c}
                    selected={selectedCountry === c}
                    onClick={() => setSelectedCountry(c)}
                    onDoubleClick={() => handleCountryDoubleClick(c)}
                    tabIndex={tabIndex}
                />
            );

            if (country.isRegion) {
                regions.push($element);
            }
            else {
                countries.push($element);
            }
        }

        return [countries, regions];
    }
}

export interface SelectableCountryProps {
    name: string;
    selected: boolean;
    onClick: () => void;
    onDoubleClick: () => void;
    tabIndex?: number;
}

function SelectableCountry ({
    name,
    selected,
    onClick,
    onDoubleClick,
    tabIndex
}: SelectableCountryProps) {
    const classStr = getClassString(
        "selectable-country",
        selected && "selected",
    )

    const country = Countries[name];

    return (
        <div
            className={classStr}
            onClick={onClick}
            onKeyDown={(evt) => {if (evt.key === "Enter") onClick()}}
            onDoubleClick={onDoubleClick}
            tabIndex={tabIndex}
        >
            <img className="country-flag" src={country.flag} />
            <div className="country-name">
                {
                    country.displayName === ""
                        ? "<unnamed country>"
                        : country.displayName
                }
            </div>
            <div className="country-highlighter" />
        </div>
    );
}

export default CountryPicker;