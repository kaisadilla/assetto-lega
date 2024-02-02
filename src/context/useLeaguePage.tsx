import { League } from "data/schemas";
import { createContext, useContext, useMemo, useState } from "react";

interface ILeaguePageContext {

}

interface LeagueContextProviderState {
    leagues: League[];
}

const LeaguePageContext = createContext({} as ILeaguePageContext);
export const useLeaguePageContext = () => useContext(LeaguePageContext);

export const LeaguePageContextProvider = ( { children }: any) => {
    const [state, setState] = useState({
        leagues: [], // TODO: Possibly remove
    } as LeagueContextProviderState);

    const value = useMemo(() => {
        const addLeague = (league: League) => {
            setState({
                ...state,
                leagues: [...state.leagues, league],
            });
        }

        return {
            ...state,
            addLeague,
        }
    }, [state]);
}