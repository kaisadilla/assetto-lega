import { LeagueTeam } from 'data/schemas';
import MaterialSymbol from 'elements/MaterialSymbol';
import React from 'react';

export interface TeamEditionTableProps {
    teams: LeagueTeam[];
}

function TeamEditionTable ({
    teams,
}: TeamEditionTableProps) {

    return (
        <div className="team-edition-table">
            <div className="team-list">
                <div className="team-entry">
                    <div className="team-name">Red Bull</div>
                    <div className="delete-button">
                        <MaterialSymbol symbol='delete' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamEditionTable;
