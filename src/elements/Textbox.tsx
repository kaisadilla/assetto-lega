import React, { useEffect, useRef, useState } from 'react';
import { LOCALE, getClassString, smartFilterArray } from 'utils';
import Dropdown from './Dropdown';
import { useSettingsContext } from 'context/useSettings';

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
        readonly && "readonly",
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
            {suggestions && isFocused && value.length !== undefined && value.length > 1 &&
                <TextboxSuggestions
                    parent={$div}
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
    parent: React.RefObject<HTMLDivElement>;
    suggestions: string[];
    prompt: string;
    onClick: (value: string) => void;
}

function TextboxSuggestions ({
    parent,
    suggestions,
    prompt,
    onClick,
}: TextboxSuggestionsProps) {
    const { searchMode } = useSettingsContext();

    const [dropdownStyle, setDropdownStyle] = useState({});
    
    useEffect(() => {
        if (!parent.current) return;

        const rect = parent.current.getBoundingClientRect();

        setDropdownStyle({
            top: rect.top + rect.height - 1,
            left: rect.left,
            width: rect.width,
        });
    }, []);

    prompt = prompt.toLocaleLowerCase(LOCALE);

    let filteredSuggestions = [] as string[];
    
    if (prompt.length > 1) {
        if (searchMode === 'smart') {
            filteredSuggestions = smartFilterArray(suggestions, prompt);
        }
        else {
            filteredSuggestions = suggestions.filter(
                s => s.toLocaleLowerCase(LOCALE).includes(prompt)
            );
        }
    }

    const $suggestions = filteredSuggestions.map(s => (
        <div key={s} className="suggestion" onClick={() => onClick(s)}>
            {s}
        </div>
    ));

    return (
        <Dropdown
            className="textbox-suggestions"
            style={dropdownStyle}
            tabIndex={1}
        >
            {$suggestions}
        </Dropdown>
    );
}

export default Textbox;