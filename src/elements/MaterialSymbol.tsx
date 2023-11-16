import React from 'react';
import "material-symbols";
import { MaterialSymbol as Symbol } from "material-symbols";
import { getClassString } from 'utils';

export interface MaterialSymbolProps {
    symbolStyle?: "sharp" | "rounded" | "outlined";
    symbol: Symbol;
    className?: string;
}

function MaterialSymbol ({
    symbolStyle = "sharp",
    symbol,
    className
}: MaterialSymbolProps) {
    const classStr = getClassString(
        ["material-symbols-sharp", symbolStyle === "sharp"],
        ["material-symbols-rounded", symbolStyle === "rounded"],
        ["material-symbols-outlined", symbolStyle === "outlined"],
        className,
    )

    return (
        <span className={classStr}>{symbol}</span>
    );
}

export default MaterialSymbol;