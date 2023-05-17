import React, { useState } from 'react';
import NavBar from 'elements/NavBar';
import { useNavigationContext } from 'components/useNavigation';
import { LeagueTeam } from './LeagueEditor';
import { LeagueEditorTab } from 'components/useNavigation';
import EditorTabTeams from './EditorTabTeams';

export interface EditorTabProps {

}

function EditorTab (props: EditorTabProps) {
    const { leagueEditorTab, setLeagueEditorTab } = useNavigationContext();

    const [ teams, setTeams ] = useState([
        {
            "name": "Mercedes-AMG Petronas",
            "car": "rss_formula_hybrid_2022_s_mercedes",
            "country": "Germany",
            "icon": "mercedes",
            "color": "#03b87b",
            "ballast": 8,
            "restrictor": 0,
            "mainDriver": 0,
            "drivers": [
                {
                    "number": "44",
                    "name": "Lewis Hamilton",
                    "initials": "HAM",
                    "country": "Great Britain",
                    "skins": [
                        "W14_44_Hamilton"
                    ],
                    "strength": 98.764,
                    "aggression": 92.40
                }
            ]
        },
        {
            "name": "Oracle Red Bull Racing",
            "car": "rss_formula_hybrid_2022_s_red_bull",
            "country": "Austria",
            "icon": "red_bull",
            "color": "#15185F",
            "ballast": 0,
            "restrictor": 0,
            "mainDriver": 0,
            "drivers": [
                {
                    "number": "1",
                    "name": "Max Verstappen",
                    "initials": "VER",
                    "country": "Netherlands",
                    "skins": [
                        "RB19_1_Verstappen"
                    ],
                    "strength": 100,
                    "aggression": 100
                },
                {
                    "number": "11",
                    "name": "Sergio Pérez",
                    "initials": "PER",
                    "country": "Mexico",
                    "skins": [
                        "RB19_11_Perez"
                    ],
                    "strength": 94.41,
                    "aggression": 84.19
                }
            ]
        }
    ] as LeagueTeam[]);

    const $screen = (() => {
        if (leagueEditorTab === LeagueEditorTab.INFO) {
            return <div>INFO!</div>
        }
        if (leagueEditorTab === LeagueEditorTab.TEAMS) {
            return <EditorTabTeams teams={teams} setTeams={setTeams} />
        }
        return <></>; 
    })();

    return (
        <div>
            <NavBar get={leagueEditorTab} set={setLeagueEditorTab}>
                <NavBar.Item text="info" index={LeagueEditorTab.INFO} />
                <NavBar.Item text="teams" index={LeagueEditorTab.TEAMS} />
                <NavBar.Item text="tracks" index={LeagueEditorTab.TRACKS} />
                <NavBar.Item text="calendar" index={LeagueEditorTab.CALENDAR} />
                <NavBar.Item text="score system" index={LeagueEditorTab.SCORE_SYSTEM} />
            </NavBar>
            {$screen}
        </div>
    );
}

export default EditorTab;