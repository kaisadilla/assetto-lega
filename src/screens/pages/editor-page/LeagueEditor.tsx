import NavBar from 'elements/NavBar';
import { useNavigationContext } from 'context/useNavigation';
import { useState } from 'react';
import InfoTab from './league-editor/InfoTab';
import { League } from 'data/schemas';
import ToolboxRow from 'elements/ToolboxRow';
import Button from 'elements/Button';
import TeamsTab from './league-editor/TeamsTab';

enum EditorTab {
    INFO,
    TEAMS,
    TRACKS,
    CALENDAR,
    SCORE_SYSTEM,
}

export interface LeagueEditorProps {
    /**
     * The base league object to edit. Note that this specific object will NOT
     * be edited, but instead used as a base to build the new league object
     * that will store all changes made by the user. The edited league will be
     * passed as an argument in the onSave() and onCancel() callbacks.
     */
    league: League;
    onSave?: (currentVersion: League) => void;
    onCancel?: (currentVersion: League) => void;
}

function LeagueEditor ({
    league,
    onSave,
    onCancel,
}: LeagueEditorProps) {
    const [editedLeague, setEditedLeague] = useState(cloneLeague(league));
    const [editorTab, setEditorTab] = useState(EditorTab.INFO);

    const $screen = (() => {
        if (editorTab === EditorTab.INFO) {
            return (
                <InfoTab league={editedLeague} onChange={handleLeagueFieldChange} />
            );
        }
        if (editorTab === EditorTab.TEAMS) {
            return (
                <TeamsTab league={editedLeague} onChange={handleLeagueFieldChange} />
            );
            //return <EditorTabTeams teams={teams} setTeams={setTeams} />
        }
        return <></>;
    })();

    return (
        <div className="league-editor">
            <NavBar get={editorTab} set={setEditorTab}>
                <NavBar.Item text="info" index={EditorTab.INFO} />
                <NavBar.Item text="teams" index={EditorTab.TEAMS} />
                <NavBar.Item text="tracks" index={EditorTab.TRACKS} />
                <NavBar.Item text="calendar" index={EditorTab.CALENDAR} />
                <NavBar.Item text="score system" index={EditorTab.SCORE_SYSTEM} />
            </NavBar>
            {$screen}
            <ToolboxRow>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave} highlighted>Save</Button>
            </ToolboxRow>
        </div>
    );

    function handleLeagueFieldChange (field: keyof League, value: any) {
        setEditedLeague({
            ...editedLeague,
            [field]: value,
        } as League);
    }

    function handleCancel () {
        onCancel?.(editedLeague);
    }

    function handleSave () {
        onSave?.(editedLeague);
    }
}

function cloneLeague (original: League) : League {
    return structuredClone(original);
}

export default LeagueEditor;