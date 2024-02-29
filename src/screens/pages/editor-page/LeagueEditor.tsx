import NavBar from 'elements/NavBar';
import { useNavigationContext } from 'context/useNavigation';
import { useState } from 'react';
import InfoTab from './league-editor/InfoTab';
import { League } from 'data/schemas';
import ToolboxRow from 'elements/ToolboxRow';
import Button from 'elements/Button';
import TeamsTab from './league-editor/TeamsTab';
import ConfirmDialog from 'elements/ConfirmDialog';
import DriversTab from './league-editor/DriversTab';
import CalendarTab from './league-editor/CalendarTab';

enum EditorTab {
    INFO,
    TEAMS,
    DRIVERS,
    CALENDAR,
    TRACKS, // TODO: Tracks in CALENDAR appear automatically here and can't be removed.
    SCORE_SYSTEM,
    INGAME_UI,
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
    onSaveAndExit?: (currentVersion: League) => void;
    onCancel?: (currentVersion: League) => void;
}

function LeagueEditor ({
    league,
    onSave,
    onSaveAndExit,
    onCancel,
}: LeagueEditorProps) {
    const [editedLeague, setEditedLeague] = useState(cloneLeague(league));
    const [editorTab, setEditorTab] = useState(EditorTab.INFO);
    const [isEdited, setEdited] = useState(false);

    const [isDialogCancelOpen, setDialogCancelOpen] = useState(false);

    const $screen = (() => {
        if (editorTab === EditorTab.INFO) {
            return (
                <InfoTab
                    league={editedLeague}
                    onChange={handleLeagueFieldChange}
                />
            );
        }
        if (editorTab === EditorTab.TEAMS) {
            return (
                <TeamsTab
                    league={editedLeague}
                    onChange={handleLeagueFieldChange}
                />
            );
        }
        if (editorTab === EditorTab.DRIVERS) {
            return (
                <DriversTab
                    league={editedLeague}
                    onChange={teams => handleLeagueFieldChange('teams', teams)}
                />
            );
        }
        if (editorTab === EditorTab.CALENDAR) {
            return (
                <CalendarTab
                    league={editedLeague}
                />
            );
        }
        return <></>;
    })();

    return (
        <div className="league-editor">
            <NavBar get={editorTab} set={setEditorTab}>
                <NavBar.Item text="info" index={EditorTab.INFO} />
                <NavBar.Item text="teams" index={EditorTab.TEAMS} />
                <NavBar.Item text="drivers" index={EditorTab.DRIVERS} />
                <NavBar.Item text="calendar" index={EditorTab.CALENDAR} />
                <NavBar.Item text="tracks" index={EditorTab.TRACKS} />
                <NavBar.Item text="score system" index={EditorTab.SCORE_SYSTEM} />
                <NavBar.Item text="ingame ui" index={EditorTab.INGAME_UI} />
            </NavBar>
            {$screen}
            <ToolboxRow>
                <Button onClick={handleCancel}>Exit</Button>
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleSaveAndExit} highlighted>Save and exit</Button>
            </ToolboxRow>
            {isDialogCancelOpen && <ConfirmDialog
                title="Exit without saving?"
                message="Do you want to close this league without saving any changes?"
                acceptText="Discard changes"
                cancelText="Keep open"
                onAccept={handleCancelDialog}
                setOpen={setDialogCancelOpen}
            />}
        </div>
    );

    function handleLeagueFieldChange (field: keyof League, value: any) {
        setEditedLeague(prevState => ({
            ...prevState,
            [field]: value,
        }));
        setEdited(true);
    }

    function handleCancel () {
        if (isEdited) {
            setDialogCancelOpen(true);
        }
        else {
            onCancel?.(editedLeague);
        }
    }

    function handleCancelDialog () {
        onCancel?.(editedLeague);
    }

    function handleSave () {
        onSave?.(editedLeague);
    }

    function handleSaveAndExit () {
        onSaveAndExit?.(editedLeague);
    }
}

function cloneLeague (original: League) : League {
    return structuredClone(original);
}

export default LeagueEditor;