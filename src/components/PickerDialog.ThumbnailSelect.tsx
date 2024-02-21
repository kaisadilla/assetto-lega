import React, { useState } from 'react';
import PickerDialog from './PickerDialog';
import Button from 'elements/Button';
import ScaleScroll from 'elements/ScaleScroll';
import ToolboxRow from 'elements/ToolboxRow';
import { clampNumber, getClassString } from 'utils';

export interface PickerElementSection {
    title: string;
    elements: PickerElement[];
}

export interface PickerElement {
    value: string;
    imagePath: string;
    displayName: string;
}

export interface PickerDialog_ThumbnailSelectorProps {
    sections: PickerElementSection[];
    selectedElement: string | null;
    width: number;
    onSelect: (value: string) => void;
    className?: string;
}

function PickerDialog_ThumbnailSelector ({
    sections,
    selectedElement,
    width,
    onSelect,
    className,
}: PickerDialog_ThumbnailSelectorProps) {
    const classStr = getClassString(
        "default-picker-thumbnail-selector",
        className,
    )

    return (
        <PickerDialog.GalleriesSection className={classStr}>
            {
                sections.map(s => (
                    <Section
                        section={s}
                        selectedElement={selectedElement}
                        width={width}
                        onSelect={onSelect}
                    />
                ))
            }
        </PickerDialog.GalleriesSection>
    );
}

interface SectionProps {
    section: PickerElementSection;
    selectedElement: string | null;
    width: number;
    onSelect: (value: string) => void;
    tabIndex?: number;
}

function Section ({
    section,
    selectedElement,
    width,
    onSelect,
    tabIndex = 1,
}: SectionProps) {

    return (
        <>
            <PickerDialog.SectionTitle>
                {section.title}
            </PickerDialog.SectionTitle>
            <PickerDialog.Gallery>
                {section.elements.map(el => (
                    <PickerDialog.Thumbnail
                        key={el.value}
                        name={el.displayName}
                        src={el.imagePath}
                        selected={selectedElement === el.value}
                        width={width}
                        onClick={() => onSelect(el.value)}
                        onDoubleClick={() => {}}
                        tabIndex={tabIndex}
                    />
                ))}
            </PickerDialog.Gallery>
        </>
    );
}

export default PickerDialog_ThumbnailSelector;
