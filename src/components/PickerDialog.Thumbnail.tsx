import CarThumbnail from 'elements/CarThumbnail';
import DefaultHighlighter from 'elements/Highlighter';
import Thumbnail from 'elements/Thumbnail';
import React from 'react';
import { getClassString } from 'utils';

export interface PickerDialog_ThumbnailProps {
    content: JSX.Element;
    selected: boolean;
    onClick: () => void;
    onDoubleClick: () => void;
    className?: string;
    tabIndex?: number;
}

function PickerDialog_Thumbnail ({
    content,
    selected,
    onClick,
    onDoubleClick,
    className,
    tabIndex,
}: PickerDialog_ThumbnailProps) {
    const classStr = getClassString(
        "picker-dialog-gallery-item",
        "picker-dialog-thumbnail",
        className,
    )

    return (
        <div
            className={classStr}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            tabIndex={tabIndex}
        >
            <div className="content-container">
                {content}
            </div>
            <DefaultHighlighter highlight={selected} />
        </div>
    );
}

export default PickerDialog_Thumbnail;
