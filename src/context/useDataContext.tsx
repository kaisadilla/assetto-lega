//import { ipcRenderer } from "electron";
import { AssetFolder } from "data/assets";
import { League, UserSettings } from "data/schemas";
import { isFolderAssettoCorsa } from "game/assettoCorsa";
import Ipc from "main/ipc/ipcRenderer";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type LeagueCollection = {[key: string]: League};

export enum AppStatus {
    LoadingData = 0,
    //LocatingAcFolder = 1,
    ReadingAcContent = 1,
    Ready = 2,
}

const DataContext = createContext({} as DataContextState);
export const useDataContext = () => useContext(DataContext);

interface DataContextState {
    appStatus: AppStatus;
    /**
     * The absolute path to the user data folder stored in AppData.
     */
    dataPath: string;
    settings: UserSettings;
    leagues: League[];
    leaguesById: LeagueCollection;
    isACFolderValid: boolean;
    updateSettings: (settings: UserSettings) => void;
    readAcContent: () => void;
    getDataFolder: (folder: AssetFolder) => string;
    updateLeague: (internalName: string | null, league: League) => void;
}

export const DataContextProvider = ({ children }: any) => {
    const [state, setState] = useState<DataContextState>({
        appStatus: AppStatus.LoadingData,
    } as DataContextState);

    useEffect(() => {
        loadData();
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

        async function readAcContent () {
            await Ipc.readAcContent();
            setState(prev => ({
                ...prev,
                appStatus: AppStatus.Ready,
            }));
        }

        function getDataFolder (assetFolder: AssetFolder) {
            return state.dataPath + "/" + assetFolder;
        }

        /**
         * Updates a league in the program's memory only, following the same
         * rules as the functions to update the disk's file.
         * @param internalName The ORIGINAL internal name of the edited league,
         * even if it has changed in the edition; or `null` if this is a new
         * league.
         * @param league The league's object.
         */
        function updateLeague (internalName: string | null, league: League) {
            const leagues = [...state.leagues];
            let index = -1;
            
            if (internalName) {
                index = leagues.findIndex(
                    l => l.internalName === internalName
                );
            }

            if (index !== -1) {
                leagues[index] = league;
            }
            else {
                leagues.push(league);
            }

            const leaguesById = generateLeagueCollection(leagues);

            setState(prevState => ({
                ...prevState,
                leagues,
                leaguesById,
            }));

            console.log(leagues);
        }

        return {
            ...state,
            updateSettings,
            readAcContent,
            getDataFolder,
            updateLeague,
        }
    }, [state]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );

    async function loadData () {
        const dataPath = await Ipc.getDataFolderPath();
        const settings = await Ipc.loadSettings();
        const leagues = await Ipc.loadLeagues();
        
        const leaguesById = generateLeagueCollection(leagues);

        const isACFolderValid = await validateACFolder(settings);

        setState({
            appStatus: AppStatus.ReadingAcContent,
            dataPath,
            settings,
            leagues,
            leaguesById,
            isACFolderValid,
        } as DataContextState);
    }

    function generateLeagueCollection (leagues: League[]) {
        const leaguesById: LeagueCollection = {};

        for (const l of leagues) {
            leaguesById[l.internalName] = l;
        }
        
        return leaguesById;
    }

    /**
     * Validates that the Assetto Corsa folder in the settings given exists and
     * is, indeed, an Assetto Corsa root folder.
     * If the validation is passed, the AssettoCorsa file is updated with the
     * path stored in the settings.
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
            // Important: set the AC folder for the AC interface file.
            Ipc.setAssettoCorsaPath(settings.assettoCorsaFolder!);

            return true;
        }
    }
}