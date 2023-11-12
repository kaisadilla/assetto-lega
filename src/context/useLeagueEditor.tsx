import { createContext, useContext, useMemo, useState } from "react";

interface ILeagueEditorContext {
    
}

const LeagueEditorContext = createContext<ILeagueEditorContext>({} as ILeagueEditorContext);
export const useLeagueEditorContext = () => useContext(LeagueEditorContext);

export const LeagueEditorContextProvider = ({ children }: any) => {
    const [state, setState] = useState({
        
    });

    const value = useMemo(() => {
        return {
            ...state,
        }
    }, [state]);

    return (
        <LeagueEditorContext.Provider value={value}>
            {children}
        </LeagueEditorContext.Provider>
    );
}