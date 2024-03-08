import React, { useState } from 'react';
import Checkbox from './Checkbox';
import Textbox from './Textbox';
import Icon from './Icon';
import MaterialSymbol from './MaterialSymbol';

export interface EditableListProps {
    items: string[];
    checkedItems?: string[];
    allowRemove?: boolean;
    minimumNumberOfItems?: number;
    onChangeList?: (items: string[]) => void;
    onChangeCheckedItems?: (checkedItems: string[]) => void;
    className?: string;
}

function EditableList ({
    items,
    checkedItems,
    allowRemove = false,
    minimumNumberOfItems = 0,
    onChangeList,
    onChangeCheckedItems,
    className,
}: EditableListProps) {
    const [newItem, setNewItem] = useState("");

    const isChecklistMode = checkedItems !== undefined;

    const canRemove = allowRemove && (items.length > minimumNumberOfItems);

    return (
        <div className="default-editable-list">
            {items.map(i => <ListEntry
                item={i}
                checklistMode={isChecklistMode}
                allowRemove={canRemove}
                checked={checkedItems?.includes(i)}
                onCheck={() => handleCheckItem(i)}
                onDelete={() => handleDeleteItem(i)}
            />)}
            <div className="list-entry add-entry">
                <Textbox
                    value={newItem}
                    onChange={str => setNewItem(str)}
                    placeholder="new category..."
                />
                <div className="tag-action" onClick={() => handleAddItem()}>
                    <Icon className="tag-action-symbol" name="fa-plus" />
                </div>
            </div>
        </div>
    );

    function handleCheckItem (item: string) {
        if (checkedItems === undefined) return;
        if (onChangeCheckedItems === undefined) return;

        let update = [...checkedItems];
        if (update.includes(item)) {
            update = update.filter(i => i !== item);
        }
        else {
            update.push(item);
        }

        onChangeCheckedItems?.(update);
    }

    function handleAddItem () {
        if (newItem === "") return;
        if (items.includes(newItem) === true) return;

        onChangeList?.([...items, newItem]);
        if (checkedItems) {
            onChangeCheckedItems?.([...checkedItems, newItem]);
        }

        setNewItem("");
    }

    function handleDeleteItem (deletedItem: string) {
        if (items.length <= minimumNumberOfItems) return;

        const update = items.filter(i => i !== deletedItem);
        onChangeList?.(update);
    }
}

interface ListEntryProps {
    item: string;
    checklistMode: boolean;
    allowRemove: boolean;
    checked?: boolean;
    onCheck?: (checked: boolean) => void;
    onDelete?: () => void;

}

function ListEntry ({
    item,
    checklistMode,
    allowRemove,
    checked = false,
    onCheck,
    onDelete,
}: ListEntryProps) {

    return (
        <div className="list-entry existing-entry">
            {checklistMode && <Checkbox
                value={checked}
                onChange={onCheck}
            />}
            <div className="name">{item}</div>
            {allowRemove && <div className="tag-action" onClick={() => onDelete?.()}>
                <Icon name="fa-close" />
            </div>}
        </div>
    );
}


export default EditableList;
