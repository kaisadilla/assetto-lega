import React from 'react';
import "styles/components/editor-tab-teams.scss";
import Icon from 'elements/Icon';
import EditorTeam from 'components/leaguePage/EditorTeam';
import { LeagueTeam } from 'components/leaguePage/LeagueEditor';

export interface EditorTabTeamsProps {
    teams: LeagueTeam[],
    setTeams: (t: LeagueTeam[]) => void,
}

function EditorTabTeams ({
    teams,
    setTeams
}: EditorTabTeamsProps
) {
    console.log(teams);

    const $teams = [];

    for (var i in teams) {
        $teams.push(
            <EditorTeam key={i} team={teams[i]} setTeam={() => {}} />
        );
    }

    return (
        <div className="editor-tab-teams">
            TEAMS!
            {$teams}
        </div>
    );
}

export default EditorTabTeams;