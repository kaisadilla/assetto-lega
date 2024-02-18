import React from 'react';
import { getClassString } from 'utils';
import Form_Title from './Form.Title';
import Form_Section from './Form.Section';

export interface FormProps {
    className?: string;
    children?: React.ReactNode;
}

function Form ({
    className,
    children,
}: FormProps) {
    const classStr = getClassString(
        "default-form",
        className,
    )

    return (
        <div className={classStr}>
            {children}
        </div>
    );
}

Form.Title = Form_Title;
Form.Section = Form_Section;

export default Form;
