import { Tier } from 'data/schemas';
import React from 'react';
import Icon from './Icon';
import { getClassString } from 'utils';

export interface TextSelectorListEntryData {
    name: string;
    value: string;
    selected?: boolean;
    tier?: Tier;
    isAll?: boolean;
    onSelect?: (value: string) => void;
    className?: string;
}

export interface TextSelectorListProps {
    entries: TextSelectorListEntryData[];
}

function TextSelectorList ({
    entries,
}: TextSelectorListProps) {
    return (
        <div className="default-text-selector-list">
            {entries.map(entry => <TextSelectorListEntry
                key={entry.value}
                data={entry}
            />)}
        </div>
    );
}

interface TextSelectorListEntryProps {
    data: TextSelectorListEntryData;
}

function TextSelectorListEntry ({
    data,
}: TextSelectorListEntryProps) {
    const classStr = getClassString(
        "text-selector-list-entry",
        data.isAll && "entry-all",
        data.selected && "selected",
        data.className,
    );

    const name = data.name === "" ? " " : data.name;

    return (
        <div className={classStr} onClick={handleClick}>
            {data.tier && data.tier !== Tier.Regular && <Icon
                className={"tier-" + data.tier}
                name="fa-star"
            />}
            <span>{name}</span>
        </div>
    );

    function handleClick () {
        data.onSelect?.(data.value);
    }
}


export default TextSelectorList;
