import LeagueMenu from "components/LeagueMenu";
import { useDataContext } from "context/useDataContext";
import Button from "elements/Button";
import Icon from "elements/Icon";
import Ipc from "main/ipc/ipcRenderer";
import react from "react";


export interface LeagueSelectionProps {
    onSelect: (leagueId: string) => void;
    onCreate: () => void;
}

function LeagueSelection ({
    onSelect,
    onCreate,
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

export default LeagueSelection;