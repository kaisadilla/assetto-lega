import Dialog from 'elements/Dialog';
import ToolboxRow from 'elements/ToolboxRow';
import React from 'react';
import { getClassString } from 'utils';

export type PickerImageBackgroundColor = "dark" | "transparent" | "white";

export interface PickerDialogProps {
    className?: string;
    children?: React.ReactNode;
}

function PickerDialog ({
    className,
    children,
}: PickerDialogProps) {
    const classStr = getClassString(
        "default-picker-dialog",
        className,
    )

    return (
        <Dialog className={classStr}>
            {children}
        </Dialog>
    );
}

PickerDialog.GalleriesSection = PickerDialog_GalleriesSection;
PickerDialog.SectionTitle = PickerDialog_SectionTitle;
PickerDialog.Gallery = PickerDialog_Gallery;
PickerDialog.Image = PickerDialog_Image;
PickerDialog.Toolbox = PickerDialog_Toolbox;

interface PickerDialog_GalleriesSectionProps {
    imageBackgroundColor?: PickerImageBackgroundColor;
    className?: string;
    children?: React.ReactNode;
}

function PickerDialog_GalleriesSection ({
    imageBackgroundColor = 'transparent',
    className,
    children,
}: PickerDialog_GalleriesSectionProps) {
    const classStr = getClassString(
        "default-picker-dialog-gallery-section",
        imageBackgroundColor,
    )

    return (
        <div className={classStr}>
            {children}
        </div>
    );
}

interface PickerDialog_SectionTitleProps {
    className?: string;
    children?: React.ReactNode;
}

function PickerDialog_SectionTitle ({
    className,
    children,
}: PickerDialog_SectionTitleProps) {

    return (
        <h2>{children}</h2>
    );
}

interface PickerDialog_GalleryProps {
    className?: string;
    children?: React.ReactNode;
}

function PickerDialog_Gallery ({
    className,
    children,
}: PickerDialog_GalleryProps) {
    const classStr = getClassString(
        "default-picker-dialog-gallery",
        className,
    )

    return (
        <div className={classStr}>
            {children}
        </div>
    );
}

interface PickerDialog_ImageProps {
    name: string;
    src: string;
    selected: boolean;
    scale?: number;
    onClick: () => void;
    onDoubleClick: () => void;
    tabIndex?: number;
}

function PickerDialog_Image ({
    name,
    src,
    selected,
    scale,
    onClick,
    onDoubleClick,
    tabIndex,
}: PickerDialog_ImageProps) {
    const classStr = getClassString(
        "picker-dialog-image",
        selected && "selected",
    )

    const style = scale ? {
        width: `${scale}px`,
        height: `${scale}px`,
    } : {};

    return (
        <div
            className={classStr}
            onClick={onClick}
            onKeyDown={(evt) => {if (evt.key === "Enter") onClick()}}
            onDoubleClick={onDoubleClick}
            style={style}
            tabIndex={tabIndex}
        >
            <div className="image-highlighter" />
            <img src={src} />
        </div>
    );
}

interface PickerDialog_ToolboxProps {
    className?: string;
    children?: React.ReactNode;
}

function PickerDialog_Toolbox ({
    className,
    children,
}: PickerDialog_ToolboxProps) {

    return (
        <ToolboxRow className="default-picker-dialog-toolbox">
            {children}
        </ToolboxRow>
    );
}



export default PickerDialog;
