import React from 'react';
import { LeagueTeam } from './LeagueEditor';
import { COUNTRIES_ASSETTO_TO_LEGA } from 'data/countries';
import EditorTeamDriver from 'components/leaguePage/EditorTeamDriver';
import { loadImage } from 'game/files';
import Icon from 'elements/Icon';
import { useSettingsContext } from 'components/useSettings';

export interface EditorTeamProps {
    team: LeagueTeam,
    setTeam: (t: LeagueTeam) => void,
}

function EditorTeam ({
    team,
    setTeam
}: EditorTeamProps
) {
    const { legaPath } = useSettingsContext();

    let countryId = COUNTRIES_ASSETTO_TO_LEGA[team.country];
    if (!countryId) {
        countryId = "eu"; // TODO: Replace with "unknown".
    }

    const bgStyle = { backgroundColor: team.color };

    const teamEx = loadImage(`${legaPath}/assets/team-icon.png`);
    const teamFlag = loadImage(`${legaPath}/assets/flags/${countryId}.png`);

    return (
        <div className="team">
            <div className="team-info" style={bgStyle}>
                <img className="team-icon" src={teamEx} />
                <img className="team-flag" src={teamFlag} />
                <span className="team-name">{team.name}</span>
            </div>
            <div className="driver-list">
                {
                    team.drivers.map((d, i) => (
                        <EditorTeamDriver key={i} team={team} />
                    ))
                }
                <div className="driver-add">
                    <Icon name="fa-add" />
                    <span>Add driver</span>
                </div>
            </div>
        </div>
    );
}

export default EditorTeam;