import TeamTable from 'components/TeamTable';
import EditorTeam from 'components/TeamTable';
import { League } from 'data/schemas';
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
    const res = Ipc.getCarData("rss_formula_hybrid_2023"); // await
    console.log(res);

    return (
        <div className="editor-tab teams-tab">
            <TeamTable teams={league.teams} />
        </div>
    );
}

export default TeamsTab;
