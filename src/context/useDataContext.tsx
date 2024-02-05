//import { ipcRenderer } from "electron";
import { AssetFolder } from "data/assets";
import { League, UserSettings } from "data/schemas";
import { isFolderAssettoCorsa } from "game/assettoCorsa";
import Ipc from "main/ipc/ipcRenderer";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type LeagueCollection = {[key: string]: League};

const DataContext = createContext({} as DataContextState);
export const useDataContext = () => useContext(DataContext);

interface DataContextState {
    loading: boolean;
    /**
     * The absolute path to the user data folder stored in AppData.
     */
    dataPath: string;
    settings: UserSettings;
    leagues: League[];
    leaguesById: LeagueCollection;
    isACFolderValid: boolean;
    updateSettings: (settings: UserSettings) => void;
    getDataFolder: (folder: AssetFolder) => string;
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

        function getDataFolder (assetFolder: AssetFolder) {
            return state.dataPath + "/" + assetFolder;
        }

        return {
            ...state,
            updateSettings,
            getDataFolder,
        }
    }, [state]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );

    async function readData () {
        const dataPath = await Ipc.getDataFolderPath();
        const settings = await Ipc.loadSettings();
        const leagues = await Ipc.loadLeagues();
        
        const leaguesById: LeagueCollection = {};
        for (const l of leagues) {
            leaguesById[l.internalName] = l;
        }

        const isACFolderValid = await validateACFolder(settings);

        setState({
            loading: false,
            dataPath,
            settings,
            leagues,
            leaguesById,
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