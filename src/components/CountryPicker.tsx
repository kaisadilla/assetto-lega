import { useDataContext } from 'context/useDataContext';
import { Countries, CountryCategory } from 'data/countries';
import { Tier } from 'data/schemas';
import Button from 'elements/Button';
import CustomizableContextMenu from 'elements/CustomizableContextMenu';
import Dialog from 'elements/Dialog';
import DefaultHighlighter from 'elements/Highlighter';
import Img from 'elements/Img';
import Textbox from 'elements/Textbox';
import TierContextMenu from 'elements/TierContextMenu';
import ToolboxRow from 'elements/ToolboxRow';
import { TAB_INDICES } from 'names';
import React, { useRef, useState } from 'react';
import { getClassString, matchesSmartFilter, smartFilterObjectArray } from 'utils';

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
    const [searchValue, setSearchValue] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(
        preSelectedCountry ?? null
    );

    let tabIndex = TAB_INDICES.CountryPicker;

    const $containers = buildContainers();

    return (
        <Dialog className="default-country-picker">
            <div className="filter-navbar-container">
                <Textbox
                    className="country-search-textbox"
                    placeholder="Search country..."
                    value={searchValue}
                    onChange={str => setSearchValue(str)}
                />
            </div>
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

            if (value === CountryCategory.pseudo) {
                continue;
            }
            // skip category 'pseudo' if regions are not allowed.
            if (!allowRegions && value === CountryCategory.regions) {
                continue;
            }

            $containers.push(
                <CategoryCountryContainer
                    key={value}
                    category={value}
                    selectedCountry={selectedCountry}
                    nameFilter={searchValue}
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
    nameFilter: string;
    onChoose: (country: string) => void;
    onSubmit: (country: string) => void;
    getTabIndex: () => number;
}

function CategoryCountryContainer ({
    category,
    selectedCountry,
    nameFilter,
    onChoose,
    onSubmit,
    getTabIndex,
}: CategoryCountryContainerProps) {
    // contains both id and displayName to sort countries alphabetically.
    const filteredCountries = [];

    const filteredCountriesv = smartFilterObjectArray(
        Object.values(Countries), nameFilter, c => c.displayName
    );

    for (const c in Countries) {
        const country = Countries[c];

        if (matchesSmartFilter(country.displayName, nameFilter) === false) {
            continue;
        }

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

    if (filteredCountryNames.length === 0) {
        return <></>;
    }

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
    const $div = useRef<HTMLDivElement>(null);
    const { countryTiers } = useDataContext();

    const country = Countries[name];
    const tier = countryTiers[name] ?? Tier.Regular;

    const nameClassStr = getClassString(
        "country-name",
        country.isPseudo && "country-name-pseudo",
    );

    return (
        <div
            ref={$div}
            className="selectable-country"
            onClick={onClick}
            onKeyDown={(evt) => {if (evt.key === "Enter") onClick()}}
            onDoubleClick={onDoubleClick}
            tabIndex={tabIndex}
        >
            <Img className="country-flag" src={country.flag} />
            <div className={nameClassStr}>
                {
                    country.displayName === ""
                        ? "<unnamed country>"
                        : country.displayName
                }
            </div>
            <DefaultHighlighter
                className={"country-highlighter tier-" + tier}
                highlight={selected}
            />
            <TierContextMenu
                target={$div}
                onSelect={(t) => console.log(name, t)}
            />
        </div>
    );
}

export default CountryPicker;