import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '@assets/icon.png';
import { NavigationContextProvider, Page } from 'context/useNavigation';
import MainScreen from 'screens/MainScreen';
import { LeagueEditorContextProvider } from 'context/useLeagueEditor';
import { SettingsContextProvider } from 'context/useSettings';
import { DataContextProvider } from 'context/useDataContext';
import { Tooltip } from 'react-tooltip';
import darkTheme from 'styles/main.scss';
import 'react-tooltip/dist/react-tooltip.css';
import { DEFAULT_TOOLTIP_ID } from 'names';
    

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartJSTooltip,
    Legend,
    Filler,
} from 'chart.js';
import { CacheContextProvider } from 'context/useCacheContext';
import { AcContextProvider } from 'context/useAcContext';

registerChartJs();

export default function App () {
    // TODO: Themes!
    //document.documentElement.style.setProperty('--color-primary', "#00ffff");

    
    return (
        <>
            <div className="window" style={darkTheme}>
                <SettingsContextProvider>
                <CacheContextProvider>
                <NavigationContextProvider tab={Page.LEAGUES}>
                <LeagueEditorContextProvider>
                <AcContextProvider>
                <DataContextProvider>

                    <MainScreen />

                </DataContextProvider>
                </AcContextProvider>
                </LeagueEditorContextProvider>
                </NavigationContextProvider>
                </CacheContextProvider>
                </SettingsContextProvider>
            </div>
            <Tooltip
                id={DEFAULT_TOOLTIP_ID}
                className="tooltip default-tooltip"
            />
        </>
    );
}

function registerChartJs () {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        ChartJSTooltip,
        Legend,
        Filler,
    );
}