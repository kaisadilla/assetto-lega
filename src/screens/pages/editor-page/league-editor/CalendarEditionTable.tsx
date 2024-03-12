import CountryField from 'components/CountryField';
import TrackField from 'components/TrackField';
import { TrackPickerValue } from 'components/TrackPicker';
import { useAcContext } from 'context/useAcContext';
import { useDataContext } from 'context/useDataContext';
import { AcTrackCollection, League, LeagueCalendarEntry, LeagueCalendarEntryRequiredFields, LeagueTeam, LeagueTeamDriver, createNewCalendarEntry } from 'data/schemas';
import Button from 'elements/Button';
import Checkbox from 'elements/Checkbox';
import ConfirmDialog from 'elements/ConfirmDialog';
import ContentDialog from 'elements/ContentDialog';
import DropdownField from 'elements/DropdownField';
import LabeledControl from 'elements/LabeledControl';
import List from 'elements/List';
import MaterialSymbol from 'elements/MaterialSymbol';
import MessageDialog from 'elements/MessageDialog';
import NavBar from 'elements/NavBar';
import NumericBox from 'elements/NumericBox';
import Textbox from 'elements/Textbox';
import ToolboxRow from 'elements/ToolboxRow';
import Form from 'elements/form/Form';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { deleteArrayItemAt, getClassString, normalizeInternalNames, smartFilterObjectArray, valueNullOrEmpty } from 'utils';

const DATE_REGEX = /^[0-9]{4}[\/\-][0-9]{2}[\/\-][0-9]{2}$/g;
const HOUR_REGEX = /^[0-2][0-9][:][0-5][0-9]$/g;

enum Tab {
    INFO,
    DRIVERS,
}

type EditableCalendarEntry = LeagueCalendarEntry & {id: string, deleted: boolean};

// TODO: Customize driver skins for each entry.
export interface CalendarEditionTableProps {
    league: League;
    onSave?: (teams: LeagueCalendarEntry[]) => void;
    onCancel?: (teams: LeagueCalendarEntry[]) => void;
    onClose?: () => void;
}

function CalendarEditionTable ({
    league,
    onSave,
    onCancel,
    onClose,
}: CalendarEditionTableProps) {
    const calendar = league.calendar;

    const { tracks } = useAcContext();

    const [editedCalendar, setEditedCalendar] = useState(generateEditable(calendar));    
    const [editFlags, setEditFlags] = useState(editedCalendar.map(() => false));
    const [selectedEntry, setSelectedEntry] = useState(0);
    const [tab, setTab] = useState(Tab.INFO);
    
    const [isDialogResetOpen, setDialogResetOpen] = useState(false);
    const [isDialogDiscardOpen, setDialogDiscardOpen] = useState(false);
    const [isDialogImportCalendarOpen, setDialogImportCalendarOpen] = useState(false);
    const [openMessage, setOpenMessage] =
        useState<{title: string, message: string} | null>(null);

    const entryCount = calendar.length;

    useEffect(() => {
        setEditedCalendar(generateEditable(calendar));
    }, [calendar]);

    return (
        <div className="edition-table calendar-edition-table">
            <div className="list-container">
                <h3 className="h3-header">Entries</h3>
                <EntryList
                    entries={editedCalendar}
                    setEntries={setEditedCalendar}
                    onSort={handleSortEntry}
                    editFlags={editFlags}
                    selectedIndex={selectedEntry}
                    onSelect={handleSelectEntry}
                    onDelete={i => handleSetDeletedEntry(i, true)}
                    onRestore={i => handleSetDeletedEntry(i, false)}
                />
                <div className="calendar-list-toolbar">
                    <Button onClick={handleAddEntry}>
                        <MaterialSymbol symbol='add' />
                        Add Entry
                    </Button>
                    <Button
                        onClick={() => setDialogImportCalendarOpen(true)}
                    >
                        <MaterialSymbol symbol='publish' />
                        From another
                    </Button>
                </div>
            </div>
            {editedCalendar.length > 0 && <div className="item-panel entry-panel">
                <NavBar className="nav-bar-header" get={tab} set={setTab}>
                    <NavBar.Item text="info" index={Tab.INFO} />
                    <NavBar.Item text="drivers" index={Tab.DRIVERS} />
                </NavBar>
                {tab === Tab.INFO && <_TabInfo
                    key={selectedEntry}
                    entry={editedCalendar[selectedEntry]}
                    specs={league.specs}
                    onChange={handleEntryChange}
                />}
                {tab === Tab.DRIVERS && <_TabDrivers
                    key={selectedEntry}
                    entry={editedCalendar[selectedEntry]}
                    teams={league.teams}
                    onChange={handleEntryChange}
                />}
            </div>}
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
            {isDialogImportCalendarOpen && <_ImportSeasonCalendarDialog
                thisLeagueInternalName={league.internalName}
                onAccept={c => handleImportCalendar(c)}
                onCancel={() => setDialogImportCalendarOpen(false)}
            />}
            {openMessage !== null && <MessageDialog
                title={openMessage.title}
                message={openMessage.message}
                setOpen={() => setOpenMessage(null)}
            />}
        </div>
    );

    // #region edition handlers (add, delete, select, etc.)
    function handleAddEntry () {
        const update = [
            ...editedCalendar,
            createNewCalendarEntry() as EditableCalendarEntry,
        ]
        update[update.length - 1].id = crypto.randomUUID();
        update[update.length - 1].deleted = false;
        update[update.length - 1].spec = league.specs[0];

        setEditedCalendar(update);
        
        const editUpdate = [
            ...editFlags,
            true,
        ];
        setEditFlags(editUpdate);

        setSelectedEntry(editUpdate.length - 1);
    }

    function handleImportCalendar (calendar: LeagueCalendarEntry[]) {
        const newEntries = generateEditable(calendar);

        // remove data that shouldn't be imported from another league.
        for (const e of newEntries) {
            e.internalName = "";
            e.teamLineups = {};
            e.driverSkins = {};
            e.spec = league.specs[0];
        }

        setEditedCalendar([...editedCalendar, ...newEntries]);
        setEditFlags([...editFlags, ...newEntries.map(n => true)]);
        
        setDialogImportCalendarOpen(false);
    }

    function handleSetDeletedEntry (index: number, deleted: boolean) {
        const update = [...editedCalendar];
        update[index].deleted = deleted;
        setEditedCalendar(update);
        flagAsEdited(index);
    }

    function handleSortEntry (oldIndex?: number, newIndex?: number) {
        if (oldIndex === undefined || newIndex === undefined) return;

        setSelectedEntry(newIndex);
        const flagUpd = [...editFlags];

        [flagUpd[oldIndex], flagUpd[newIndex]] = [flagUpd[newIndex], flagUpd[oldIndex]];

        setEditFlags(flagUpd);
        console.log(flagUpd);
        console.log(newIndex);
    }
    
    function handleSelectEntry (index: number) {
        setSelectedEntry(index);
    }

    function handleEntryChange (entry: EditableCalendarEntry) {
        const update = [...editedCalendar];
        update[selectedEntry] = entry;

        setEditedCalendar(update);
        flagAsEdited(selectedEntry);
    }

    function flagAsEdited (index: number) {
        const editUpdate = [...editFlags];
        editUpdate[index] = true;
        setEditFlags(editUpdate);
    }

    function areThereChanges () {
        return editFlags.some(f => f);
    }
    // #endregion
    
    // #region toolbox button handlers
    function handleReset () {
        setDialogResetOpen(true);
    }
    
    function handleResetDialog () {
        setEditedCalendar(generateEditable(calendar));
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
    // #endregion

    // #region saving procedure
    /**
     * Saves the changes made to the calendar if they are valid, or shows a pop-up
     * indicating that saving is not possible otherwise. Returns true if changes
     * were saved, or false if they weren't.
     */
    function saveIfChangesAreValid () {
        const errors = validateChanges(editedCalendar);
        if (errors.length === 0) {
            onSave?.(generateResult(editedCalendar));
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
    // #endregion
}

interface EntryListProps {
    entries: EditableCalendarEntry[];
    setEntries: (entries: EditableCalendarEntry[]) => void;
    onSort: (oldIndex?: number, newIndex?: number) => void;
    editFlags: boolean[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    onDelete: (index: number) => void;
    onRestore: (index: number) => void;
}

function EntryList ({
    entries,
    setEntries,
    onSort,
    editFlags,
    selectedIndex,
    onSelect,
    onDelete,
    onRestore,
}: EntryListProps) {
    return (
        <ReactSortable
            className="edition-items-list calendar-list"
            list={entries}
            setList={setEntries}
            onSort={(evt) => onSort(evt.oldIndex, evt.newIndex)}
        >
            {
                entries.map((e, i) => <Entry
                    key={[e.id, entries.length].join(",")}
                    entry={e}
                    selected={selectedIndex === i}
                    edited={editFlags[i]}
                    onSelect={() => onSelect(i)}
                    onDelete={() => onDelete(i)}
                    onRestore={() => onRestore(i)}
                />)
            }
        </ReactSortable>
    );
}

interface EntryProps {
    entry: EditableCalendarEntry;
    selected: boolean;
    edited: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onRestore: () => void;
}

function Entry ({
    entry,
    selected,
    edited,
    onSelect,
    onDelete,
    onRestore,
}: EntryProps) {
    const displayName = entry.name;

    const classStr = getClassString(
        "list-item",
        "calendar-entry",
        selected && "selected",
        edited && "edited",
        entry.deleted && "deleted",
    )

    return (
        <div className={classStr}>
            <div className="item-name calendar-name" onClick={() => onSelect()}>
                <span className="name">{edited && "*"} {displayName}</span>
                {entry.deleted && <span>(deleted)</span>}
            </div>
            {!entry.deleted && <Button
                className="button delete-button"
                onClick={() => onDelete()}
            >
                <MaterialSymbol symbol='close' />
            </Button>}
            {entry.deleted && <Button
                className="button restore-button"
                onClick={() => onRestore()}
            >
                <MaterialSymbol symbol='history' />
            </Button>}
        </div>
    );
}

interface _ImportSeasonCalendarDialogProps {
    thisLeagueInternalName: string;
    onAccept: (entries: LeagueCalendarEntry[]) => void;
    onCancel: () => void;
}

function _ImportSeasonCalendarDialog ({
    thisLeagueInternalName,
    onAccept,
    onCancel,
}: _ImportSeasonCalendarDialogProps) {
    const { leagues, leaguesById } = useDataContext();

    const [search, setSearch] = useState("");
    const [selectedLeague, setSelectedLeague] = useState<string | undefined>(undefined);

    const listItems = leagues
        .filter(l => l.internalName !== thisLeagueInternalName)
        .map(l => ({
            value: l.internalName,
            displayName: `${l.series} - ${l.displayName ?? l.year}`,
        })
    );

    return (
        <ContentDialog
            className="import-season-calendar-dialog"
            onAccept={handleAccept}
            onCancel={onCancel}
        >
        <h2 className="message-title">Import calendar from league.</h2>
            <Textbox
                value={search}
                onChange={setSearch}
                placeholder={"Search league..."}
            />
            <List
                className="league-list"
                items={smartFilterObjectArray(listItems, search, i => i.displayName)}
                allowSelection
                selectedItem={selectedLeague}
                onSelect={l => setSelectedLeague(l)}
            />
        </ContentDialog>
    );

    function handleAccept () {
        if (selectedLeague === undefined) return;

        onAccept(leaguesById[selectedLeague].calendar);
    }
}


interface _TabInfoProps {
    entry: EditableCalendarEntry;
    specs: string[];
    onChange: (update: EditableCalendarEntry) => void;
}

function _TabInfo ({
    entry,
    specs,
    onChange,
}: _TabInfoProps) {
    return (
        <Form className="tab-info">
            <Form.Section className="info-section">
                <LabeledControl label="Internal name">
                    <Textbox
                        value={entry.internalName}
                        placeholder={"(filled automatically)"}
                        onChange={str => handleInternalNameChange(str)}
                        //readonly // TODO: Allow edition
                    />
                </LabeledControl>
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
                        allowRegions
                        value={entry.country}
                        onChange={ctry => handleFieldChange('country', ctry)}
                    />
                </LabeledControl>
                <LabeledControl label="Date">
                    <Textbox
                        value={entry.date}
                        onChange={str => handleFieldChange('date', str)}
                        placeholder="YYYY-MM-DD"
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
                <LabeledControl label="Spec">
                    <DropdownField
                        items={specs.map(s => ({
                            value: s,
                            displayName: s
                        }))}
                        selectedItem={entry.spec}
                        onSelect={v => handleFieldChange('spec', v)}
                    />
                </LabeledControl>
                {false && <LabeledControl label="Weather">
                    (not yet implemented)
                </LabeledControl>}
                <Form.Title title="Hours (local)" />
                <LabeledControl label="Qualifying" required>
                    <Textbox
                        value={entry.qualifyingStartHour}
                        onChange={str => handleFieldChange('qualifyingStartHour', str)}
                        placeholder="HH:MM"
                    />
                </LabeledControl>
                <LabeledControl label="Race" required>
                    <Textbox
                        value={entry.raceStartHour}
                        onChange={str => handleFieldChange('raceStartHour', str)}
                        placeholder="HH:MM"
                    />
                </LabeledControl>
            </Form.Section>
        </Form>
    );

    function handleFieldChange (field: keyof LeagueCalendarEntry, value: any) {
        const update: EditableCalendarEntry = {
            ...entry,
            [field]: value,
        };

        onChange(update);
    }

    function handleTrackChange (value: TrackPickerValue) {
        if (!value.track) return;

        const update: EditableCalendarEntry = {
            ...entry,
            track: value.track,
            layout: value.layout ?? "",
        };

        onChange(update);
    }

    function handleInternalNameChange (name: string) {
        // TODO: this is ad-hoc and needs to be changed, since it doesn't rename
        // any reference to this ID and thus can create invalid files. Only
        // enabled for development purposes.
        handleFieldChange('internalName', name);
    }
}

interface _TabDriversProps {
    entry: EditableCalendarEntry;
    teams: LeagueTeam[];
    onChange: (update: EditableCalendarEntry) => void;
}

function _TabDrivers ({
    entry,
    teams,
    onChange,
}: _TabDriversProps) {

    return (
        <Form className="tab-drivers">
            <Form.Section className="section section-lineups">
                <Form.Title title="Custom lineups" />
                <div className="lineup-container">
                    {teams.map(t => <_TeamLineup
                        key={t.internalName}
                        team={t}
                        value={entry.teamLineups[t.internalName]}
                        onChange={v => handleTeamLineupChange(t.internalName, v)}
                    />)}
                </div>
            </Form.Section>
            <Form.Section className="section section-skins">
                <Form.Title title="Custom skins" />
                {teams.map(t => <div>
                    {t.shortName}
                </div>)}
            </Form.Section>
        </Form>
    );

    function handleTeamLineupChange (team: string, value: string[] | undefined) {
        const lineups = {...entry.teamLineups};
        if (value) {
            lineups[team] = value;
        }
        else {
            delete lineups[team];
        }

        const update = {...entry};
        update.teamLineups = lineups;

        onChange(update);
    }
}

interface _TeamLineupProps {
    team: LeagueTeam;
    value: string[] | undefined;
    onChange: (value: string[] | undefined) => void;
}

function _TeamLineup ({
    team,
    value,
    onChange,
}: _TeamLineupProps) {

    return (
        <div className="team-lineup">
            <div className="header">
                <Checkbox
                    value={value !== undefined}
                    onChange={handleToggleLineup}
                />
                <div className="team-name">
                    {team.name}
                </div>
            </div>
            <div className="drivers">
                {team.drivers.map(d => <_TeamLineupDriver
                    key={d.internalName}
                    driver={d}
                    entryLineup={value}
                    readonly={value === undefined}
                    onChange={v => handleDriverChange(d.internalName, v)}
                />)}
            </div>
        </div>
    );

    function handleToggleLineup (active: boolean) {
        if (active) {
            onChange(
                team.drivers
                    .filter(d => d.isReserveDriver === false)
                    .map(d => d.internalName)
            );
        }
        else {
            onChange(undefined);
        }
    }

    function handleDriverChange (driver: string, active: boolean) {
        if (value === undefined) return;

        const update = [...value];
        if (active && update.includes(driver) === false) {
            update.push(driver);
        }
        if (active === false && update.includes(driver)) {
            const index = update.findIndex(d => d === driver);
            deleteArrayItemAt(update, index);
        }

        onChange(update);
    }
}

interface _TeamLineupDriverProps {
    driver: LeagueTeamDriver;
    /**
     * The lineup of drivers for the driver's team for this entry.
     * Will be equal to `undefined` when this calendar's entry doesn't have
     * a custom lineup for the driver's team.
     */
    entryLineup: string[] | undefined;
    readonly: boolean;
    onChange: (active: boolean) => void;
}

function _TeamLineupDriver ({
    driver,
    entryLineup,
    readonly,
    onChange,
}: _TeamLineupDriverProps) {
    // If the entry lineup is defined, then this track has a custom lineup
    // for the driver's team. In that case, the driver is selected if its name
    // is in the lineup array. If the lineup is not defined, then whether this
    // driver is selected depends on whether it's not a reserve driver.
    const isSelected = entryLineup
        ? entryLineup.includes(driver.internalName)
        : driver.isReserveDriver === false;

    return (
        <div className="driver">
            <Checkbox
                value={isSelected}
                readonly={readonly}
                onChange={onChange}
            />
            <div className="driver-name">
                {driver.name}
            </div>
        </div>
    );
}

function generateEditable (calendar: LeagueCalendarEntry[]) {
    const newArr = [] as EditableCalendarEntry[];

    for (const e in calendar) {
        const clone = structuredClone(calendar[e]) as EditableCalendarEntry;
        clone.id = crypto.randomUUID();
        clone.deleted = false;

        if (clone.spec === undefined) {
            clone.spec = "Default";
        }

        newArr.push(clone);
    }

    return newArr;
}

function generateResult (calendar: EditableCalendarEntry[]) {
    const newArr = [] as LeagueCalendarEntry[];

    for (const e of calendar) {
        // discard deleted entries.
        if (e.deleted) continue;

        const clone = structuredClone(e);
        // @ts-ignore
        delete clone.deleted;

        clone.name = clone.name.trim();
        clone.officialName = clone.officialName?.trim();
        clone.date = clone.date?.trim();
        clone.qualifyingStartHour = clone.qualifyingStartHour?.trim();
        clone.raceStartHour = clone.raceStartHour?.trim();

        newArr.push(clone as LeagueCalendarEntry);
    }

    normalizeInternalNames(newArr, 'internalName', e => e.name);

    return newArr;
}

function validateChanges (editedCalendar: EditableCalendarEntry[]) : string[] {
    const errorList = [] as string[];

    for (const e in editedCalendar) {
        const entry = editedCalendar[e];

        // no need to check the validity of entries that will be discarded.
        if (entry.deleted) continue;

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
        entry: EditableCalendarEntry, field: keyof LeagueCalendarEntry,
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
