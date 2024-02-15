import React from 'react';
import { getClassString } from 'utils';

export interface FormTitleProps {
    title: string;
    className?: string;
}

function FormTitle ({
    title,
    className,
}: FormTitleProps) {
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

export default FormTitle;
