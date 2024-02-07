import React, { useRef, useState } from 'react';
import { getClassString, smartFilterArray } from 'utils';

export interface TextboxProps {
    value?: string;
    suggestions?: string[];
    placeholder?: string;
    onChange?: (value: string) => void;
    className?: string;
}

function Textbox ({
    value = "",
    suggestions,
    placeholder = "---",
    onChange,
    className,
}: TextboxProps) {
    const [isFocused, setFocused] = useState(false);

    const $div = useRef<HTMLDivElement>(null);

    const classStr = getClassString(
        "default-control",
        "default-typebox",
        "default-textbox",
        className,
    );

    return (
        <div
            className={classStr}
            onBlur={handleBlur}
            onFocus={() => setFocused(true)}
            ref={$div}
        >
            <input
                className="input-field"
                type="textbox"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
            />
            {suggestions && isFocused &&
                <TextboxSuggestions
                    suggestions={suggestions}
                    prompt={value}
                    onClick={handleSuggestionClick}
                />
            }
        </div>
    );

    function handleBlur (evt: React.FocusEvent<HTMLDivElement, HTMLElement>) {
        const target = evt.currentTarget;

        // Give the app time to focus the next element.
        requestAnimationFrame(() => {
            // check if the new focused element is a child of this element
            // (i.e. the suggestions menu).
            if (target.contains(document.activeElement) === false) {
                setFocused(false);
            }
        })
    }

    function handleChange (evt: React.ChangeEvent<HTMLInputElement>) {
        // just in case
        setFocused(true);
        if (onChange === undefined) return;

        const newValue = evt.target.value;
        onChange(newValue);
    }

    function handleSuggestionClick (value: string) {
        onChange?.(value)
        // hide the suggestion menu when a value is chosen.
        setFocused(false);
    }
}

export interface TextboxSuggestionsProps {
    suggestions: string[];
    prompt: string;
    onClick: (value: string) => void;
}

function TextboxSuggestions ({
    suggestions,
    prompt,
    onClick,
}: TextboxSuggestionsProps) {
    const filteredSuggestions = smartFilterArray(suggestions, prompt);

    const $suggestions = filteredSuggestions.map(s => (
        <div key={s} className="suggestion" onClick={() => onClick(s)}>
            {s}
        </div>
    ));

    return (
        <div
            className="textbox-suggestions"
            tabIndex={100}
        >
            {$suggestions}
        </div>
    );
}

export default Textbox;