import React, { useEffect, useRef, useState } from 'react';
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
    thumbnail: JSX.Element;
}

export interface PickerDialog_ThumbnailGalleryProps {
    sections: PickerElementSection[];
    selectedElement: string | null;
    onSelect: (value: string) => void;
    onDoubleClickItem: (value: string) => void;
    focusedSection?: string | null;
    className?: string;
}

function PickerDialog_ThumbnailGallery ({
    sections,
    selectedElement,
    onSelect,
    onDoubleClickItem,
    focusedSection,
    className,
}: PickerDialog_ThumbnailGalleryProps) {
    const classStr = getClassString(
        "default-picker-thumbnail-selector",
        className,
    );

    return (
        <PickerDialog.GalleriesSection className={classStr}>
            {
                sections.map((s, i) => (
                    <Section
                        key={i}
                        section={s}
                        selectedElement={selectedElement}
                        onSelect={onSelect}
                        onDoubleClick={onDoubleClickItem}
                        focusedSection={focusedSection}
                    />
                ))
            }
        </PickerDialog.GalleriesSection>
    );
}

interface SectionProps {
    section: PickerElementSection;
    selectedElement: string | null;
    onSelect: (value: string) => void;
    onDoubleClick: (value: string) => void;
    focusedSection?: string | null;
    tabIndex?: number;
}

function Section ({
    section,
    selectedElement,
    onSelect,
    onDoubleClick,
    focusedSection,
    tabIndex = 1,
}: SectionProps) {
    // TODO: use PickerDialog.SectionTitle instead of h2 (with ref).
    const $title = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        //console.info("new ref for " + section.title, $title);
        if (focusedSection === section.title) {
            $title.current?.scrollIntoView({behavior: 'instant'});
        }
    }, [$title, focusedSection])

    return (
        <>
            <h2 ref={$title}>
                {section.title}
            </h2>
            <PickerDialog.Gallery>
                {section.elements.map(el => (
                    <PickerDialog.Thumbnail
                        key={el.value}
                        content={el.thumbnail}
                        selected={selectedElement === el.value}
                        onClick={() => onSelect(el.value)}
                        onDoubleClick={() => onDoubleClick(el.value)}
                        tabIndex={tabIndex}
                    />
                ))}
            </PickerDialog.Gallery>
        </>
    );
}

export default PickerDialog_ThumbnailGallery;
