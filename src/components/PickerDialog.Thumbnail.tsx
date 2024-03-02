import CarThumbnail from 'elements/CarThumbnail';
import DefaultHighlighter from 'elements/Highlighter';
import Thumbnail from 'elements/Thumbnail';
import React, { useEffect, useRef } from 'react';
import { getClassString } from 'utils';

export interface PickerDialog_ThumbnailProps {
    content: JSX.Element;
    selected: boolean;
    width: number;
    onClick: () => void;
    onDoubleClick: () => void;
    className?: string;
    tabIndex?: number;
}

function PickerDialog_Thumbnail ({
    content,
    selected,
    width,
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

    const $div = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selected) {
            $div.current?.scrollIntoView();
        }
    }, [$div]);

    return (
        <div
            ref={$div}
            className={classStr}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            tabIndex={tabIndex}
            style={{width: `${width}px`}}
        >
            <div className="content-container">
                {content}
            </div>
            <DefaultHighlighter highlight={selected} />
        </div>
    );
}

export default PickerDialog_Thumbnail;
