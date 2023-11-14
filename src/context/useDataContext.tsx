//import { ipcRenderer } from "electron";
import { League, UserSettings } from "data/schemas";
import Ipc from "main/ipc/ipcRenderer";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DataContext = createContext({} as DataContextState);
export const useDataContext = () => useContext(DataContext);

interface DataContextState {
    loading: boolean;
    settings: UserSettings;
    leagues: League[];
}

export const DataContextProvider = ({ children }: any) => {
    const [state, setState] = useState<DataContextState>({
        loading: true,
    } as DataContextState);

    useEffect(() => {
        readData();
    }, [])

    const value = useMemo(() => {
        return {
            ...state,
        }
    }, [state]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );

    async function readData () {
        const settings = await Ipc.loadSettings();
        const leagues = await Ipc.loadLeagues();

        setState({
            loading: false,
            settings,
            leagues,
        });
    }
}