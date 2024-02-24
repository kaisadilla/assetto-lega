import Dialog from 'elements/Dialog';
import ToolboxRow from 'elements/ToolboxRow';
import React, { HTMLAttributes } from 'react';
import { getClassString } from 'utils';
import PickerDialog_ThumbnailGallery from './PickerDialog.ThumbnailGallery';
import PickerDialog_Thumbnail from './PickerDialog.Thumbnail';
import PickerDialog_Filter from './PickerDialog.Filter';
import { PickerDialog_Image } from './PickerDialog.Image';

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
PickerDialog.ThumbnailGallery = PickerDialog_ThumbnailGallery;
PickerDialog.Thumbnail = PickerDialog_Thumbnail;
PickerDialog.Filter = PickerDialog_Filter;

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
        className,
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

interface PickerDialog_ToolboxProps {
    className?: string;
    children?: React.ReactNode;
}

function PickerDialog_Toolbox ({
    className,
    children,
}: PickerDialog_ToolboxProps) {
    const classStr = getClassString(
        "default-picker-dialog-toolbox",
        className,
    )

    return (
        <ToolboxRow className={classStr}>
            {children}
        </ToolboxRow>
    );
}



export default PickerDialog;
