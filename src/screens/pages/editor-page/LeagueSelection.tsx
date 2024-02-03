import LeagueMenu from "components/LeagueMenu";
import { useDataContext } from "context/useDataContext";
import Button from "elements/Button";
import Icon from "elements/Icon";
import react from "react";


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

export default LeagueSelection;