import React, { useEffect, useState } from 'react';
import LeagueEditor from 'screens/pages/editor-page/LeagueEditor';
import { useDataContext } from 'context/useDataContext';
import { League, createNewLeague } from 'data/schemas';
import Ipc from 'main/ipc/ipcRenderer';
import Button from 'elements/Button';
import Icon from 'elements/Icon';
import LeagueMenu from 'components/LeagueMenu';

export interface EditorPageProps {

}

function EditorPage (props: EditorPageProps) {
    const { leagues, leaguesById, updateLeague } = useDataContext();
    
    // The league currently being edited. When this value is equal to null,
    // the main menu is shown instead. 
    const [league, setLeague] = useState<null | League>(null);

    return (
        <div className="editor-page">
            {league === null && <_LeagueSelection
                onSelect={handleSelectLeague}
                onCreate={handleCreateLeague}
            />}
            {league && <LeagueEditor
                league={league}
                existingLeagueCategories={getAllCategories(leagues)}
                onSave={handleSave}
                onSaveAndExit={handleSaveAndExit}
                onCancel={handleCancel}
            />}
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

    function handleCreateLeague () {
        const league = createNewLeague();
        setLeague(league);
    }

    async function handleSave (editedLeague: League) {
        // TODO: why not do this in data context?
        await Ipc.saveLeague(league?.internalName ?? null, editedLeague);
        updateLeague(league?.internalName ?? null, editedLeague);
        setLeague(editedLeague);
    }

    async function handleSaveAndExit (editedLeague: League) {
        await handleSave(editedLeague);
        setLeague(null);
    }

    function handleCancel () {
        setLeague(null);
    }
}

interface _LeagueSelectionProps {
    onSelect: (leagueId: string) => void;
    onCreate: () => void;
}

function _LeagueSelection ({
    onSelect,
    onCreate,
}: _LeagueSelectionProps) {
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
                <Button onClick={() => onCreate()}>
                    <Icon name="fa-plus" />
                    <span>Create league</span>
                </Button>
                <Button onClick={handleOpenFolder}>
                    <Icon name="fa-folder-open" />
                    <span>Open leagues folder</span>
                </Button>
            </div>
        </div>
    );

    function handleOpenFolder () {
        Ipc.openLeaguesFolder();
    }
}

// TODO: getAllCategories copied.
/**
 * Generates an array of strings containing all different categories within the
 * leagues given.
 */
function getAllCategories (leagues: League[]) : string[] {
    const catSet = new Set<string>();

    for (const l of leagues) {
        for (const c of l.categories) {
            catSet.add(c);
        }
    }

    return Array.from(catSet);
}

export default EditorPage;