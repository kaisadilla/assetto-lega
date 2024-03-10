import React, { CSSProperties } from 'react';
import { getClassString } from 'utils';

export interface ListItem<T> {
    value: T;
    displayName: string;
}

export interface ListProps<T> {
    items: ListItem<T>[];
    allowSelection?: boolean;
    selectedItem?: T;
    onSelect?: (selectedItem: T) => void;
    className?: string;
    style?: CSSProperties;
    tabIndex?: number;
}

function List<T> ({
    items,
    allowSelection = false,
    selectedItem,
    onSelect,
    className,
    style,
    tabIndex = 1,
}: ListProps<T>) {
    const classStr = getClassString(
        "default-list",
        className,
    )

    return (
        <div className={classStr} style={style} tabIndex={tabIndex}>
            {items.map((item, i) => <_ListItemElement
                key={i}
                item={item}
                selected={selectedItem === item.value}
                onSelect={() => handleSelect(item.value)}
            />)}
        </div>
    );

    function handleSelect (value: T) {
        if (allowSelection === false) return;
        if (onSelect === undefined) return;

        onSelect(value);
    }
}

interface _ListItemElementProps<T> {
    item: ListItem<T>;
    selected: boolean;
    onSelect: () => void;
}

function _ListItemElement<T> ({
    item,
    selected,
    onSelect
}: _ListItemElementProps<T>) {
    const classStr = getClassString(
        "list-item",
        selected && "selected",
    );

    return (
        <div className={classStr} onClick={() => onSelect()}>
            {item.displayName}
        </div>
    );
}


export default List;
