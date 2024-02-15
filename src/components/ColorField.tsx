import CoverPanel from 'elements/CoverPanel';
import React, { useState } from 'react';
import { getClassString } from 'utils';
import ColorPickerPhotoshop, { ColorPickerMode } from './ColorPicker';
import ColorPicker from './ColorPicker';
import { SketchPicker } from 'react-color';

export interface ColorFieldProps {
    value: string;
    mode?: ColorPickerMode;
    onChange?: (color: string) => void;
    className?: string;
    tabIndex?: number;
}

function ColorField ({
    value,
    mode = ColorPickerMode.Sketch,
    onChange,
    className,
    tabIndex = 1,
}: ColorFieldProps) {
    const [isPickerOpen, setPickerOpen] = useState(false);

    const classStr = getClassString(
        "default-control",
        "default-color-field",
        className,
    )

    return (
        <div className={classStr} tabIndex={tabIndex}>
            <div className="color-content" onClick={handleClick}>
                <div
                    className="color-field-sample"
                    style={{backgroundColor: value}}
                />
                {value}
            </div>
            {isPickerOpen && (
            <CoverPanel>
                <ColorPicker
                    mode={mode}
                    defaultColor={value}
                    onSelect={handlePickerSelect}
                    onCancel={() => setPickerOpen(false)}
                />
            </CoverPanel>
            )}
        </div>
    );

    function handleClick () {
        setPickerOpen(true);
    }

    function handlePickerSelect (color: string) {
        setPickerOpen(false);
        onChange?.(color);
    }
}

export default ColorField;
