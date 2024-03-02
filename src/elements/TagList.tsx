import React from 'react';
import { getClassString } from 'utils';

export interface TagListProps {
    tags: string[];
    className?: string;
    tagClassName?: string;
}

function TagList ({
    tags,
    className,
    tagClassName,
}: TagListProps) {
    const classStr = getClassString(
        "default-tag-list",
        className,
    );

    return (
        <div className={classStr}>
            {tags.map(t => <Tag
                key={t}
                tag={t}
                className={tagClassName}
            />)}
        </div>
    );
}

interface TagProps {
    tag: string;
    className?: string;
}

function Tag ({
    tag,
    className,
}: TagProps) {
    const classStr = getClassString(
        "default-tag",
        className,
    );

    return (
        <div className={classStr}>
            {tag}
        </div>
    );
}


export default TagList;
