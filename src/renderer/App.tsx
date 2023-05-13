import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '@assets/icon.png';
import 'styles/main.scss';
import { NavigationContextProvider, AppTab } from 'components/useNavigation';
import MainPage from 'components/MainPage';
import { LeagueEditorContextProvider } from 'components/useLeagueEditor';

export default function App () {
    // TODO: Remove
    //const { nativeImage } = window.require("electron");
    //const flag = nativeImage.createFromPath("D:/repos/assetto-lega/src/res/flags/mexico.png");
    //const flag = nativeImage.createFromPath("assets/outline.png");
    //console.log(flag);
    //console.log(__dirname);
    //const $img = <img src={flag.toDataURL()} />;
    
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