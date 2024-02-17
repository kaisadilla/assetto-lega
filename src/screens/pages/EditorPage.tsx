import React, { useState } from 'react';
import LeagueEditor from 'screens/pages/editor-page/LeagueEditor';
import { useDataContext } from 'context/useDataContext';
import { League } from 'data/schemas';
import LeagueSelection from './editor-page/LeagueSelection';
import Ipc from 'main/ipc/ipcRenderer';

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
            {
                league && <LeagueEditor
                    league={league}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            }
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

    async function handleSave (editedLeague: League) {
        await Ipc.saveLeague(league?.internalName ?? null, editedLeague);
        // TODO: update league in the program's memory.
        // TODO: add buttons for 'save' and 'save and exit'.
        setLeague(null);
    }

    function handleCancel () {
        setLeague(null);
    }
}

export default EditorPage;