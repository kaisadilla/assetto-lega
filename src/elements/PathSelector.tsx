import React, { useEffect, useState } from 'react';
import Button from './Button';
import MaterialSymbol from './MaterialSymbol';
import { DEFAULT_TOOLTIP_ID } from 'names';
import Ipc from 'main/ipc/ipcRenderer';

export interface PathSelectorStatus {
    isValid: boolean;
    message?: string;
}

export interface PathSelectorProps {
    mode: "file" | "folder";
    label: string;
    value: string;
    /**
     * The width of the label, in pixels.
     */
    labelWidth?: number;
    status?: PathSelectorStatus;
    onChange?: (path: string) => void;
}

function PathSelector ({
    mode,
    label,
    value,
    labelWidth,
    status,
    onChange,
}: PathSelectorProps) {
    // if no status is given, then it's assumed valid.
    status ??= { isValid: true };

    const style: React.CSSProperties = {};
    if (labelWidth) {
        style.width = labelWidth + "px";
    }

    return (
        <div className="default-control default-path-selector">
            <span className="label" style={style}>{label}</span>
            <span className="value">{value}</span>
            {status.isValid === false && <PathSelectorError message={status?.message} />}
            <Button onClick={openFolder}>Locate folder</Button>
        </div>
    );

    async function openFolder () {
        const chosenPath = await Ipc.openDirectory();
        onChange?.(chosenPath);
    }
}

function PathSelectorError ({message}: {message?: string}) {
    return (
        <div
        id="error-container"
        className="error-container"
        data-tooltip-id={DEFAULT_TOOLTIP_ID}
        data-tooltip-content={message ?? "Invalid value."}
        >
            <MaterialSymbol symbol="error" />
        </div>
    );
}

export default PathSelector;