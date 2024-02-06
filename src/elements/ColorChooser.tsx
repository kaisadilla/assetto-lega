import React from 'react';
import { getClassString } from 'utils';

export interface ColorChooserProps {
    options: {[key: string]: string};
    selectedOption: string;
    onChange?: (key: string) => void;
}

function ColorChooser ({
    options,
    selectedOption,
    onChange,
}: ColorChooserProps) {
    const $colors = (() => {
        const arr = [];

        for (const key in options) {
            const color = options[key];
            const classStr = getClassString(
                "color-option",
                selectedOption === key && "selected",
            )

            arr.push(
                <div
                    key={key}
                    className={classStr}
                    style={{backgroundColor: color}}
                    onClick={() => onChange?.(key)}
                >
                    <div className="highlighter" />
                </div>
            );
        }

        return arr;
    })();

    return (
        <div className="default-color-chooser">
            {$colors}
        </div>
    );
}

export default ColorChooser;