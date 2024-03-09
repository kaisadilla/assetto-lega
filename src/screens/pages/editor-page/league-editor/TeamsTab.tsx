import TeamTable from 'components/TeamTable';
import EditorTeam from 'components/TeamTable';
import { League, LeagueTeam } from 'data/schemas';
import Button from 'elements/Button';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useState } from 'react';
import TeamEditionTable from './TeamEditionTable';

enum TabMode {
    View,
    Edit,
}

export interface TeamsTabProps {
    league: League;
    onChange: (field: keyof League, value: any) => void;
}

function TeamsTab ({
    league,
    onChange,
}: TeamsTabProps) {
    const [mode, setMode] = useState(TabMode.View);

    return (
        <div className="editor-tab teams-tab">
            {mode === TabMode.View && (
                <TeamViewModePanel
                    teams={league.teams}
                    defaultSpec={league.specs[0]}
                    onEdit={handleEdit}
                />
            )}
            {mode === TabMode.Edit && (
                <TeamEditModePanel
                    teams={league.teams}
                    specs={league.specs}
                    onSave={handleSaveTeams}
                    onClose={handleCloseEdit}
                />
            )}
        </div>
    );

    function handleEdit () {
        setMode(TabMode.Edit);
    }

    function handleSaveTeams (teams: LeagueTeam[]) {
        onChange('teams', teams);
    }

    function handleCloseEdit () {
        setMode(TabMode.View);
    }
}

export interface TeamViewModePanelProps {
    teams: LeagueTeam[];
    defaultSpec: string;
    onEdit: () => void;
}

function TeamViewModePanel ({
    teams,
    defaultSpec,
    onEdit,
}: TeamViewModePanelProps) {
    const teamCount = teams.length;
    const fullDriverCount = teams.reduce(
        (acc, t) => acc += t.drivers.length, 0
    );
    const reserveDriverCount = teams.reduce(
        (acc, t) => acc += t.drivers.filter(d => d.isReserveDriver).length, 0
    );

    return (
        <div className="teams-tab-view">
            <div className="teams-table-container">
                <TeamTable teams={teams} defaultSpec={defaultSpec} />
            </div>
            <div className="status-bar">
                <div className="datum">{teamCount} teams</div>
                <div className="datum">
                    {fullDriverCount} drivers ({reserveDriverCount} in reserve)
                </div>
                <div className="tools">
                    <Button onClick={onEdit} highlighted>
                        Edit teams
                    </Button>
                </div>
            </div>
        </div>
    );
}

export interface TeamEditModePanelProps {
    teams: LeagueTeam[];
    specs: string[];
    onSave: (teams: LeagueTeam[]) => void;
    onClose: () => void;
}

function TeamEditModePanel ({
    teams,
    specs,
    onSave,
    onClose,
}: TeamEditModePanelProps) {

    return (
        <div className="teams-tab-edit">
            <TeamEditionTable 
                teams={teams}
                specs={specs}
                onSave={handleSave}
                onClose={handleClose}
            />
        </div>
    );

    function handleSave (teams: LeagueTeam[]) {
        onSave(teams);
    }

    function handleClose () {
        onClose();
    }
}

export default TeamsTab;
