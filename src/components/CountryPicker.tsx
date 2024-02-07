import Button from 'elements/Button';
import Dialog from 'elements/Dialog';
import ToolboxRow from 'elements/ToolboxRow';
import React, { useState } from 'react';

export interface CouuntryPickerProps {
    preSelectedCountry: string | null;
    onSelect: (selectedCountry: string | null) => void;
    onCancel?: (selectedCountry: string | null) => void;
}

function CouuntryPicker ({
    preSelectedCountry,
    onSelect,
    onCancel,
}: CouuntryPickerProps) {
    const [selectedCountry, setSelectedCountry] = useState(
        preSelectedCountry ?? null
    );

    return (
        <Dialog className="default-country-picker">
            <div className="country-list">
                pick!
            </div>
            <ToolboxRow className="image-picker-toolbox">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                    highlighted
                    disabled={selectedCountry === null}
                    onClick={handleSelect}
                >
                    Select
                </Button>
            </ToolboxRow>
        </Dialog>
    );

    async function handleSelect () {
        onSelect(selectedCountry);
    }

    async function handleCancel () {
        onCancel?.(selectedCountry);
    }
}

export default CouuntryPicker;