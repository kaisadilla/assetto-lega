import React, { useRef, useState } from 'react';
import { getClassString, smartFilterArray } from 'utils';
import Dropdown from './Dropdown';

export interface TextboxProps {
    value?: string;
    suggestions?: string[];
    placeholder?: string;
    pattern?: RegExp;
    readonly?: boolean;
    onChange?: (value: string) => void;
    onBlur?: (evt: React.FocusEvent<HTMLDivElement, HTMLElement>) => void;
    className?: string;
}

function Textbox ({
    value = "",
    suggestions,
    placeholder = "---",
    pattern,
    readonly,
    onChange,
    onBlur,
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
                readOnly={readonly}
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

        onBlur?.(evt);
    }

    function handleChange (evt: React.ChangeEvent<HTMLInputElement>) {
        // just in case
        setFocused(true);
        if (onChange === undefined) return;

        const newValue = evt.target.value;

        if (pattern && pattern.test(newValue) === false) {
            return;
        }
        
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
        <Dropdown
            className="textbox-suggestions"
            tabIndex={1}
        >
            {$suggestions}
        </Dropdown>
    );
}

export default Textbox;