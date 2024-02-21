import React from 'react';
import { getClassString } from 'utils';

export interface DefaultHighlighterProps {
    highlight: boolean;
    className?: string;
}

function DefaultHighlighter ({
    highlight,
    className,
}: DefaultHighlighterProps) {
    const classStr = getClassString(
        "default-highlighter",
        highlight && "highlight",
        className,
    )

    return (
        <div className={classStr} />
    );
}

export default DefaultHighlighter;
