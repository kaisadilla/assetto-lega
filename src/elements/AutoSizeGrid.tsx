import React from 'react';
import { clampNumber } from 'utils';

export interface AutoSizeGridProps  extends React.HTMLAttributes<HTMLDivElement> {
    minElementWidth: number;
    maxElementWidth: number;
    containerGapWidth: number;
    containerWidth: number;
    containerPadding: number;
    prioritizeSize?: 'biggest' | 'smallest';
    children: React.ReactNode;
}

function AutoSizeGrid ({
    minElementWidth,
    maxElementWidth,
    containerGapWidth,
    containerWidth,
    containerPadding,
    prioritizeSize = 'smallest',
    children,
    ...divProps
}: AutoSizeGridProps) {
    // for all intents and purposes, padding is just not part of the container.
    containerWidth -= containerPadding;

    const elementCount = React.Children.count(children);
    // whether we prioritize big or small elements.
    const prioBig = prioritizeSize === 'biggest';

    // the last item doesn't have a gap after it, so we can pretend the max width
    // includes that gap to simplify that calculation.
    const containerRealWidth = containerWidth + containerGapWidth;
    // As we consider the gap _after_ the element to be part of the element itself,
    // we add one gap to each element's widths.
    const elementRealMin = minElementWidth + containerGapWidth;
    const elementRealMax = maxElementWidth + containerGapWidth;

    const minElementsPerRow = Math.floor(containerRealWidth / elementRealMax);
    const maxElementsPerRow = Math.floor(containerRealWidth / elementRealMin);

    // to decide how many elements we want per row, we'll try to get an amount
    // that leaves no row with empty spaces. If that's not possible, we'll prio-
    // ritize leaving as few spaces on the row as possible (since rows with very
    // few elements look weirder).

    // The user can specify whether to prefer bigger or smaller elements. This
    // means that the loop should start counting from fewest to most elements
    // per row when the user wants bigger elements, or viceversa if they want
    // smaller ones.
    const loopStart = prioBig ? minElementsPerRow : maxElementsPerRow;
    const loopEnd = prioBig ? maxElementsPerRow : minElementsPerRow;
    const loopStep = prioBig ? +1 : -1;

    // `bestElementsPerRow` contains the amount of elements that best fit this
    // requirement right now.
    let bestElementsPerRow = loopStart;
    // `remainder` contains the amount of elements in the last row with the
    // currently selected value.
    let remainder = elementCount % loopStart;

    // If we want to get the biggest possible elements, we'll start counting 
    for (let i = loopStart + 1; i >= loopEnd; i += loopStep) {
        // if the remainder currently is 0, we found the best possible element
        // count per row.
        if (remainder === 0) break;

        const remainderForI = elementCount % i;
        // if the remainder for `i` is bigger than the remainder for the
        // currently chosen amount, or if it's 0 (the ideal), `i` becomes the
        // new chosen amount.
        if (remainderForI === 0 || remainderForI > remainder) {
            bestElementsPerRow = i;
            remainder = remainderForI;
        }
    }

    let elementSize = Math.floor(containerWidth / bestElementsPerRow) - containerGapWidth;
    elementSize = clampNumber(elementSize, minElementWidth, maxElementWidth);

    return (
        <div {...divProps}>
            {React.Children.map(children, c => {
                if (React.isValidElement(c)) {
                    return React.cloneElement(c as React.ReactElement<any>, {
                        style: {
                            ...(c.props.style ?? {}),
                            width: elementSize,
                        }
                    });
                }
                return c;
            })}
        </div>
    );
}

export default AutoSizeGrid;
