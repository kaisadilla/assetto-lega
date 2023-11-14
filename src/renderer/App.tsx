import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '@assets/icon.png';
import 'styles/main.scss';
import { NavigationContextProvider, AppTab } from 'context/useNavigation';
import MainPage from 'pages/MainPage';
import { LeagueEditorContextProvider } from 'context/useLeagueEditor';
import { SettingsContextProvider } from 'context/useSettings';
import { DataContextProvider } from 'context/useDataContext';

export default function App () {    
    return (
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
    );
}