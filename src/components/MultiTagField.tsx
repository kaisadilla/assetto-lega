import Button from 'elements/Button';
import Icon from 'elements/Icon';
import Textbox from 'elements/Textbox';
import React, { useState } from 'react';
import { getClassString } from 'utils';

export interface MultiTagFieldProps {
    values: string[];
    existingTags: string[];
    className?: string;
    onChange?: (values: string[]) => void;
}

function MultiTagField ({
    values,
    existingTags,
    className,
    onChange,
}: MultiTagFieldProps) {
    const classStr = getClassString(
        "default-control",
        "default-multi-tag-field",
        className,
    );

    const $tags = values.map((tag, i) => (
        <MultiTagFieldTag
            key={i}
            name={tag}
            onRemove={() => handleRemoveValue(i)}
        />
    ))

    return (
        <div className={classStr}>
            {$tags}
            <MultiTagAdder
                onSubmit={handleAddValue}
                suggestions={existingTags}
            />
        </div>
    );
    
    function handleAddValue (name: string) {
        onChange?.([...values, name]);
    }

    function handleRemoveValue (index: number) {
        if (onChange === undefined) return;

        const newArr = [...values];
        newArr.splice(index, 1);

        onChange(newArr);
    }
}

export interface MultiTagFieldTagProps {
    name: string;
    onRemove?: () => void;
}

function MultiTagFieldTag ({
    name,
    onRemove,
}: MultiTagFieldTagProps) {
    return (
        <div className="tag">
            <div className="tag-name">{name}</div>
            <div className="tag-action" onClick={onRemove}>
                <Icon name="fa-close" />
            </div>
        </div>
    );
}

export interface MultiTagAdderProps {
    suggestions: string[];
    onSubmit: (name: string) => void;
}

// todo: add suggestions.
function MultiTagAdder ({
    suggestions,
    onSubmit,
}: MultiTagAdderProps) {
    const [name, setName] = useState("");

    return (
        <div className="tag tag-new">
            <Textbox
                className="tag-textbox"
                value={name}
                suggestions={suggestions}
                onChange={name => setName(name)}
                onBlur={handleBlur}
            />
            <div className="tag-action" onClick={handleAdd}>
                <Icon name="fa-plus" />
            </div>
        </div>
    );

    function handleAdd () {
        onSubmit(name);
        setName("");
    }

    function handleBlur () {
        if (name !== "") {
            handleAdd();
        }
    }
}

export default MultiTagField;