import React from 'react';
import { getClassString } from 'utils';

export interface Form_SectionProps {
    horizontalAlignment?: 'left' | 'center' | 'right';
    verticalAlignment?: 'top' | 'center' | 'bottom';
    className?: string;
    children?: React.ReactNode;
}

function Form_Section ({
    horizontalAlignment = 'left',
    verticalAlignment = 'top',
    className,
    children,
}: Form_SectionProps) {
    const classStr = getClassString(
        "default-form-section",
        className,
    )

    const style = {
        justifyContent: (() => {
            if (verticalAlignment === 'top') return "start";
            if (verticalAlignment === 'center') return "safe center";
            if (verticalAlignment === 'bottom') return "end";
        })(),
        alignItems: (() => {
            if (horizontalAlignment === 'left') return "start";
            if (horizontalAlignment === 'center') return "safe center";
            if (horizontalAlignment === 'right') return "end";
        })(),
    }

    return (
        <div className={classStr} style={style}>
            {children}
        </div>
    );
}

export default Form_Section;
