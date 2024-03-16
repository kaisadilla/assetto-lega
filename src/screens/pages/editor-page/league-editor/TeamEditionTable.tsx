import CarField from 'components/CarField';
import CarSkinDropdownField from 'components/CarSkinDropdownField';
import ColorField from 'components/ColorField';
import CountryField from 'components/CountryField';
import ImageField from 'components/ImageField';
import MultipleCarSkinField from 'components/MultipleCarSkinField';
import { useAcContext } from 'context/useAcContext';
import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { AcCarCollection, LeagueTeam, LeagueTeamDriver, LeagueTeamDriverRequiredFields, LeagueTeamRequiredFields, createNewDriver, createNewTeam, getTeamName } from 'data/schemas';
import Button from 'elements/Button';
import Checkbox from 'elements/Checkbox';
import ConfirmDialog from 'elements/ConfirmDialog';
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
import { LOCALE, deleteArrayItemAt, getClassString, isStringNullOrEmpty, normalizeInternalNames } from 'utils';

type EditableTeam = LeagueTeam & {id: string, deleted: boolean};

enum TeamEditorTab {
    INFO,
    DRIVERS,
}

export interface TeamEditionTableProps {
    teams: LeagueTeam[];
    specs: string[];
    classes: string[] | null;
    onSave?: (teams: LeagueTeam[]) => void;
    onCancel?: (teams: LeagueTeam[]) => void;
    onClose?: () => void;
}

function TeamEditionTable ({
    teams,
    specs,
    classes,
    onSave,
    onCancel,
    onClose,
}: TeamEditionTableProps) {
    const { cars } = useAcContext();

    const [editedTeams, setEditedTeams] = useState(generateEditable(teams, cars));
    // an array that mirrors 'edited teams'. Each boolean represents whether a
    // team has been edited or not.
    const [editFlags, setEditFlags] = useState(editedTeams.map(() => false));
    const [selectedTeam, setSelectedTeam] = useState(0);
    const [tab, setTab] = useState(TeamEditorTab.INFO);
    
    const [isDialogResetOpen, setDialogResetOpen] = useState(false);
    const [isDialogDiscardOpen, setDialogDiscardOpen] = useState(false);
    const [openMessage, setOpenMessage] =
        useState<{title: string, message: string} | null>(null);

    const teamCount = editedTeams.length;
    const fullDriverCount = editedTeams.reduce(
        (acc, t) => acc += t.drivers.length, 0
    );
    const reserveDriverCount = editedTeams.reduce(
        (acc, t) => acc += t.drivers.filter(d => d.isReserveDriver).length, 0
    );

    useEffect(() => {
        setEditedTeams(generateEditable(teams, cars));
    }, [teams]);

    return (
        <div className="edition-table team-edition-table">
            <div className="list-container team-list-container">
                <h3 className="h3-header">Teams</h3>
                <TeamList
                    teams={editedTeams}
                    setTeams={setEditedTeams}
                    onSort={handleSortEntry}
                    editFlags={editFlags}
                    selectedIndex={selectedTeam}
                    onSelect={handleSelectTeam}
                    onDelete={i => handleSetDeletedTeam(i, true)}
                    onRestore={i => handleSetDeletedTeam(i, false)}
                />
                <div className="team-list-toolbar">
                    <Button onClick={handleAddTeam}>
                        <MaterialSymbol symbol='add' />
                        Add team
                    </Button>
                </div>
            </div>
            {editedTeams.length > 0 && <div className="item-panel team-panel">
                <NavBar className="nav-bar-header" get={tab} set={setTab}>
                    <NavBar.Item text="info" index={TeamEditorTab.INFO} />
                    <NavBar.Item text="drivers" index={TeamEditorTab.DRIVERS} />
                </NavBar>
                <div className="team-editor-tab">
                    {tab === TeamEditorTab.INFO && editedTeams[selectedTeam] &&
                    <TabInfo
                        key={editedTeams[selectedTeam].id}
                        team={editedTeams[selectedTeam]}
                        specs={specs}
                        classes={classes}
                        onChange={handleInfoChange}
                    />}
                    {tab === TeamEditorTab.DRIVERS && editedTeams[selectedTeam] &&
                    <TabDrivers
                        key={editedTeams[selectedTeam].id}
                        team={editedTeams[selectedTeam]}
                        specs={specs}
                        onChange={handleDriversChange}
                    />}
                </div>
            </div>}
            <ToolboxRow className="status-bar toolbar-panel teams-tab-toolbar">
                <div className="datum">{teamCount} teams</div>
                <div className="datum">
                    {fullDriverCount} drivers ({reserveDriverCount} in reserve)
                </div>
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
                message="Do you want to undo all changes made to the teams?"
                onAccept={handleResetDialog}
                setOpen={setDialogResetOpen}
            />}
            {isDialogDiscardOpen && <ConfirmDialog
                title="Discard changes?"
                message="Do you want to discard all changes made to the teams?"
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

    // #region edition handlers (add, delete, select, etc.)
    function handleAddTeam () {
        const update = [
            ...editedTeams,
            createNewTeam() as EditableTeam,
        ];
        update[update.length - 1].id = crypto.randomUUID();
        update[update.length - 1].deleted = false;

        if (classes !== null && classes.length > 0) {
            update[update.length - 1].className = classes[0];
        }

        setEditedTeams(update);
        
        const editUpdate = [
            ...editFlags,
            true,
        ];
        setEditFlags(editUpdate);

        setSelectedTeam(update.length - 1);
    }

    function handleSetDeletedTeam (index: number, deleted: boolean) {
        const update = [...editedTeams];
        update[index].deleted = deleted;
        setEditedTeams(update);
        flagAsEdited(index);
    }

    function handleTeamChange (field: keyof LeagueTeam, value: any) {
        const update = {
            ...editedTeams[selectedTeam],
            [field]: value,
        };

        if (field === 'cars') {
            for (const d of update.drivers) {
                d.skins = {};
                d.defaultSkins = {};
            }
        }

        const newTeams = [...editedTeams];
        newTeams[selectedTeam] = update;

        setEditedTeams(newTeams);
        flagAsEdited(selectedTeam);
    }

    function handleSortEntry (oldIndex?: number, newIndex?: number) {
        if (oldIndex === undefined || newIndex === undefined) return;

        setSelectedTeam(newIndex);
        const flagUpd = [...editFlags];

        [flagUpd[oldIndex], flagUpd[newIndex]] = [flagUpd[newIndex], flagUpd[oldIndex]];

        setEditFlags(flagUpd);
        console.log(flagUpd);
        console.log(newIndex);
    }

    function handleSelectTeam (index: number) {
        setSelectedTeam(index);
    }

    function handleInfoChange (field: keyof LeagueTeam, value: any) {
        handleTeamChange(field, value);
    }

    function handleDriversChange (drivers: LeagueTeamDriver[]) {
        handleTeamChange('drivers', drivers);
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
        setEditedTeams(generateEditable(teams, cars));
        setEditFlags(editedTeams.map(() => false));
    }

    function handleCommit () {
        const saved = saveIfChangesAreValid();
        if (saved) {
            setEditFlags(editedTeams.map(() => false));
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
        onCancel?.(editedTeams);
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
     * Saves the changes made to the teams if they are valid, or shows a pop-up
     * indicating that saving is not possible otherwise. Returns true if changes
     * were saved, or false if they weren't.
     */
    function saveIfChangesAreValid () {
        const errors = validateChanges(editedTeams);
        if (errors.length === 0) {
            onSave?.(generateResult(editedTeams));
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

interface TeamListProps {
    teams: EditableTeam[];
    setTeams: (teams: EditableTeam[]) => void;
    onSort: (oldIndex?: number, newIndex?: number) => void;
    editFlags: boolean[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    onDelete: (index: number) => void;
    onRestore: (index: number) => void;
}

function TeamList ({
    teams,
    setTeams,
    onSort,
    editFlags,
    selectedIndex,
    onSelect,
    onDelete,
    onRestore,
}: TeamListProps) {
    return (
        <ReactSortable
            className="edition-items-list team-list"
            list={teams}
            setList={setTeams}
            onSort={(evt) => onSort(evt.oldIndex, evt.newIndex)}
        >
        {
            teams.map((t, i) => <TeamEntry
                key={t.id}
                team={t}
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

interface TeamEntryProps {
    team: EditableTeam;
    selected: boolean;
    edited: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onRestore: () => void;
}

function TeamEntry ({
    team,
    selected,
    edited,
    onSelect,
    onDelete,
    onRestore,
}: TeamEntryProps) {
    const displayName = team.shortName ? team.shortName : team.name;

    const classStr = getClassString(
        "list-item",
        "team-entry",
        selected && "selected",
        edited && "edited",
    )

    return (
        <div className={classStr}>
            <div className="item-name team-name" onClick={() => onSelect()}>
                <span className="name">{edited && "*"} {displayName}</span>
                {team.deleted && <span>(deleted)</span>}
            </div>
            {!team.deleted && <Button
                className="button delete-button"
                onClick={() => onDelete()}
            >
                <MaterialSymbol symbol='close' />
            </Button>}
            {team.deleted && <Button
                className="button restore-button"
                onClick={() => onRestore()}
            >
                <MaterialSymbol symbol='history' />
            </Button>}
        </div>
    );
}

export interface TabInfoProps {
    team: EditableTeam,
    specs: string[];
    classes: string[] | null;
    onChange: (field: keyof LeagueTeam, value: any) => void;
}

function TabInfo ({
    team,
    specs,
    classes,
    onChange,
}: TabInfoProps) {
    const { suggestions } = useDataContext();

    const nameToUse = team.shortName ?? team.name;
    const colorSuggestions = suggestions.colors.teams[nameToUse];

    return (
        <Form className="tab-info">
            <Form.Section className="images-section" horizontalAlignment='center'>
                <Form.Title title="Logo" />
                <div className="logo-cell">
                    <ImageField
                        className="logo-image-field"
                        directory={AssetFolder.teamLogos}
                        image={team.logo}
                        defaultImageBackgroundColor='white'
                        onChange={img => handleFieldChange('logo', img)}
                    />
                </div>
                <Form.Title title="Badge" />
                <div className="badge-cell">
                    <ImageField
                        className="badge-image-field"
                        directory={AssetFolder.teamBadges}
                        image={team.badge}
                        defaultImageBackgroundColor='transparent'
                        defaultImageSize={64}
                        onChange={img => handleFieldChange('badge', img)}
                    />
                </div>
            </Form.Section>
            <Form.Section className="info-section">
                <LabeledControl label="Internal name">
                    <Textbox
                        value={team.internalName}
                        placeholder={"(filled automatically)"}
                        onChange={str => handleInternalNameChange(str)}
                        readonly // TODO: Allow edition
                    />
                </LabeledControl>
                <LabeledControl label="Full name" required>
                    <Textbox
                        value={team.name}
                        onChange={str => handleFieldChange('name', str)}
                        suggestions={suggestions.team.fullNames}
                    />
                </LabeledControl>
                <LabeledControl label="Short name">
                    <Textbox
                        value={team.shortName}
                        onChange={str => handleFieldChange('shortName', str)}
                        suggestions={suggestions.team.shortNames}
                    />
                </LabeledControl>
                <LabeledControl label="Constructor">
                    <Textbox
                        value={team.constructorName}
                        onChange={str => handleFieldChange('constructorName', str)}
                        suggestions={suggestions.team.constructorNames}
                    />
                </LabeledControl>
                {classes !== null && <LabeledControl label="Class">
                    <DropdownField
                        items={classes.map(c => ({
                            value: c,
                            displayName: c
                        }))}
                        selectedItem={team.className}
                        onSelect={v => handleFieldChange('className', v)}
                    />
                </LabeledControl>}
                <LabeledControl label="Country" required>
                    <CountryField
                        value={team.country}
                        onChange={country => handleFieldChange('country', country)}
                    />
                </LabeledControl>
                <LabeledControl label="Color" required>
                    <ColorField
                        value={team.color}
                        suggestions={colorSuggestions}
                        suggestionsTitle={
                            `Colors used by teams called '${nameToUse}':`
                        }
                        onChange={color => handleFieldChange('color', color)}
                        
                    />
                </LabeledControl>
                <LabeledControl label="Ballast" required>
                    <NumericBox
                        value={team.ballast}
                        onChange={num => handleFieldChange('ballast', num)}
                    />
                </LabeledControl>
                <LabeledControl label="Restrictor" required>
                    <NumericBox
                        value={team.restrictor}
                        onChange={num => handleFieldChange('restrictor', num)}
                    />
                </LabeledControl>
            </Form.Section>
            <Form.Section className="car-section">
                <Form.Title title="Cars" />
                {specs.map(s => <LabeledControl
                    key={s}
                    label={s}
                    required
                >
                    <CarField
                        value={team.cars[s]}
                        onChange={car => handleCarsFieldChange(s, car)}
                    />
                </LabeledControl>)}
            </Form.Section>
        </Form>
    );

    function handleFieldChange (field: keyof LeagueTeam, value: any) {
        onChange(field, value);
    }

    function handleCarsFieldChange (spec: string, car: string) {
        const update = {...team.cars};
        update[spec] = car;
        onChange('cars', update);
    }

    function handleInternalNameChange (name: string) {

    }
}

interface TabDriversProps {
    team: EditableTeam,
    specs: string[];
    onChange: (drivers: LeagueTeamDriver[]) => void;
}

function TabDrivers ({
    team,
    specs,
    onChange,
}: TabDriversProps) {

    return (
        <div className="tab-drivers">
            <div className="driver-list">
                {team.drivers.map((d, i) => <DriverCard
                    key={d.internalName}
                    driver={d}
                    carIds={team.cars}
                    specs={specs}
                    onChange={(field, value) => handleDriverChange(i, field, value)}
                    onDelete={() => handleDriverDelete(i)}
                />)}
            </div>
            <div className="driver-list-toolbar">
                <Button onClick={handleAddDriver}>
                    <MaterialSymbol symbol='add' />
                    Add driver
                </Button>
            </div>
        </div>
    );

    function handleDriverChange (
        index: number, field: keyof LeagueTeamDriver, value: any
    ) {
        const update = [...team.drivers];
        update[index] = {
            ...update[index],
            [field]: value,
        };

        onChange(update);
    }

    function handleDriverDelete (index: number) {
        const update = [...team.drivers];
        deleteArrayItemAt(update, index);
        onChange(update);
    }

    function handleAddDriver () {
        const updatedDrivers = [
            ...team.drivers,
            createNewDriver(),
        ];
        onChange(updatedDrivers);
    }
}

interface DriverCardProps {
    driver: LeagueTeamDriver;
    carIds: {[spec: string]: string};
    specs: string[];
    onChange: (field: keyof LeagueTeamDriver, value: any) => void;
    onDelete: () => void;
}

function DriverCard ({
    driver,
    carIds,
    specs,
    onChange,
    onDelete,
}: DriverCardProps) {
    const { suggestions } = useDataContext();

    return (
        <Form className="driver">
            <Form.Section className="images-section" horizontalAlignment='center'>
                <Form.Title title="Photo" />
                <ImageField
                    className="photo-image-field"
                    directory={AssetFolder.teamLogos}
                    image={driver.picture}
                    defaultImageSize={96}
                />
            </Form.Section>
            <Form.Section className="info-section">
                <LabeledControl label="Internal name">
                    <Textbox
                        value={driver.internalName}
                        placeholder={"(filled automatically)"}
                        onChange={str => handleInternalNameChange(str)}
                        readonly // TODO: Allow edition
                    />
                </LabeledControl>
                <LabeledControl label="Name" required>
                    <Textbox
                        className="driver-name-textbox"
                        value={driver.name}
                        onChange={str => handleFieldChange('name', str)}
                        suggestions={suggestions.team.driverNames}
                    />
                </LabeledControl>
                <LabeledControl label="Number" required>
                    <Textbox
                        value={driver.number}
                        onChange={str => handleFieldChange('number', str)}
                    />
                </LabeledControl>
                <LabeledControl label="Initials" required>
                    <Textbox
                        value={driver.initials}
                        onChange={str => handleFieldChange('initials', str)}
                    />
                </LabeledControl>
                <LabeledControl label="Country" required>
                    <CountryField
                        value={driver.country}
                        onChange={country => handleFieldChange('country', country)}
                    />
                </LabeledControl>
                <LabeledControl label="Reserve driver" required>
                    <Checkbox
                        value={driver.isReserveDriver}
                        onChange={v => handleFieldChange('isReserveDriver', v)}
                    />
                </LabeledControl>
            </Form.Section>
            <Form.Section className="stats-section">
                <LabeledControl label="Strength" required>
                    <NumericBox
                        value={driver.strength}
                        min={70}
                        max={100}
                        allowDecimals={true}
                        maxDecimalPlaces={1}
                        onChange={val => handleFieldChange('strength', val)}
                    />
                </LabeledControl>
                <LabeledControl label="Aggression" required>
                    <NumericBox
                        value={driver.aggression}
                        min={0}
                        max={100}
                        allowDecimals={true}
                        maxDecimalPlaces={1}
                        onChange={val => handleFieldChange('aggression', val)}
                    />
                </LabeledControl>
            </Form.Section>
            <Form.Section className="skins-section">
                {specs.map(s => <SpecSkinsSection
                    key={s}
                    spec={s}
                    carId={carIds[s]}
                    skins={driver.skins[s]}
                    defaultSkin={driver.defaultSkins[s]}
                    onSkinsChanged={arr => handleSkinsChanged(s, arr)}
                    onDefaultSkinChanged={skin => handleDefaultSkinChanged(s, skin)}
                />)}
            </Form.Section>
            <div className="floating-toolbox">
                <Button className="delete-button" onClick={onDelete}>
                    <MaterialSymbol symbol='close' />
                </Button>
            </div>
        </Form>
    );

    function handleFieldChange (field: keyof LeagueTeamDriver, value: any) {
        onChange(field, value);
    }

    function handleSkinsChanged (spec: string, skins: string[]) {
        const update = {...driver.skins};
        update[spec] = skins;
        handleFieldChange('skins', update);

        // TODO: Remove default skin if it's no longer a valid skin.
        //if (update[spec].includes(driver.defaultSkins[spec]) === false) {
        //    handleDefaultSkinChanged(spec, undefined as any);
        //}
    }

    function handleDefaultSkinChanged (spec: string, skin: string) {
        const update = {...driver.defaultSkins};
        update[spec] = skin;
        handleFieldChange('defaultSkins', update);
    }

    function handleInternalNameChange (str: string) {
        
    }
}

interface SpecSkinsSectionProps {
    spec: string;
    carId: string;
    skins: string[] | undefined;
    defaultSkin: string | undefined;
    onSkinsChanged: (skins: string[]) => void;
    onDefaultSkinChanged: (skin: string) => void;
}

function SpecSkinsSection ({
    spec,
    carId,
    skins,
    defaultSkin,
    onSkinsChanged,
    onDefaultSkinChanged,
}: SpecSkinsSectionProps) {

    return (
        <>
            <Form.Title title={spec} />
            <LabeledControl label="Skins" required>
                <MultipleCarSkinField
                    skins={skins}
                    carId={carId}
                    onChange={onSkinsChanged}
                />
            </LabeledControl>
            <LabeledControl label="Default skin" required>
                <CarSkinDropdownField
                    carId={carId}
                    availableSkins={skins}
                    value={defaultSkin ?? null}
                    onChange={onDefaultSkinChanged}
                />
            </LabeledControl>
        </>
    );
}


function generateEditable (teams: LeagueTeam[], cars: AcCarCollection) {
    const newArr = [] as EditableTeam[];

    // TODO: Study if we should purge invalid cars and skins here.
    for (const t in teams) {
        const clone = structuredClone(teams[t]) as EditableTeam;
        clone.id = crypto.randomUUID();
        clone.deleted = false;
        newArr.push(clone);
    }

    return newArr;
}

function generateResult (teams: EditableTeam[]) {
    const newArr = [] as LeagueTeam[];

    for (const t of teams) {
        // discard deleted entries.
        if (t.deleted) continue;

        const clone = structuredClone(t);
        // @ts-ignore
        delete clone.id;
        // @ts-ignore
        delete clone.deleted;

        newArr.push(clone as LeagueTeam);
    }

    normalizeInternalNames(newArr, 'internalName', t => t.shortName ?? t.name);

    const driverInternalNames = new Set<string>();
    for (const t of newArr) {
        normalizeInternalNames(
            t.drivers, 'internalName', d => d.name, driverInternalNames
        );
    }

    return newArr;
}

/**
 * Validates all fields in all teams and returns an array containing any
 * validation errors found. An empty array means that no errors were found.
 */
function validateChanges (editedTeams: EditableTeam[]) : string[] {
    const errorList = [] as string[];

    for (const t in editedTeams) {
        const team = editedTeams[t];
        if (team.deleted) continue;

        const teamNames = `#${t} '${getTeamName(team)}'`;

        for (const field of LeagueTeamRequiredFields) {
            if (valueNullOrEmpty(team[field])) {
                errorList.push(
                    `- Team ${teamNames} is missing field '${field}'.`
                );
            }
        }

        if (team.drivers.length === 0) {
            errorList.push(
                `- Team ${teamNames} has no drivers.`
            );
        }

        for (const d in team.drivers) {
            const driver = team.drivers[d];
            const driverNames = `#${d} '${driver.name ?? "<no-name>"}'`;

            for (const field of LeagueTeamDriverRequiredFields) {
                if (valueNullOrEmpty(driver[field])) {
                    errorList.push(
                        `- Driver ${driverNames} in team ${teamNames} ` +
                        `is missing field '${field}'.`
                    );
                }
            }
        }
    }

    return errorList;

    function valueNullOrEmpty (value: any) {
        return value === undefined
            || (typeof value === 'string' && value === "");
    }
}

export default TeamEditionTable;
