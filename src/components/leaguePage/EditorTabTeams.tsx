import React, { ReactElement, useEffect, useState } from 'react';
import "styles/components/editor-tab-teams.scss";
import Icon from 'elements/Icon';
import EditorTeam from 'components/leaguePage/EditorTeam';
import { LeagueTeam } from 'screens/pages/editor-page/LeagueEditor';
import { generateRandomColor } from 'utils';

export interface EditorTabTeamsProps {
    teams: LeagueTeam[],
    setTeams: (t: LeagueTeam[]) => void,
}

function EditorTabTeams ({
    teams,
    setTeams
}: EditorTabTeamsProps
) {
    const [$teams, set$teams] = useState([] as ReactElement[]);

    useEffect(() => {
        const $t: ReactElement[] = [];
        for (var i in teams) {
            $t.push(
                <EditorTeam key={i} team={teams[i]} setTeam={() => {}} />
            );
        }
        set$teams($t);
    }, [teams]);

    return (
        <div className="editor-tab-teams">
            <div className="teams-container">
                <span>{teams.length} teams added.</span>
                {$teams}
                <div className="editor-add-button add-team">
                    <Icon name="fa-add" />
                    <span onClick={addTeam}>Add team</span>
                </div>
            </div>
        </div>
    );

    function addTeam () {
        setTeams([
            ...teams,
            getBlankTeam(),
        ]);
    }
}

function getBlankTeam () : LeagueTeam {
    return {
        "name": null,
        "car": null,
        "country": null,
        "icon": null,
        "color": generateRandomColor(),
        "ballast": 0,
        "restrictor": 0,
        "mainDriver": 0,
        "drivers": []
    };
}

export default EditorTabTeams;