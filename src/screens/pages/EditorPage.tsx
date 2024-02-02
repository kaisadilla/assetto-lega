import LeagueMenu from 'components/LeagueMenu';
import LeagueEditor from 'components/leaguePage/LeagueEditor';
import { useDataContext } from 'context/useDataContext';
import { League } from 'data/schemas';
import Button from 'elements/Button';
import Icon from 'elements/Icon';import React, { useState } from 'react';

export interface EditorPageProps {

}

function EditorPage (props: EditorPageProps) {
    const { leaguesById } = useDataContext();
    
    // The league currently being edited. When this value is equal to null,
    // the main menu is shown instead. 
    const [league, setLeague] = useState<null | League>(null);

    return (
        <div className="editor-page">
            {league === null && <LeagueSelection onSelect={handleSelectLeague} />}
            {league && <LeagueEditor mode="create" />}
        </div>
    );

    function handleSelectLeague (leagueId: string) {
        const l = leaguesById[leagueId];

        if (l) {
            setLeague(l);
        }
        else {
            throw `Cannot find league with name ${leagueId}`;
        }
    }
}


export interface LeagueSelectionProps {
    onSelect: (leagueId: string) => void;
}

function LeagueSelection ({
    onSelect,
}: LeagueSelectionProps) {
    const { leagues } = useDataContext();

    return (
        <div className="league-selection">
            <div className="league-menu-container">
                <LeagueMenu
                    leagues={leagues}
                    onSelect={onSelect}
                />
            </div>
            <div className="toolbar-bottom">
                <Button onClick={() => console.log("not implemented: create league")}>
                    <Icon name="fa-plus" />
                    <span>Create league</span>
                </Button>
            </div>
        </div>
    );
}

export default EditorPage;