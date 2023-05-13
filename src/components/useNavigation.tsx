import { createContext, useContext, useMemo, useState } from "react";

interface INavigationContext {
    selectedTab: AppTab;
    setSelectedTab: (tab: AppTab) => void;
    leagueScreen: LeagueScreen;
    setLeagueScreen: (screen: LeagueScreen) => void;
    leagueEditorTab: LeagueEditorTab;
    setLeagueEditorTab: (tab: LeagueEditorTab) => void;
}

const NavigationContext = createContext({} as INavigationContext);
export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationContextProvider = ({ tab, children }: any) => {
    const [state, setState] = useState({
        selectedTab: tab ?? 0,
        leagueScreen: LeagueScreen.SELECTION,
        leagueEditorTab: LeagueEditorTab.INFO,
    });

    const value = useMemo(() => {
        const setSelectedTab = (tab: AppTab) => {
            setState({
                ...state,
                selectedTab: tab
            })
        };

        const setLeagueScreen = (screen: LeagueScreen) => {
            setState({
                ...state,
                leagueScreen: screen
            });
        }

        const setLeagueEditorTab = (tab: LeagueEditorTab) => {
            setState({
                ...state,
                leagueEditorTab: tab
            });
        }

        return {
            ...state,
            setSelectedTab,
            setLeagueScreen,
            setLeagueEditorTab,
        }
    }, [state]);

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
}

export enum AppTab {
    FREE_DRIVE,
    LEAGUES,
};

export enum LeagueScreen {
    SELECTION,
    LEAGUE,
    EDITOR,
};

export enum LeagueEditorTab {
    INFO,
    TEAMS,
    TRACKS,
    CALENDAR,
    SCORE_SYSTEM,
}