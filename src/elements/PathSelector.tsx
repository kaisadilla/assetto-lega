import React from 'react';
import Button from './Button';
import MaterialSymbol from './MaterialSymbol';
import { DEFAULT_TOOLTIP_ID } from 'names';

export interface PathSelectorProps {
    label: string;
    value: string;
    setValue: (value: string) => void;
    isValid?: boolean;
    labelWidth?: number;
}

function PathSelector ({
    label,
    value,
    setValue,
    isValid,
    labelWidth
}: PathSelectorProps) {
    isValid ??= true;

    const $error = (
        <div
            id="error-container"
            className="error-container"
            data-tooltip-id={DEFAULT_TOOLTIP_ID}
            data-tooltip-content="Unable to locate the selected folder."
        >
            <MaterialSymbol symbol="error" />
        </div>
    );
    const style = {};
    //if (labelWidth)

    return (
        <div className="default-path-selector">
            <span className="label">{label}</span>
            <span className="value">{value}</span>
            {isValid && $error}
            <Button>Locate folder</Button>
        </div>
    );
}

export default PathSelector;