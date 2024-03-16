import React from 'react';
import { getClassString } from 'utils';
import DefaultHighlighter from './Highlighter';

export interface SelectableItemProps extends React.HTMLAttributes<HTMLDivElement> {
    selectionMode: 'border' | 'opacity';
    value: string;
    selectedValue?: string | null;
    borderWidth?: number;
    children: React.ReactNode;
}

function SelectableItem ({
    selectionMode,
    value,
    selectedValue,
    borderWidth,
    children,
    className,
    style,
    ...divProps
}: SelectableItemProps) {
    
    if (selectionMode === 'border') {
        return <_SelectableItemByBorder
            selected={value === selectedValue}
            borderWidth={borderWidth}
            className={className}
            style={style}
            {...divProps}
        >
            {children}
        </_SelectableItemByBorder>
    }
    else {
        return <_SelectableItemByOpacity
            value={value}
            selectedValue={selectedValue}
            className={className}
            style={style}
            {...divProps}
        >
            {children}
        </_SelectableItemByOpacity>
    }
}

interface _SelectableItemByBorderProps extends React.HTMLAttributes<HTMLDivElement> {
    selected: boolean;
    borderWidth?: number;
    children: React.ReactNode;
}

function _SelectableItemByBorder ({
    selected,
    borderWidth = 3,
    children,
    className,
    style,
    ...divProps
}: _SelectableItemByBorderProps) {
    const classStr = getClassString(
        "default-selectable-item-by-border",
        selected && "selected",
        className,
    );
    
    style = {
        ...(style ?? {}),
        margin: `${borderWidth}px`,
    }

    return (
        <div className={classStr} style={style} {...divProps}>
            <div className="item-container">
                {children}
            </div>
        </div>
    );
}

interface _SelectableItemByOpacityProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    selectedValue?: string | null;
    children: React.ReactNode;
}

function _SelectableItemByOpacity ({
    value,
    selectedValue,
    children,
    className,
    style,
    ...divProps
}: _SelectableItemByOpacityProps) {

    const classStr = getClassString(
        "default-selectable-item-by-opacity",
        selectedValue === value && "selected",
        selectedValue && selectedValue !== value && "deselected",
        className,
    );

    return (
        <div className={classStr} {...divProps}>
            <div className="item-container">
                {children}
            </div>
            <DefaultHighlighter
                highlight={false}
            />
        </div>
    );
}


export default SelectableItem;
