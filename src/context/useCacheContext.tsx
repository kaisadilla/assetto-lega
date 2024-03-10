import { createContext, useContext, useMemo, useState } from "react";

const CacheContext = createContext({} as CacheContextState);
export const useCacheContext = () => useContext(CacheContext);

// TODO: Rethink if this approach to storing so many different values in an
// orderly way makes any sense.
interface CacheContextState {
    ['league-editor/drivers/qualifying/participants']: number,
    ['set/league-editor/drivers/qualifying/participants']: (n: number) => void,
};

export const CacheContextProvider = ({ children }: any) => {
    const [state, setState] = useState<CacheContextState>({
        'league-editor/drivers/qualifying/participants': 20,
    } as CacheContextState);

    const value = useMemo(() => {
        async function setLeagueEditor_Drivers_Qualifying_Participants (
            value: number
        ) {
            setState(prev => ({
                ...prev,
                'league-editor/drivers/qualifying/participants': value,
            }));
        }

        return {
            ...state,
            'set/league-editor/drivers/qualifying/participants':
                setLeagueEditor_Drivers_Qualifying_Participants
        }
    }, [state]);

    return (
        <CacheContext.Provider value={value}>
            {children}
        </CacheContext.Provider>
    );
}