import { Countries, CountryCategory } from 'data/countries';
import Button from 'elements/Button';
import Dialog from 'elements/Dialog';
import DefaultHighlighter from 'elements/Highlighter';
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

    const $containers = buildContainers();

    return (
        <Dialog className="default-country-picker">
            <div className="country-list">
                {$containers}
            </div>
            <ToolboxRow className="image-picker-toolbox">
                <ToolboxRow.Status text={selectedCountry} />
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

    function handleSelect () {
        onSelect(selectedCountry);
    }

    function handleCancel () {
        onCancel?.(selectedCountry);
    }

    function buildContainers () {
        const $containers = [];

        let tabIndex = TAB_INDICES.CountryPicker;
        const getTabIndex = () => tabIndex++;

        for (const key in CountryCategory) {
            const value = CountryCategory[key as keyof typeof CountryCategory];

            // skip category 'pseudo' if regions are not allowed.
            if (!allowRegions && value === CountryCategory.regions) {
                continue;
            }

            $containers.push(
                <CategoryCountryContainer
                    key={value}
                    category={value}
                    selectedCountry={selectedCountry}
                    onChoose={country => setSelectedCountry(country)}
                    onSubmit={handleCountryDoubleClick}
                    getTabIndex={getTabIndex}
                />
            )
        }

        return $containers;
    }

    function handleCountryDoubleClick (country: string) {
        onSelect(country);
    }
}

export interface CategoryCountryContainerProps {
    category: CountryCategory;
    selectedCountry: string | null;
    onChoose: (country: string) => void;
    onSubmit: (country: string) => void;
    getTabIndex: () => number;
}

function CategoryCountryContainer ({
    category,
    selectedCountry,
    onChoose,
    onSubmit,
    getTabIndex,
}: CategoryCountryContainerProps) {
    // contains both id and displayName to sort countries alphabetically.
    const filteredCountries = [];

    for (const c in Countries) {
        const country = Countries[c];
        if (country.category === category) {
            let sortingName = country.displayName;
            // ignore 'The' when sorting alphabetically.
            if (sortingName.startsWith("The ")) {
                sortingName = sortingName.substring(4);
            }

            filteredCountries.push({
                id: c,
                sortingName,
            });
        }
    }

    filteredCountries.sort((a, b) => a.sortingName.localeCompare(b.sortingName));

    const filteredCountryNames = filteredCountries.map(c => c.id);

    // CountryCategory[key as keyof typeof CountryCategory]
    return (
        <>
            <h2>{category}</h2>
            <div className="country-container">
                {
                    filteredCountryNames.map(c => (
                        <SelectableCountry
                            key={c}
                            name={c}
                            selected={selectedCountry === c}
                            onClick={() => onChoose(c)}
                            onDoubleClick={() => onSubmit(c)}
                            tabIndex={getTabIndex()}
                        />
                    ))
                }
            </div>
        </>
    );
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
    const country = Countries[name];

    const nameClassStr = getClassString(
        "country-name",
        country.isPseudo && "country-name-pseudo"
    )

    return (
        <div
            className="selectable-country"
            onClick={onClick}
            onKeyDown={(evt) => {if (evt.key === "Enter") onClick()}}
            onDoubleClick={onDoubleClick}
            tabIndex={tabIndex}
        >
            <img className="country-flag" src={country.flag} />
            <div className={nameClassStr}>
                {
                    country.displayName === ""
                        ? "<unnamed country>"
                        : country.displayName
                }
            </div>
            <DefaultHighlighter className="country-highlighter" highlight={selected} />
        </div>
    );
}

export default CountryPicker;