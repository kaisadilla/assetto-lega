import React from 'react';

export interface DiscardableCoverPanelProps {
    onClose: () => void;
    children: React.ReactNode;
}

function DiscardableCoverPanel ({
    onClose,
    children,
}: DiscardableCoverPanelProps) {

    return (
        <div
            className="default-control discardable-cover-panel"
            onClick={handleClick}
            onContextMenu={() => onClose()}
        >
            {children}
        </div>
    );

    function handleClick (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        onClose();
        evt.stopPropagation();
    }
}

export default DiscardableCoverPanel;
