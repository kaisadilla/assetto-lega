import React, { useEffect, useState } from 'react';
import { getClassString } from 'utils';
import DiscardableCoverPanel from './DiscardableCoverPanel';
import { createPortal } from 'react-dom';
import Dropdown from './Dropdown';

export type CustomizableContextMenuControl = {
    forceClose?: () => void;
}

export interface CustomizableContextMenuProps {
    target: React.RefObject<HTMLElement>;
    /**
     * The object where this element will store methods that can be called from
     * its parent.
     */
    control: CustomizableContextMenuControl;
    children: React.ReactNode;
    className?: string;
}

function CustomizableContextMenu ({
    target,
    control,
    children,
    className,
}: CustomizableContextMenuProps) {
    control.forceClose = forceClose;

    const [position, setPosition] = useState<{x: number, y: number} | null>(null);

    useEffect(() => {
        target.current?.addEventListener('contextmenu', rightClickListener);

        return (() => {
            target.current?.removeEventListener('contextmenu', rightClickListener);
        });
    }, [target.current]);

    if (position === null) {
        return <></>;
    }

    const classStr = getClassString(
        "customizable-context-menu",
        className,
    )

    const style = {
        top: position.y,
        left: position.x,
    }

    return (
        <DiscardableCoverPanel onClose={() => setPosition(null)}>
            <div
                className={classStr}
                style={style}
                onClick={evt => evt.stopPropagation()}
                onDoubleClick={evt => evt.stopPropagation()}
            >
                {children}
            </div>
        </DiscardableCoverPanel>
    );

    function rightClickListener (evt: MouseEvent) {
        if (evt.clientX && evt.clientY) {
            setPosition({x: evt.clientX, y: evt.clientY});
        }
    }

    function forceClose () {
        setPosition(null);
    }
}

export default CustomizableContextMenu;
