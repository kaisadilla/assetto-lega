import React, { useEffect, useRef, useState } from 'react';
import Checkbox from './Checkbox';
import Textbox from './Textbox';
import Icon from './Icon';
import MaterialSymbol from './MaterialSymbol';
import { getClassString } from 'utils';

export interface EditableListProps {
    items: string[];
    checkedItems?: string[];
    allowRename?: boolean;
    allowRemove?: boolean;
    minimumNumberOfItems?: number;
    onChangeList?: (items: string[]) => void;
    onChangeCheckedItems?: (checkedItems: string[]) => void;
    className?: string;
}

function EditableList ({
    items,
    checkedItems,
    allowRename = false,
    allowRemove = false,
    minimumNumberOfItems = 0,
    onChangeList,
    onChangeCheckedItems,
    className,
}: EditableListProps) {
    const [newItem, setNewItem] = useState("");

    const $addEntry = useRef<HTMLDivElement>(null);

    const isChecklistMode = checkedItems !== undefined;

    const canRemove = allowRemove && (items.length > minimumNumberOfItems);

    const classStr = getClassString(
        "default-editable-list",
        className,
    );

    useEffect(() => {
        $addEntry.current?.scrollIntoView();
    }, [items.length]);

    return (
        <div className={classStr}>
            {items.map(i => <ListEntry
                item={i}
                checklistMode={isChecklistMode}
                allowRename={allowRename}
                allowRemove={canRemove}
                checked={checkedItems?.includes(i)}
                onRename={str => handleRenameItem(i, str)}
                onCheck={() => handleCheckItem(i)}
                onDelete={() => handleDeleteItem(i)}
            />)}
            <div ref={$addEntry} className="list-entry add-entry">
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

    function handleRenameItem (item: string, newName: string) {
        if (newName === "") return;
        if (items.includes(newItem)) return;

        if (onChangeList !== undefined) {
            const itemsUpd = [...items];
            const itemsIndex = itemsUpd.indexOf(item);
            if (itemsIndex === -1) return;
    
            itemsUpd[itemsIndex] = newName;
            onChangeList?.(itemsUpd);
        }

        if (onChangeCheckedItems !== undefined) {
            if (isChecklistMode === false) return;
    
            const checkedUpd = [...checkedItems];
            const checkedIndex = checkedUpd.indexOf(item);
            if (checkedIndex === -1) return;
    
            checkedUpd[checkedIndex] = newName;
            onChangeCheckedItems(checkedUpd);
        }
    }

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
        if (items.includes(newItem)) return;

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
    allowRename: boolean;
    allowRemove: boolean;
    checked?: boolean;
    onRename?: (newName: string) => void;
    onCheck?: (checked: boolean) => void;
    onDelete?: () => void;

}

function ListEntry ({
    item,
    checklistMode,
    allowRename,
    allowRemove,
    checked = false,
    onRename,
    onCheck,
    onDelete,
}: ListEntryProps) {
    const [nameCache, setNameCache] = useState(item);

    return (
        <div className="list-entry existing-entry">
            {checklistMode && <Checkbox
                value={checked}
                onChange={onCheck}
            />}
            {allowRename === false && <div className="name">{item}</div>}
            {allowRename && <Textbox
                className="editable-name"
                value={nameCache}
                onChange={setNameCache}
                onBlur={handleBlur}
            />}
            {allowRemove && <div className="tag-action" onClick={() => onDelete?.()}>
                <Icon name="fa-close" />
            </div>}
        </div>
    );

    function handleBlur () {
        onRename?.(nameCache);
    }
}


export default EditableList;
