import Icon from 'elements/Icon';
import React from 'react';
import { LeagueTeam } from '../../screens/pages/editor-page/LeagueEditor';


import ukEx from "@assets/flags/united_kingdom.png";
import skinEx from "@assets/skin-icon.png";

export interface EditorTeamDriverProps {
    team: LeagueTeam
}

function EditorTeamDriver ({
    team
}: EditorTeamDriverProps
) {
    const bgStyle = { backgroundColor: team.color };

    return (
        <div className="driver-info" style={bgStyle}>
            <div className="driver-number">
                <div>44</div>
            </div>
            <img className="driver-flag" src={ukEx} />
            <span className="driver-name">Lewis Hamilton</span>
            <span className="car-name">Formula Hybrid 2019</span>
            <div className="skin-icons">
                <img className="skin-icon" src={skinEx} />
                <img className="skin-icon" src={skinEx} />
            </div>
            <div className="driver-stats">
                <div className="team-stat">
                    <div className="stat-name">str</div>
                    <div className="stat-value">99</div>
                </div>
                <div className="team-stat">
                    <div className="stat-name">agr</div>
                    <div className="stat-value">92</div>
                </div>
            </div>
            <div className="remove-driver">
                <Icon name="fa-trash" />
            </div>
        </div>
    );
}

export default EditorTeamDriver;