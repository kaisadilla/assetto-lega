import { Tier } from 'data/schemas';
import React, { useState } from 'react';
import { getClassString } from 'utils';
import FlagImage from './images/FlagImage';
import { CountryCategory, groupObjectsByCountryCategory } from 'data/countries';
import MaterialSymbol from './MaterialSymbol';

export interface CountrySelectorListProps {
    entries: CountrySelectorEntryProps[];
}

function CountrySelectorList ({
    entries,
}: CountrySelectorListProps) {
    const cats = groupObjectsByCountryCategory(entries, e => e.value);

    const $entries = [];

    for (const c in cats) {
        const category = cats[c as CountryCategory];

        if (category) {
            $entries.push(<CountrySelectorCategory
                key={c}
                title={c}
                entries={category}
            />);
        }
    }

    return (
        <div className="default-country-selector-list">
            {$entries}
        </div>
    );
}

interface CountrySelectorCategoryProps {
    title: string;
    entries: CountrySelectorEntryProps[];
}

function CountrySelectorCategory ({
    title,
    entries,
}: CountrySelectorCategoryProps) {
    const [isShown, setShown] = useState(true);

    const classStr = getClassString(
        "country-category-title",
        isShown && "expanded",
    );

    return (
        <>
            <h3 className={classStr} onClick={handleTitleClick}>
                <div className="category-name">{title}</div>
                <div className="expand-symbol">
                    <MaterialSymbol
                        symbol={isShown ? 'expand_less' : 'expand_more'}
                    />
                </div>
            </h3>
            {isShown && entries.map(entry => <CountrySelectorEntry
                key={entry.value}
                {...entry}
            />)}
        </>
    );

    function handleTitleClick () {
        setShown(!isShown);
    }
}


interface CountrySelectorEntryProps {
    name: string;
    value: string;
    selected?: boolean;
    tier?: Tier;
    isAll?: boolean;
    onSelect?: (value: string) => void;
    className?: string;
}

function CountrySelectorEntry ({
    name,
    value,
    selected,
    tier,
    isAll,
    onSelect,
    className,
}: CountrySelectorEntryProps) {
    const classStr = getClassString(
        "country-selector-list-entry",
        isAll && "entry-all",
        selected && "selected",
        className,
    );

    return (
        <div className={classStr} onClick={handleClick}>
            <div className="country-flag">
                <FlagImage country={value} />
            </div>
            <div className="country-name">
                {name}
            </div>
        </div>
    );

    function handleClick () {
        onSelect?.(value);
    }
}


export default CountrySelectorList;
