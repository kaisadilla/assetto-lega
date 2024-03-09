import React from 'react';
import CoverPanel from './CoverPanel';
import { getClassString } from 'utils';
import ToolboxRow from './ToolboxRow';
import Button from './Button';

export interface ContentDialogProps {
    children: React.ReactNode;
    onAccept?: () => void;
    onCancel?: () => void;
    className?: string;
}

function ContentDialog ({
    children,
    onAccept,
    onCancel,
    className,
}: ContentDialogProps) {
    const classStr = getClassString(
        "default-dialog",
        "default-message-dialog",
        "default-content-dialog",
        className,
    );

    return (
        <CoverPanel>
            <div className={classStr}>
                <div className="content">
                    {children}
                </div>
                <ToolboxRow className="message-toolbar">
                    <Button onClick={() => onCancel?.()}>
                        Cancel
                    </Button>
                    <Button onClick={() => onAccept?.()} highlighted>
                        Accept
                    </Button>
                </ToolboxRow>
            </div>
        </CoverPanel>
    );
}

export default ContentDialog;
