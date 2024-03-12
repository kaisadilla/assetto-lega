// THIS WILL BE REMOVED. FOR EDITOR PAGE see: EditorPage

import React, { useEffect } from 'react';
import LeagueThumbnail from '../../components/leaguePage/LeagueThumbnail';
import Icon from 'elements/Icon';
import Button from 'elements/Button';
import LeagueEditor from './editor-page/LeagueEditor';
import { LeagueScreenPage, useNavigationContext } from '../../context/useNavigation';
import { useDataContext } from 'context/useDataContext';

export interface LeaguePageProps {

}

function LeaguePage (props: LeaguePageProps) {
    const { leagueScreen, setLeagueScreen } = useNavigationContext();
    const { leagues } = useDataContext();

    console.log("leagues", leagues);

    const $thumbnails = leagues.map(l => (
        <LeagueThumbnail league={l} key={l.internalName} width="355px" />
    ))

    const $selection = (
        <div className="league-selection-grid">
            <div className="league-cell-choose league-selection-title">
                <h1>Choose a league</h1>
            </div>
            <div className="league-cell-leagues">
                {
                    $thumbnails
                }
            </div>
            <div className="league-cell-tools">
                <Button onClick={() => setLeagueScreen(LeagueScreenPage.EDITOR)}>
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
            { leagueScreen === LeagueScreenPage.SELECTION && $selection }
        </div>
    );
}

export default LeaguePage;