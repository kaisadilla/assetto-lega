//import { ipcRenderer } from "electron";
import { League } from "data/schemas";
import Ipc from "main/ipc/ipcRenderer";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DataContext = createContext({} as DataContextState);
export const useDataContext = () => useContext(DataContext);

interface DataContextState {
    loading: boolean;
}

export const DataContextProvider = ({ children }: any) => {
    const [state, setState] = useState<DataContextState>({
        loading: true,
    });

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
        const leagues = await Ipc.loadLeagues();
        console.log(leagues);

        setState({
            loading: false,
        })
    }
}