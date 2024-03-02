import { League } from "data/schemas";
import { createContext, useContext, useMemo, useState } from "react";

interface INavigationContext {
    currentPage: Page;
    setCurrentPage: (tab: Page) => void;
    leagueScreen: LeagueScreenPage; // TODO remake
    setLeagueScreen: (screen: LeagueScreenPage) => void; // TODO remake
}

const NavigationContext = createContext({} as INavigationContext);
export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationContextProvider = ({ tab: page, children }: any) => {
    const [state, setState] = useState({
        currentPage: page ?? 0,
        leagueScreen: LeagueScreenPage.SELECTION,
    } as INavigationContext);

    const value = useMemo<INavigationContext>(() => {
        const setCurrentPage = (tab: Page) => {
            setState({
                ...state,
                currentPage: tab
            })
        };

        const setLeagueScreen = (screen: LeagueScreenPage) => {
            setState({
                ...state,
                leagueScreen: screen
            });
        }

        return {
            ...state,
            setCurrentPage,
            setLeagueScreen,
        }
    }, [state]);

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
}

export enum Page {
    FREE_DRIVE,
    LEAGUES,
    EDITOR,
    CONTENT,
    STATS,
    IMPORT,
};

export enum LeagueScreenPage {
    SELECTION,
    LEAGUE,
    EDITOR,
};