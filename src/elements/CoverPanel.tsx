import React from 'react';

export interface CoverPanelProps {
    onClose?: () => void;
    children: React.ReactNode;
}

function CoverPanel ({
    onClose,
    children,
}: CoverPanelProps) {
    return (
        <div className="default-control cover-panel">
            {children}
        </div>
    );
}

export default CoverPanel;