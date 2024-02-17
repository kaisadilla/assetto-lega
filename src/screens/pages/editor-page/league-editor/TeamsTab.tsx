import TeamTable from 'components/TeamTable';
import EditorTeam from 'components/TeamTable';
import { League } from 'data/schemas';
import Button from 'elements/Button';
import Ipc from 'main/ipc/ipcRenderer';
import React from 'react';

export interface TeamsTabProps {
    league: League;
    onChange: (field: keyof League, value: any) => void;
}

function TeamsTab ({
    league,
    onChange,
}: TeamsTabProps) {
    const teamCount = league.teams.length;
    const driverCount = league.teams.reduce(
        (acc, t) => acc += t.drivers.length, 0
    );

    return (
        <div className="editor-tab teams-tab">
            <div className="teams-table-container">
                <TeamTable teams={league.teams} />
            </div>
            <div className="teams-tab-toolbar">
                <div className="teams-datum">{teamCount} teams</div>
                <div className="teams-datum">{driverCount} drivers</div>
                <div className="tools">
                    <Button highlighted>
                        Edit teams
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default TeamsTab;
