//import { ipcRenderer } from "electron";
import { League, UserSettings } from "data/schemas";
import { isFolderAssettoCorsa } from "game/assettoCorsa";
import Ipc from "main/ipc/ipcRenderer";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DataContext = createContext({} as DataContextState);
export const useDataContext = () => useContext(DataContext);

interface DataContextState {
    loading: boolean;
    settings: UserSettings;
    leagues: League[];
    isACFolderValid: boolean;
    updateSettings: (settings: UserSettings) => void;
}

export const DataContextProvider = ({ children }: any) => {
    const [state, setState] = useState<DataContextState>({
        loading: true,
    } as DataContextState);

    useEffect(() => {
        readData();
    }, [])

    const value = useMemo(() => {
        async function updateSettings (settings: UserSettings) {
            const saved = await Ipc.saveSettings(settings);
            if (saved) {
                const isACFolderValid = await validateACFolder(settings);
                setState(prev => ({ ...prev, settings, isACFolderValid }));
            }
            // TODO: what if it fails?
        }

        return {
            ...state,
            updateSettings,
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

        const isACFolderValid = await validateACFolder(settings);

        setState({
            loading: false,
            settings,
            leagues,
            isACFolderValid,
        } as DataContextState);
    }

    /**
     * Validates that the Assetto Corsa folder in the settings given exists and
     * is, indeed, an Assetto Corsa root folder.
     * @param settings The settings to check.
     */
    async function validateACFolder (settings: UserSettings) {
        if (!settings.assettoCorsaFolder || settings.assettoCorsaFolder === "") {
            return false;
        }
        else if (await isFolderAssettoCorsa(settings.assettoCorsaFolder) === false) {
            return false;
        }
        else {
            return true;
        }
    }
}