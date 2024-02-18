import React from 'react';
import { getClassString } from 'utils';

export interface Form_TitleProps {
    title: string;
    className?: string;
}

function Form_Title ({
    title,
    className,
}: Form_TitleProps) {
    const classStr = getClassString(
        "default-form-title",
        className,
    )

    return (
        <h3 className={classStr}>
            {title}
        </h3>
    );
}

export default Form_Title;
