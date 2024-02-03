import NavBar from 'elements/NavBar';
import { useNavigationContext } from 'context/useNavigation';
import { useState } from 'react';
import InfoTab from './league-editor/InfoTab';
import { League } from 'data/schemas';

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

function LeagueEditor (props: LeagueEditorProps) {
    const [league, setLeague] = useState(cloneLeague(props.league));
    const [editorTab, setEditorTab] = useState(EditorTab.INFO);

    const $screen = (() => {
        if (editorTab === EditorTab.INFO) {
            return (
                <InfoTab />
            )
        }
        if (editorTab === EditorTab.TEAMS) {
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
        </div>
    );
}

function cloneLeague (original: League) : League {
    return structuredClone(original);
}

export default LeagueEditor;