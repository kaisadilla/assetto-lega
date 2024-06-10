import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { getClassString } from 'utils';
import Dropdown from './Dropdown';
import MaterialSymbol from './MaterialSymbol';

export interface DropdownItem<T> {
    value: T;
    displayName: string;
}

export interface DropdownFieldProps<T> {
    items: DropdownItem<T>[];
    selectedItem?: T;
    onSelect?: (selectedItem: T) => void;
    className?: string;
    style?: CSSProperties;
    tabIndex?: number;
}

function DropdownField<T> ({
    items,
    selectedItem,
    onSelect,
    className,
    style,
    tabIndex = 1,
}: DropdownFieldProps<T>) {
    const $field = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    
    useEffect(() => {
        if (!$field.current) return;

        const rect = $field.current.getBoundingClientRect();

        setDropdownStyle({
            top: rect.top + rect.height,
            left: rect.left,
            width: rect.width,
        });
    }, [isDropdownOpen]);

    const classStr = getClassString(
        "default-control",
        "default-dropdown-field",
        className,
    )

    const displayValue = items.find(
        i => i.value === selectedItem
    )?.displayName ?? "";

    return (
        <div
            ref={$field}
            className={classStr}
            style={style}
            tabIndex={tabIndex}
            onBlur={handleBlur}
        >
            <div
                className="field-display-value"
                onClick={() => setDropdownOpen(true)}
            >
                {displayValue}
                <MaterialSymbol symbol='arrow_drop_down' />
            </div>
            {isDropdownOpen && <Dropdown
                className="dropdown-field-menu"
                style={dropdownStyle}
            >
                {items.map(i => <div
                    className="dropdown-item"
                    onClick={() => handleOptionSelect(i.value)}
                >
                    {i.displayName}
                </div>)}
            </Dropdown>}
        </div>
    );

    function handleBlur (evt: React.FocusEvent<HTMLDivElement, HTMLElement>) {
        const target = evt.currentTarget;

        // Give the app time to focus the next element.
        requestAnimationFrame(() => {
            // check if the new focused element is a child of this element
            // (i.e. the suggestions menu).
            if (target.contains(document.activeElement) === false) {
                setDropdownOpen(false);
            }
        })
    }

    function handleOptionSelect (value: T) {
        onSelect?.(value);
        setDropdownOpen(false);
    }
}

export default DropdownField;
