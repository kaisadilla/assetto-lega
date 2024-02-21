import BrandSelectorList, { BrandSelectorListEntryData } from 'elements/BrandSelectorList';
import TextSelectorList from 'elements/TextSelectorList';
import Textbox from 'elements/Textbox';
import React, { useState } from 'react';
import { getClassString, smartFilterObjectArray } from 'utils';

export interface BrandFilterElement {
    name: string;
    value: string;
    badgePath?: string;
}

export interface TextFilterElement {
    name: string;
    value: string;
}

export interface PickerDialog_FilterProps {
    title: string;
    selectorListStyle: 'text' | 'brand' | 'country';
    brandItems?: BrandFilterElement[];
    textItems?: TextFilterElement[];
    selectedValue?: string | null;
    onSelect?: (value: string) => void;
}

function PickerDialog_Filter ({
    title,
    selectorListStyle,
    brandItems,
    textItems,
    selectedValue,
    onSelect,
}: PickerDialog_FilterProps) {
    if (selectorListStyle === 'brand' && brandItems === undefined) {
        throw `Error when building PickerDialog.Filter: selectorListStyle `
            + `'brand' requires prop 'brandItems' to be informed.`;
    }
    if (selectorListStyle === 'text' && textItems === undefined) {
        throw `Error when building PickerDialog.Filter: selectorListStyle `
            + `'text' requires prop 'textItems' to be informed.`;
    }

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
            {
                selectorListStyle === 'brand' && <BrandSelectorList
                    entries={
                        smartFilterObjectArray(brandItems ?? [], searchVal, i => i.name)
                            .map(it => ({
                                name: it.name,
                                value: it.value,
                                badgePath: it.badgePath,
                                selected: selectedValue === it.value,
                                onSelect: () => onSelect?.(it.value)
                            })
                        )
                    }
                />
            }
            {
                selectorListStyle === 'text' && <TextSelectorList
                    entries={
                        smartFilterObjectArray(textItems ?? [], searchVal, i => i.name)
                            .map(it => ({
                                name: it.name,
                                value: it.value,
                                selected: selectedValue === it.value,
                                onSelect: () => onSelect?.(it.value)
                            })
                        )
                    }
                />
            }
        </div>
    );
}

export default PickerDialog_Filter;
