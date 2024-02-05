import { WindowType } from 'main/WindowType';
import React from 'react';
import { createPortal } from 'react-dom';

export interface WindowPopupProps {
    /**
     * The type of window to create. Different types of windows have different
     * characteristics.
     */
    type?: WindowType;
    /**
     * The title of the window in the title bar.
     */
    title: string;
    /**
     * The callback function to fire when the window closes. Has a single
     * parameter with the original event object.
     */
    onClose?: (evt: Event) => void;
    children?: React.ReactNode;
}

/**
 * Creates a new window that contains everything within it.
 * @returns 
 */
function WindowPopup ({
    type = WindowType.ResizableBlockingPopup,
    title,
    onClose,
    children,
}: WindowPopupProps) {
    //const $link = document.createElement("link");
    //$link.rel = "stylesheet";
    //$link.type = "text/css";
    //$link.href = "webpack://./src/styles/main.scss";
    //$link.media = "all";

    const $div = document.createElement("div");
    $div.classList.add("window");

    // TODO: Find better way to add styles to new window.
    // This is a hack and may hide bugs.
    const $styles = document.createDocumentFragment();

    document.head.childNodes.forEach(n => {
        const copy = document.importNode(n, true);
        $styles.appendChild(copy);
    });

    const wnd = window.open("", type, title);

    if (!wnd) {
        throw `Error when creating window with title '${title}'.`;
    }

    wnd.onunload = (evt) => onClose?.(evt);
    while (wnd.document.body.firstChild) {
        wnd.document.body.removeChild(wnd.document.body.firstChild);
      }
    
    wnd.document.body.appendChild($div);
    wnd.document.head.appendChild($styles);

    return createPortal(children, $div);
}

export default WindowPopup;