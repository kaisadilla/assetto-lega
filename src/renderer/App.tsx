import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '@assets/icon.png';
import 'styles/main.scss';
import { NavigationContextProvider, AppTab } from 'components/useNavigation';
import MainPage from 'components/MainPage';
import { LeagueEditorContextProvider } from 'components/useLeagueEditor';

export default function App () {    
    return (
        <div className="app">
            <NavigationContextProvider tab={AppTab.LEAGUES}>
            <LeagueEditorContextProvider>

                <MainPage />

            </LeagueEditorContextProvider>
            </NavigationContextProvider>
        </div>
    );
}