import { Tier } from 'data/schemas';
import React from 'react';
import { getClassString } from 'utils';

export interface BrandSelectorListEntryData {
    name: string;
    value: string;
    badgePath?: string;
    selected?: boolean;
    tier?: Tier;
    isAll?: boolean;
    onSelect?: (value: string) => void;
    className?: string;
}

export interface BrandSelectorListProps {
    entries: BrandSelectorListEntryData[];
}

function BrandSelectorList ({
    entries,
}: BrandSelectorListProps) {

    return (
        <div className="default-brand-selector-list">
            {entries.map(entry => <BrandSelectorListEntry
                key={entry.value}
                data={entry}
            />)}
        </div>
    );
}

interface BrandSelectorListEntryProps {
    data: BrandSelectorListEntryData;
}

function BrandSelectorListEntry ({
    data,
}: BrandSelectorListEntryProps) {
    const classStr = getClassString(
        "brand-selector-list-entry",
        data.isAll && "entry-all",
        data.selected && "selected",
        data.className,
    );

    return (
        <div className={classStr} onClick={handleClick}>
            <div className="brand-badge">
                {data.badgePath && <img src={data.badgePath} />}
            </div>
            <div className="brand-name">
                {data.name}
            </div>
        </div>
    );

    function handleClick () {
        data.onSelect?.(data.value);
    }
}

export default BrandSelectorList;