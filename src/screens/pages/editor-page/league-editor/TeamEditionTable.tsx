import CarField from 'components/CarField';
import CarSkinDropdownField from 'components/CarSkinDropdownField';
import ColorField from 'components/ColorField';
import CountryField from 'components/CountryField';
import ImageField from 'components/ImageField';
import MultipleCarSkinField from 'components/MultipleCarSkinField';
import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { AcCarCollection, LeagueTeam, LeagueTeamDriver, LeagueTeamDriverRequiredFields, LeagueTeamRequiredFields, createNewDriver, createNewTeam, getTeamName } from 'data/schemas';
import Button from 'elements/Button';
import ConfirmDialog from 'elements/ConfirmDialog';
import LabeledControl from 'elements/LabeledControl';
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
import { deleteAt, getClassString } from 'utils';

type EditableTeam = LeagueTeam & {id: string, deleted: boolean};
type EditableDriver = LeagueTeamDriver & {deleted: boolean};

enum TeamEditorTab {
    INFO,
    DRIVERS,
}

export interface TeamEditionTableProps {
    teams: LeagueTeam[];
    onSave?: (teams: LeagueTeam[]) => void;
    onCancel?: (teams: LeagueTeam[]) => void;
    onClose?: () => void;
}

function TeamEditionTable ({
    teams,
    onSave,
    onCancel,
    onClose,
}: TeamEditionTableProps) {
    const [carData, setCarData] = useState<AcCarCollection | null>(null);

    useEffect(() => {
        loadAcData();
    }, []);

    const [editedTeams, setEditedTeams] = useState(generateEditable(teams));
    // an array that mirrors 'edited teams'. Each boolean represents whether a
    // team has been edited or not.
    const [editFlags, setEditFlags] = useState(editedTeams.map(() => false));
    const [selectedTeam, setSelectedTeam] = useState(0);
    const [tab, setTab] = useState(TeamEditorTab.INFO);
    
    const [isDialogResetOpen, setDialogResetOpen] = useState(false);
    const [isDialogDiscardOpen, setDialogDiscardOpen] = useState(false);
    const [openMessage, setOpenMessage] =
        useState<{title: string, message: string} | null>(null);

    const teamCount = teams.length;
    const driverCount = teams.reduce(
        (acc, t) => acc += t.drivers.length, 0
    );

    useEffect(() => {
        setEditedTeams(generateEditable(teams));
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
                    <Button onClick={handleAddTeam} disabled={carData === null}>
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
                    {tab === TeamEditorTab.INFO && <TabInfo
                        team={editedTeams[selectedTeam]}
                        onChange={handleInfoChange}
                    />}
                    {tab === TeamEditorTab.DRIVERS && <TabDrivers
                        team={editedTeams[selectedTeam]}
                        onChange={handleDriversChange}
                    />}
                </div>
            </div>}
            <ToolboxRow className="status-bar toolbar-panel teams-tab-toolbar">
                <div className="datum">{teamCount} teams</div>
                <div className="datum">{driverCount} drivers</div>
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
        setEditedTeams(generateEditable(teams));
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

    async function loadAcData () {
        const _data = await Ipc.getCarData();
        setCarData(_data);
    }
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
    onChange: (field: keyof LeagueTeam, value: any) => void;
}

function TabInfo ({
    team,
    onChange,
}: TabInfoProps) {
    const { suggestions } = useDataContext();

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
                <LabeledControl label="Car" required>
                    <CarField
                        value={team.car}
                        onChange={car => handleFieldChange('car', car)}
                    />
                </LabeledControl>
                <LabeledControl label="Country" required>
                    <CountryField
                        value={team.country}
                        onChange={country => handleFieldChange('country', country)}
                    />
                </LabeledControl>
                <LabeledControl label="Color" required>
                    <ColorField
                        value={team.color}
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
        </Form>
    );

    function handleFieldChange (field: keyof LeagueTeam, value: any) {
        onChange(field, value);
    }
}

interface TabDriversProps {
    team: EditableTeam,
    onChange: (drivers: LeagueTeamDriver[]) => void;
}

function TabDrivers ({
    team,
    onChange,
}: TabDriversProps) {

    return (
        <div className="tab-drivers">
            <div className="driver-list">
                {team.drivers.map((d, i) => <DriverCard
                    key={i}
                    driver={d}
                    carId={team.car}
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
        deleteAt(update, index);
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
    carId: string;
    onChange: (field: keyof LeagueTeamDriver, value: any) => void;
    onDelete: () => void;
}

function DriverCard ({
    driver,
    carId,
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
                <LabeledControl label="Default skin" required>
                    <CarSkinDropdownField
                        carId={carId}
                        availableSkins={driver.skins}
                        value={driver.defaultSkin}
                        onChange={skin => handleFieldChange('defaultSkin', skin)}
                    />
                </LabeledControl>
                <LabeledControl label="Skins" required>
                    <MultipleCarSkinField
                        skins={driver.skins}
                        carId={carId}
                        onChange={skins => handleFieldChange('skins', skins)}
                    />
                </LabeledControl>
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
}

function generateEditable (teams: LeagueTeam[]) {
    const newArr = [] as EditableTeam[];

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
