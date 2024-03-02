import CountryField from 'components/CountryField';
import TrackField from 'components/TrackField';
import { TrackPickerValue } from 'components/TrackPicker';
import { AcTrackCollection, LeagueCalendarEntry } from 'data/schemas';
import Button from 'elements/Button';
import LabeledControl from 'elements/LabeledControl';
import MaterialSymbol from 'elements/MaterialSymbol';
import NumericBox from 'elements/NumericBox';
import Textbox from 'elements/Textbox';
import ToolboxRow from 'elements/ToolboxRow';
import Form from 'elements/form/Form';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';
import { getClassString } from 'utils';

export interface CalendarEditionTableProps {
    calendar: LeagueCalendarEntry[];
}

function CalendarEditionTable ({
    calendar,
}: CalendarEditionTableProps) {
    const [tracks, setTracks] = useState<AcTrackCollection | null>(null);

    useEffect(() => {
        loadTracks();
    }, []);

    const [editedCalendar, setEditedCalendar] = useState(cloneCalendar(calendar));
    const [editFlags, setEditFlags] = useState(editedCalendar.map(() => false));
    const [selectedEntry, setSelectedEntry] = useState(0);

    const entryCount = calendar.length;

    return (
        <div className="edition-table calendar-edition-table">
            <div className="list-container">
                <h3 className="h3-header">Entries</h3>
                <EntryList
                    entries={calendar}
                    editFlags={[]}
                    selectedIndex={selectedEntry}
                    onSelect={handleEntrySelect}
                />
                <div className="calendar-list-toolbar">
                    <Button disabled={false}>
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
        </div>
    );
    
    function handleReset () {
        //setDialogResetOpen(true);
    }
    
    function handleResetDialog () {
        //setEditedTeams(cloneTeamArray(teams));
        //setEditFlags(editedTeams.map(() => false));
    }

    function handleCommit () {
        //saveIfChangesAreValid();
        //setEditFlags(editedTeams.map(() => false));
    }

    function handleDiscard () {
        //if (areThereChanges() === false) {
        //    handleDiscardDialog();
        //}
        //else {
        //    setDialogDiscardOpen(true);
        //}
    }

    function handleDiscardDialog () {
        //onCancel?.(editedTeams);
        //onClose?.();
    }

    function handleSaveAndExit () {
        //if (saveIfChangesAreValid()) {
        //    onClose?.();
        //}
    }

    function handleEntrySelect (index: number) {
        setSelectedEntry(index);
    }

    function areThereChanges () {
        return editFlags.some(f => f);
    }

    async function loadTracks () {
        const tracks = await Ipc.getTrackData();
        setTracks(tracks);
    }

    function handleEntryChange (entry: LeagueCalendarEntry) {
        const update = [...editedCalendar];
        update[selectedEntry] = entry;

        setEditedCalendar(update);
    }
}

interface EntryListProps {
    entries: LeagueCalendarEntry[];
    editFlags: boolean[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

function EntryList ({
    entries,
    editFlags,
    selectedIndex,
    onSelect,
}: EntryListProps) {
    return (
        <div className="edition-items-list calendar-list">
            {
                entries.map((e, i) => <Entry
                    key={i}
                    entry={e}
                    selected={selectedIndex === i}
                    edited={editFlags[i]}
                    onSelect={() => onSelect(i)}
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
}

function Entry ({
    entry,
    selected,
    edited,
    onSelect,
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
            <Button className="delete-button">
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
                    {entry.date}
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
                    />
                </LabeledControl>
                <LabeledControl label="Race" required>
                    <Textbox
                        value={entry.raceStartHour}
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
            layout: value.layout ?? undefined,
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

export default CalendarEditionTable;
