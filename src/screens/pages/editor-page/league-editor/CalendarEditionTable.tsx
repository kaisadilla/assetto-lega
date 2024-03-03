import CountryField from 'components/CountryField';
import TrackField from 'components/TrackField';
import { TrackPickerValue } from 'components/TrackPicker';
import { AcTrackCollection, LeagueCalendarEntry, LeagueCalendarEntryRequiredFields, createNewCalendarEntry } from 'data/schemas';
import Button from 'elements/Button';
import ConfirmDialog from 'elements/ConfirmDialog';
import LabeledControl from 'elements/LabeledControl';
import MaterialSymbol from 'elements/MaterialSymbol';
import MessageDialog from 'elements/MessageDialog';
import NumericBox from 'elements/NumericBox';
import Textbox from 'elements/Textbox';
import ToolboxRow from 'elements/ToolboxRow';
import Form from 'elements/form/Form';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';
import { deleteAt, getClassString, valueNullOrEmpty } from 'utils';

const DATE_REGEX = /^[0-9]{4}[\/\-][0-9]{2}[\/\-][0-9]{2}$/g;
const HOUR_REGEX = /^[0-2][0-9][:][0-5][0-9]$/g;

export interface CalendarEditionTableProps {
    calendar: LeagueCalendarEntry[];
    onSave?: (teams: LeagueCalendarEntry[]) => void;
    onCancel?: (teams: LeagueCalendarEntry[]) => void;
    onClose?: () => void;
}

function CalendarEditionTable ({
    calendar,
    onSave,
    onCancel,
    onClose,
}: CalendarEditionTableProps) {
    const [tracks, setTracks] = useState<AcTrackCollection | null>(null);

    useEffect(() => {
        loadTracks();
    }, []);

    const [editedCalendar, setEditedCalendar] = useState(cloneCalendar(calendar));
    const [editFlags, setEditFlags] = useState(editedCalendar.map(() => false));
    const [selectedEntry, setSelectedEntry] = useState(0);
    
    const [isDialogResetOpen, setDialogResetOpen] = useState(false);
    const [isDialogDiscardOpen, setDialogDiscardOpen] = useState(false);
    const [openMessage, setOpenMessage] =
        useState<{title: string, message: string} | null>(null);

    const entryCount = calendar.length;

    return (
        <div className="edition-table calendar-edition-table">
            <div className="list-container">
                <h3 className="h3-header">Entries</h3>
                <EntryList
                    entries={editedCalendar}
                    editFlags={editFlags}
                    selectedIndex={selectedEntry}
                    onSelect={handleSelectEntry}
                    onDelete={handleDeleteEntry}
                />
                <div className="calendar-list-toolbar">
                    <Button onClick={handleAddEntry} disabled={tracks === null}>
                        <MaterialSymbol symbol='add' />
                        Add Entry
                    </Button>
                </div>
            </div>
            <div className="item-panel entry-panel">
                <EntryPanel
                    key={selectedEntry}
                    entry={editedCalendar[selectedEntry]}
                    onChange={handleEntryChange}
                />
            </div>
            <ToolboxRow className="status-bar toolbar-panel entry-tab-toolbar">
                <div className="datum">{entryCount} entries</div>
                <div className="tools">
                    <Button
                        onClick={handleReset}
                        disabled={areThereChanges() === false}
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={handleCommit}
                        disabled={areThereChanges() === false}
                    >
                        Commit changes
                    </Button>
                    <Button onClick={handleDiscard}>Discard changes</Button>
                    <Button onClick={handleSaveAndExit} highlighted>
                        Save and end
                    </Button>
                </div>
            </ToolboxRow>
            {isDialogResetOpen && <ConfirmDialog
                title="Undo all changes?"
                message="Do you want to undo all changes made to the calendar?"
                onAccept={handleResetDialog}
                setOpen={setDialogResetOpen}
            />}
            {isDialogDiscardOpen && <ConfirmDialog
                title="Discard changes?"
                message="Do you want to discard all changes made to the calendar?"
                onAccept={handleDiscardDialog}
                setOpen={setDialogDiscardOpen}
            />}
            {openMessage !== null && <MessageDialog
                title={openMessage.title}
                message={openMessage.message}
                setOpen={() => setOpenMessage(null)}
            />}
        </div>
    );

    function handleAddEntry () {
        const update = [
            ...editedCalendar,
            createNewCalendarEntry(),
        ]

        setEditedCalendar(update);
        
        const editUpdate = [
            ...editFlags,
            true,
        ];
        setEditFlags(editUpdate);

        setSelectedEntry(editUpdate.length - 1);
    }

    function handleDeleteEntry (index: number) {
        const update = [...editedCalendar];
        deleteAt(update, index);
        setEditedCalendar(update);
        
        const editUpdate = [...editFlags];
        editUpdate[0] = true;
        setEditFlags(editUpdate);

        if (selectedEntry >= editUpdate.length) {
            setSelectedEntry(editUpdate.length - 1);
        }
    }
    
    function handleReset () {
        setDialogResetOpen(true);
    }
    
    function handleResetDialog () {
        setEditedCalendar(cloneCalendar(calendar));
        setEditFlags(editedCalendar.map(() => false));
    }

    function handleCommit () {
        const saved = saveIfChangesAreValid();
        if (saved) {
            setEditFlags(editedCalendar.map(() => false));
        }
    }

    function handleDiscard () {
        if (areThereChanges() === false) {
            handleDiscardDialog();
        }
        else {
            setDialogDiscardOpen(true);
        }
    }

    function handleDiscardDialog () {
        onCancel?.(editedCalendar);
        onClose?.();
    }

    function handleSaveAndExit () {
        if (saveIfChangesAreValid()) {
            onClose?.();
        }
    }

    function handleSelectEntry (index: number) {
        setSelectedEntry(index);
    }

    function areThereChanges () {
        return editFlags.some(f => f);
    }

    /**
     * Saves the changes made to the calendar if they are valid, or shows a pop-up
     * indicating that saving is not possible otherwise. Returns true if changes
     * were saved, or false if they weren't.
     */
    function saveIfChangesAreValid () {
        const errors = validateChanges(editedCalendar);
        if (errors.length === 0) {
            onSave?.(editedCalendar);
            return true;
        }
        else {
            setOpenMessage({
                title: "Invalid info",
                message: "The following errors must be fixed before changes are "
                    + `saved:\n${errors.join("\n")}`,
            });
            return false;
        }
    }

    async function loadTracks () {
        const tracks = await Ipc.getTrackData();
        setTracks(tracks);
    }

    function handleEntryChange (entry: LeagueCalendarEntry) {
        const update = [...editedCalendar];
        update[selectedEntry] = entry;

        setEditedCalendar(update);

        const newEdits = [...editFlags]
        newEdits[selectedEntry] = true;
        setEditFlags(newEdits);
    }
}

interface EntryListProps {
    entries: LeagueCalendarEntry[];
    editFlags: boolean[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    onDelete: (index: number) => void;
}

function EntryList ({
    entries,
    editFlags,
    selectedIndex,
    onSelect,
    onDelete,
}: EntryListProps) {
    return (
        <div className="edition-items-list calendar-list">
            {
                entries.map((e, i) => <Entry
                    key={[i, entries.length].join(",")}
                    entry={e}
                    selected={selectedIndex === i}
                    edited={editFlags[i]}
                    onSelect={() => onSelect(i)}
                    onDelete={() => onDelete(i)}
                />)
            }
        </div>
    );
}

interface EntryProps {
    entry: LeagueCalendarEntry;
    selected: boolean;
    edited: boolean;
    onSelect: () => void;
    onDelete: () => void;
}

function Entry ({
    entry,
    selected,
    edited,
    onSelect,
    onDelete,
}: EntryProps) {
    const displayName = entry.name;

    const classStr = getClassString(
        "list-item",
        "calendar-entry",
        selected && "selected",
        edited && "edited",
    )

    // TODO: Implement delete teams.
    return (
        <div className={classStr}>
            <div className="item-name calendar-name" onClick={() => onSelect()}>
                <span>{edited && "*"} {displayName}</span>
            </div>
            <Button className="delete-button" onClick={() => onDelete()}>
                <MaterialSymbol symbol='close' />
            </Button>
        </div>
    );
}

interface EntryPanelProps {
    entry: LeagueCalendarEntry;
    onChange: (update: LeagueCalendarEntry) => void;
}

function EntryPanel ({
    entry,
    onChange,
}: EntryPanelProps) {
    return (
        <Form className="entry-panel">
            <Form.Section className="info-section">
                <LabeledControl label="Name" required>
                    <Textbox
                        value={entry.name}
                        onChange={str => handleFieldChange('name', str)}
                    />
                </LabeledControl>
                <LabeledControl label="Official name">
                    <Textbox
                        value={entry.officialName}
                        onChange={str => handleFieldChange('officialName', str)}
                    />
                </LabeledControl>
                <LabeledControl label="Country" required>
                    <CountryField
                        value={entry.country}
                        onChange={ctry => handleFieldChange('country', ctry)}
                    />
                </LabeledControl>
                <LabeledControl label="Date">
                    <Textbox
                        value={entry.date}
                        onChange={str => handleFieldChange('date', str)}
                    />
                </LabeledControl>
                <LabeledControl label="Track" required>
                    <TrackField
                        track={entry.track}
                        layout={entry.layout}
                        onChange={handleTrackChange}
                    />
                </LabeledControl>
                <LabeledControl label="Laps" required>
                    <NumericBox
                        value={entry.laps}
                        min={1}
                        max={100_000}
                        onChange={n => handleFieldChange('laps', n)}
                    />
                </LabeledControl>
                <LabeledControl label="Weather">
                    (not yet implemented)
                </LabeledControl>
                <Form.Title title="Hours (local)" />
                <LabeledControl label="Qualifying" required>
                    <Textbox
                        value={entry.qualifyingStartHour}
                        onChange={str => handleFieldChange('qualifyingStartHour', str)}
                    />
                </LabeledControl>
                <LabeledControl label="Race" required>
                    <Textbox
                        value={entry.raceStartHour}
                        onChange={str => handleFieldChange('raceStartHour', str)}
                    />
                </LabeledControl>
            </Form.Section>
        </Form>
    );

    function handleFieldChange (field: keyof LeagueCalendarEntry, value: any) {
        const update: LeagueCalendarEntry = {
            ...entry,
            [field]: value,
        };

        onChange(update);
    }

    function handleTrackChange (value: TrackPickerValue) {
        if (!value.track) return;

        const update: LeagueCalendarEntry = {
            ...entry,
            track: value.track,
            layout: value.layout ?? "",
        };

        onChange(update);
    }
}

function cloneCalendar (calendar: LeagueCalendarEntry[]) {
    const newArr = [];

    for (const e of calendar) {
        newArr.push(structuredClone(e));
    }

    return newArr;
}

function validateChanges (editedCalendar: LeagueCalendarEntry[]) : string[] {
    const errorList = [] as string[];

    for (const e in editedCalendar) {
        const entry = editedCalendar[e];
        const entryNames = `#${e} '${entry.name}'`;

        for (const field of LeagueCalendarEntryRequiredFields) {
            // this is ugly but this logic is twisted anyway.
            if (field === 'layout') {
                if (entry.layout === null || entry.layout === undefined) {
                    errorList.push(
                        `- Entry ${entryNames} is missing field 'layout'.`
                    );
                }
            }
            else {
                if (valueNullOrEmpty(entry[field])) {
                    errorList.push(
                        `- Entry ${entryNames} is missing field '${field}'.`
                    );
                }
            }
        }

        if (entry.date) {
            entry.date = entry.date.trim().replace("/", "-").replace(" ", "-");
            
            // we have to use a new regexp object every time because JS's
            // implementation is terrible and makes regexes fail when used
            // multiple times.
            if (new RegExp(DATE_REGEX).test(entry.date) === false) {
                errorList.push(
                    `- Entry ${entryNames} has an invalid date. Dates must ` +
                    "be formatted like 'YYYY-MM-DD'."
                )
            }
            if (isNaN(Date.parse(entry.date))) {
                errorList.push(
                    `- Entry ${entryNames} has an invalid date.`
                )
            }
        }

        if (entry.qualifyingStartHour) {
            validateHourField(entry, 'qualifyingStartHour', entryNames);
        }

        if (entry.raceStartHour) {
            validateHourField(entry, 'raceStartHour', entryNames);
        }
    }

    return errorList;

    function validateHourField (
        entry: LeagueCalendarEntry, field: keyof LeagueCalendarEntry,
        entryNames: string,
    ) {
        if (entry[field]) {
            //@ts-ignore
            entry[field] = entry[field].trim()
                .replace(".", ":").replace(" ", ":").replace("'", ":");
            
            // can't use the same regex object twice in JS.
            if (new RegExp(HOUR_REGEX).test(entry[field] as string) === false) {
                errorList.push(
                    `- Entry ${entryNames} has an invalid hour for '${field}'. ` +
                    "Hours must be formatted like 'HH:MM'."
                )
            }

            const values = (entry[field] as string).split(":");
            if (parseInt(values[0]) > 23 || parseInt(values[1]) > 59 ) {
                errorList.push(
                    `- Entry ${entryNames} has an invalid hour (${entry[field]}).`
                )
            }
        }
    }
}

export default CalendarEditionTable;
