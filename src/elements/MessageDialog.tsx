import React from 'react';
import CoverPanel from './CoverPanel';
import Dialog from './Dialog';
import { getClassString } from 'utils';
import ToolboxRow from './ToolboxRow';
import Button from './Button';

export interface MessageDialogProps {
    title?: string;
    message: string;
    setOpen: (open: boolean) => void;
    className?: string;
}

function MessageDialog ({
    title,
    message,
    setOpen,
    className,
}: MessageDialogProps) {
    const classStr = getClassString(
        "default-dialog",
        "default-message-dialog",
        className,
    )

    return (
        <CoverPanel>
            <div className={classStr}>
                {title && <h2 className="message-title">{title}</h2>}
                <div className="message-content">{message}</div>
                <ToolboxRow className="message-toolbar">
                    <Button onClick={handleAccept} highlighted>
                        Accept
                    </Button>
                </ToolboxRow>
            </div>
        </CoverPanel>
    );

    function handleAccept () {
        setOpen(false);
    }
}

export default MessageDialog;
