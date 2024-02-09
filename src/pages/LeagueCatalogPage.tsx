import React, { useEffect } from 'react';
import "styles/components/league-screen.scss";
import LeagueThumbnail from '../components/leaguePage/LeagueThumbnail';
import Icon from 'elements/Icon';
import Button from 'elements/Button';
import LeagueEditor from '../components/leaguePage/LeagueEditor';
import { LeagueScreen, useNavigationContext } from '../context/useNavigation';
import { useDataContext } from 'context/useDataContext';

export interface LeagueCatalogPageProps {

}

function LeagueCatalogPage (props: LeagueCatalogPageProps) {
    const { leagues } = useDataContext();
    const { leagueScreen, setLeagueScreen } = useNavigationContext();

    const $selection = (
        <div className="league-selection-grid">
            <div className="league-cell-choose league-selection-title">
                <h1>Choose a league</h1>
            </div>
            <div className="league-cell-leagues">
                {
                    leagues.map(l => (
                        <LeagueThumbnail
                            key={l.internalName}
                            league={l}
                            width="355px"
                        />
                    ))
                }
            </div>
            <div className="league-cell-tools">
                <Button onClick={() => setLeagueScreen(LeagueScreen.EDITOR)}>
                    <Icon name="fa-plus" />
                    <span>Create league</span>
                </Button>
            </div>
            <div className="league-cell-view">
                GRID
            </div>
        </div>
    );

    return (
        <div className="league-screen">
            { leagueScreen === LeagueScreen.SELECTION && $selection }
            { leagueScreen === LeagueScreen.EDITOR && <LeagueEditor mode="create" /> }
        </div>
    );
}

export default LeagueCatalogPage;