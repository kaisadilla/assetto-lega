import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '@assets/icon.png';
import { NavigationContextProvider, AppTab } from 'context/useNavigation';
import MainPage from 'pages/MainPage';
import { LeagueEditorContextProvider } from 'context/useLeagueEditor';
import { SettingsContextProvider } from 'context/useSettings';
import { DataContextProvider } from 'context/useDataContext';
import { Tooltip } from 'react-tooltip';

import 'styles/main.scss';
import 'react-tooltip/dist/react-tooltip.css';
import { DEFAULT_TOOLTIP_ID } from 'names';

export default function App () {    
    return (
        <>
            <div className="app">
                <SettingsContextProvider>
                <NavigationContextProvider tab={AppTab.LEAGUES}>
                <LeagueEditorContextProvider>
                <DataContextProvider>

                    <MainPage />
                    
                </DataContextProvider>
                </LeagueEditorContextProvider>
                </NavigationContextProvider>
                </SettingsContextProvider>
            </div>
            <Tooltip
                id={DEFAULT_TOOLTIP_ID}
                className="tooltip default-tooltip"
            />
        </>
    );
}