import React from 'react';
import CoverPanel from './CoverPanel';
import Dialog from './Dialog';
import { getClassString } from 'utils';
import ToolboxRow from './ToolboxRow';
import Button from './Button';

export interface ConfirmDialogProps {
    title?: string;
    message: string;
    acceptText?: string;
    cancelText?: string;
    onAccept: () => void;
    onCancel?: () => void;
    setOpen: (open: boolean) => void;
    className?: string;
}

function ConfirmDialog ({
    title,
    message,
    acceptText,
    cancelText,
    onAccept,
    onCancel,
    setOpen,
    className,
}: ConfirmDialogProps) {
    const classStr = getClassString(
        "default-dialog",
        "default-message-dialog",
        "default-confirm-dialog",
        className,
    )

    return (
        <CoverPanel>
            <div className={classStr}>
                {title && <h2 className="message-title">{title}</h2>}
                <div className="message-content">{message}</div>
                <ToolboxRow className="message-toolbar">
                    <Button onClick={handleCancel}>
                        {cancelText ?? "Cancel"}
                    </Button>
                    <Button onClick={handleAccept} highlighted>
                        {acceptText ?? "Accept"}
                    </Button>
                </ToolboxRow>
            </div>
        </CoverPanel>
    );

    function handleCancel () {
        onCancel?.();
        setOpen(false);
    }

    function handleAccept () {
        onAccept();
        setOpen(false);
    }
}

export default ConfirmDialog;
