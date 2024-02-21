import CarField from 'components/CarField';
import ColorField from 'components/ColorField';
import CountryField from 'components/CountryField';
import ImageField from 'components/ImageField';
import { AssetFolder } from 'data/assets';
import { LeagueTeam, LeagueTeamDriver } from 'data/schemas';
import Button from 'elements/Button';
import LabeledControl from 'elements/LabeledControl';
import MaterialSymbol from 'elements/MaterialSymbol';
import NavBar from 'elements/NavBar';
import NumericBox from 'elements/NumericBox';
import Textbox from 'elements/Textbox';
import ToolboxRow from 'elements/ToolboxRow';
import Form from 'elements/form/Form';
import React, { useState } from 'react';
import { getClassString } from 'utils';

enum TeamEditorTab {
    INFO,
    DRIVERS,
}

export interface TeamEditionTableProps {
    teams: LeagueTeam[];
}

function TeamEditionTable ({
    teams,
}: TeamEditionTableProps) {
    const [editedTeams, setEditedTeams] = useState(cloneTeamArray(teams));
    // an array that mirrors 'edited teams'. Each boolean represents whether a
    // team has been edited or not.
    const [editFlags, setEditFlags] = useState(editedTeams.map(() => false));
    const [selectedTeam, setSelectedTeam] = useState(0);
    const [tab, setTab] = useState(TeamEditorTab.INFO);

    return (
        <div className="team-edition-table">
            <TeamList
                teams={teams}
                editFlags={editFlags}
                selectedIndex={selectedTeam}
                onSelect={handleTeamSelect}
            />
            <div className="team-panel">
                <NavBar className="team-panel-nav-bar" get={tab} set={setTab}>
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
                        onChange={handleInfoChange}
                    />}
                </div>
            </div>
            <ToolboxRow className="team-toolbar">
                <Button>Reset</Button>
                <Button>Commit changes</Button>
                <Button>Discard</Button>
                <Button highlighted>Save and end</Button>
            </ToolboxRow>
        </div>
    );

    function handleTeamSelect (index: number) {
        setSelectedTeam(index);
    }

    function handleInfoChange (field: keyof LeagueTeam, value: any) {
        const team = {
            ...editedTeams[selectedTeam],
            [field]: value,
        };

        const newTeams = [...editedTeams];
        newTeams[selectedTeam] = team;

        setEditedTeams(newTeams);

        const newEdits = [...editFlags]
        newEdits[selectedTeam] = true;
        setEditFlags(newEdits);
    }
}

interface TeamListProps {
    teams: LeagueTeam[];
    editFlags: boolean[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

function TeamList ({
    teams,
    editFlags,
    selectedIndex,
    onSelect,
}: TeamListProps) {
    return (
        <div className="team-list">
            <h3 className="cell-header">Teams</h3>
            {
                teams.map((t, i) => <TeamEntry
                    key={i}
                    team={t}
                    selected={selectedIndex === i}
                    edited={editFlags[i]}
                    onSelect={() => onSelect(i)}
                />)
            }
        </div>
    );
}

interface TeamEntryProps {
    team: LeagueTeam;
    selected: boolean;
    edited: boolean;
    onSelect: () => void;
}

function TeamEntry ({
    team,
    selected,
    edited,
    onSelect,
}: TeamEntryProps) {
    const displayName = team.shortName ?? team.name;

    const classStr = getClassString(
        "team-entry",
        selected && "selected",
        edited && "edited",
    )

    return (
            <div className={classStr}>
                <div className="team-name" onClick={() => onSelect()}>
                    {edited && <span className="edit-mark">*</span>}
                    <span>{displayName}</span>
                </div>
                <Button className="delete-button">
                    <MaterialSymbol symbol='close' />
                </Button>
            </div>
    );
}

export interface TabInfoProps {
    team: LeagueTeam,
    onChange: (field: keyof LeagueTeam, value: any) => void;
}

function TabInfo ({
    team,
    onChange,
}: TabInfoProps) {
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
                    />
                </LabeledControl>
                <LabeledControl label="Short name">
                    <Textbox
                        value={team.shortName}
                        onChange={str => handleFieldChange('shortName', str)}
                    />
                </LabeledControl>
                <LabeledControl label="Constructor">
                    <Textbox
                        value={team.constructorName}
                        onChange={str => handleFieldChange('constructorName', str)}
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
    team: LeagueTeam,
    onChange: (field: keyof LeagueTeam, value: any) => void;
}

function TabDrivers ({
    team,
    onChange,
}: TabDriversProps) {

    return (
        <div className="tab-drivers">
            <div className="driver-list">
                {team.drivers.map(d => <DriverCard key={d.name} driver={d} />)}
            </div>
        </div>
    );
}

interface DriverCardProps {
    driver: LeagueTeamDriver;
}

function DriverCard ({
    driver
}: DriverCardProps) {

    return (
        <Form className="driver">
            <Form.Section className="images-section" horizontalAlignment='center'>
                <Form.Title title="Photo" />
                <ImageField
                    className="photo-image-field"
                    directory={AssetFolder.teamLogos}
                    image={"@red-bull"}
                    defaultImageSize={96}
                />
            </Form.Section>
            <Form.Section className="info-section">
                <LabeledControl label="Name" required>
                    <Textbox
                        value={driver.name}
                    />
                </LabeledControl>
                <LabeledControl label="Number" required>
                    <Textbox
                        value={driver.number}
                    />
                </LabeledControl>
                <LabeledControl label="Initials" required>
                    <Textbox
                        value={driver.initials}
                    />
                </LabeledControl>
                <LabeledControl label="Country" required>
                    <CountryField
                        value={driver.country}
                    />
                </LabeledControl>
                <LabeledControl label="Strength" required>
                    <NumericBox
                        value={driver.strength}
                        minValue={70}
                        maxValue={100}
                        allowDecimals={true}
                        maxDecimalPlaces={1}
                    />
                </LabeledControl>
                <LabeledControl label="Aggression" required>
                    <NumericBox
                        value={driver.aggression}
                        minValue={0}
                        maxValue={100}
                        allowDecimals={true}
                        maxDecimalPlaces={1}
                    />
                </LabeledControl>
            </Form.Section>
        </Form>
    );
}



function cloneTeamArray (teams: LeagueTeam[]) {
    const newArr = [];

    for (const t of teams) {
        newArr.push(structuredClone(t));
    }

    return newArr;
}

export default TeamEditionTable;
