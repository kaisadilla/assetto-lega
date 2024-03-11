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
import ScoreSystemTab from './league-editor/ScoreSystemTab';

enum EditorTab {
    INFO,
    TEAMS,
    DRIVERS,
    CALENDAR,
    TRACKS, // TODO: Tracks in CALENDAR appear automatically here and can't be removed.
    SCORE_SYSTEM,
    INGAME_UI,
    BACKUPS,
}

export interface LeagueEditorProps {
    /**
     * The base league object to edit. Note that this specific object will NOT
     * be edited, but instead used as a base to build the new league object
     * that will store all changes made by the user. The edited league will be
     * passed as an argument in the onSave() and onCancel() callbacks.
     */
    league: League;
    existingLeagueCategories: string[];
    onSave?: (currentVersion: League) => void;
    onSaveAndExit?: (currentVersion: League) => void;
    onCancel?: (currentVersion: League) => void;
}

function LeagueEditor ({
    league,
    existingLeagueCategories,
    onSave,
    onSaveAndExit,
    onCancel,
}: LeagueEditorProps) {
    const [editedLeague, setEditedLeague] = useState(cloneLeague(league));
    const [editorTab, setEditorTab] = useState(EditorTab.INFO);
    // the editor tab that will be chosen if the user confirms a change.
    const [nextEditorTab, setNextEditorTab] = useState(EditorTab.INFO);

    const [isEdited, setEdited] = useState(false);

    // whether the program should ask when tabbing out.
    const [askWhenTabbingOut, setAskWhenTabbingOut] = useState(false);
    const [isDialogTabOutOpen, setDialogTabOutOpen] = useState(false);
    const [isDialogCancelOpen, setDialogCancelOpen] = useState(false);

    const $screen = (() => {
        if (editorTab === EditorTab.INFO) {
            return (
                <InfoTab
                    league={editedLeague}
                    onChange={handleLeagueFieldChange}
                    existingLeagueCategories={existingLeagueCategories}
                />
            );
        }
        if (editorTab === EditorTab.TEAMS) {
            return (
                <TeamsTab
                    league={editedLeague}
                    onChange={handleLeagueFieldChange}
                    setAskWhenTabbingOut={setAskWhenTabbingOut}
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
                    onChange={handleLeagueFieldChange}
                    setAskWhenTabbingOut={setAskWhenTabbingOut}
                />
            );
        }
        if (editorTab === EditorTab.SCORE_SYSTEM) {
            return (
                <ScoreSystemTab
                    league={editedLeague}
                    onChange={handleLeagueFieldChange}
                />
            );
        }
        return <></>;
    })();

    return (
        <div className="league-editor">
            <NavBar get={editorTab} set={handleSelectTab}>
                <NavBar.Item text="info" index={EditorTab.INFO} />
                <NavBar.Item text="teams" index={EditorTab.TEAMS} />
                <NavBar.Item text="drivers" index={EditorTab.DRIVERS} />
                <NavBar.Item text="calendar" index={EditorTab.CALENDAR} />
                <NavBar.Item text="tracks" index={EditorTab.TRACKS} />
                <NavBar.Item text="score system" index={EditorTab.SCORE_SYSTEM} />
                <NavBar.Item text="ingame ui" index={EditorTab.INGAME_UI} />
                <NavBar.Item text="backups" index={EditorTab.BACKUPS} />
            </NavBar>
            {$screen}
            <ToolboxRow>
                <Button onClick={handleCancel}>Exit</Button>
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleSaveAndExit} highlighted>Save and exit</Button>
            </ToolboxRow>
            {isDialogTabOutOpen && <ConfirmDialog
                title="Change tab?"
                message="Do you want to change tabs? Your progress here will be lost."
                acceptText="Change"
                cancelText="Remain here"
                onAccept={handleAcceptSelectTab}
                setOpen={setDialogTabOutOpen}
            />}
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

    function handleSelectTab (index: any) {
        if (askWhenTabbingOut) {
            setNextEditorTab(index);
            setDialogTabOutOpen(true);
        }
        else {
            setEditorTab(index);
        }
    }

    function handleAcceptSelectTab () {
        setEditorTab(nextEditorTab);
        setAskWhenTabbingOut(false);
    }

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