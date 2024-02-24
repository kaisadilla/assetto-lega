import DefaultHighlighter from "elements/Highlighter";
import { getClassString } from "utils";

export interface PickerDialog_ImageProps {
    name: string;
    src: string;
    selected: boolean;
    scale?: number;
    widthScale?: number;
    heightScale?: number;
    onClick: () => void;
    onDoubleClick: () => void;
    className?: string;
    tabIndex?: number;
}

export function PickerDialog_Image ({
    name,
    src,
    selected,
    scale,
    widthScale,
    heightScale,
    onClick,
    onDoubleClick,
    className,
    tabIndex,
}: PickerDialog_ImageProps) {
    const classStr = getClassString(
        "picker-dialog-gallery-item",
        "picker-dialog-image",
        className,
    )

    const style = {} as React.CSSProperties;
    if (scale !== undefined) {
        style.width = `${scale}px`;
        style.height = `${scale}px`;
    }
    if (widthScale !== undefined) style.width = `${widthScale}px`;
    if (heightScale !== undefined) style.height = `${heightScale}px`;

    return (
        <div
            className={classStr}
            onClick={onClick}
            onKeyDown={(evt) => {if (evt.key === "Enter") onClick()}}
            onDoubleClick={onDoubleClick}
            style={style}
            tabIndex={tabIndex}
        >
            <div className="content-container">
                <div className="image-container">
                    <img src={src} />
                </div>
            </div>
            <DefaultHighlighter highlight={selected} />
        </div>
    );
}