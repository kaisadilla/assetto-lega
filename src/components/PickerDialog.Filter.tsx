import Textbox from 'elements/Textbox';
import React, { useState } from 'react';
import { getClassString, smartFilterObjectArray } from 'utils';

export interface FilterElement {
    name: string;
    value: string;
    element: JSX.Element;
}

export interface PickerDialog_FilterProps {
    title: string;
    items: FilterElement[];
    selectedValue?: string | null;
    onSelect?: (value: string) => void;
}

function PickerDialog_Filter ({
    title,
    items,
    selectedValue,
    onSelect,
}: PickerDialog_FilterProps) {
    const [searchVal, setSearchVal] = useState("");

    return (
        <div className="default-picker-filter">
            <div className="filter-header">
                <div className="filter-name">{title}</div>
            </div>
            <div className="filter-filter">
                <Textbox
                    className="filter-filter-input"
                    placeholder="Search items..."
                    value={searchVal}
                    onChange={str => setSearchVal(str)}
                />
            </div>
            <div className="filter-list">
                {
                    smartFilterObjectArray(items, searchVal, i => i.name)
                        .map(it => <FilterItem
                            key={it.value}
                            item={it}
                            selectedValue={selectedValue}
                            onSelect={onSelect}
                        />
                    )
                }
            </div>
        </div>
    );
}

interface FilterItemProps {
    item: FilterElement;
    selectedValue?: string | null;
    onSelect?: (value: string) => void;
}

function FilterItem ({
    item,
    selectedValue,
    onSelect,
}: FilterItemProps) {
    const classStr = getClassString(
        "filter-item",
        selectedValue === item.value && "selected",
    );

    return (
        <div className={classStr} onClick={handleClick}>
            {item.element}
        </div>
    );

    function handleClick () {
        onSelect?.(item.value);
    }
}


export default PickerDialog_Filter;
