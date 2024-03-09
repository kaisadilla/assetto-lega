//import { ipcRenderer } from "electron";
import { AssetFolder } from "data/assets";
import { League, UserSettings } from "data/schemas";
import { isFolderAssettoCorsa } from "game/assettoCorsa";
import Ipc from "main/ipc/ipcRenderer";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LOCALE } from "utils";

type LeagueCollection = {[key: string]: League};

export enum AppStatus {
    LoadingData = 0,
    //LocatingAcFolder = 1,
    ReadingAcContent = 1,
    Ready = 2,
}

export interface SuggestionCollections {
    /**
     * An array containing the names of existing series.
     */
    series: string[];
    /**
     * An object where each key contains the name of a series, and each
     * value is the different values for 'eras' within that series.
     */
    eras: {[series: string]: string[]};
    /**
     * An array containing the names of makers.
     */
    makers: string[];
    /**
     * An array containing values for fields within the LeagueTeam object.
     */
    team: {
        /**
         * An array containing values for teams' full names.
         */
        fullNames: string[];
        /**
         * An array containing values for teams' short names.
         */
        shortNames: string[];
        /**
         * An array containing values for teams' constructors names.
         */
        constructorNames: string[];
        /**
         * An array containing values for drivers' names.
         */
        driverNames: string[];
    }
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
    countryTiers: {[country: string]: string};
    isACFolderValid: boolean;
    suggestions: SuggestionCollections;
    readAcContent: () => void;
    getDataFolder: (folder: AssetFolder) => string;
    updateSettings: (settings: UserSettings) => void;
    updateLeague: (internalName: string | null, league: League) => void;
    updateCountryTiers: (tiers: {[country: string]: string}) => void;
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
            const index = leagues.findIndex(
                l => l.internalName === internalName
            );

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

            console.info("Leagues in memory: ", leagues);
        }

        async function updateCountryTiers (tiers: {[country: string]: string}) {
            const saved = Ipc.saveCountryTiers(tiers);

            setState(prevState => ({
                ...prevState,
                countryTiers: tiers,
            }));
            console.info("Country tiers in memory: ", tiers);

            return await saved;
        }

        return {
            ...state,
            updateSettings,
            readAcContent,
            getDataFolder,
            updateLeague,
            updateCountryTiers,
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

        const countryTiers = await Ipc.loadCountryTiers();
        
        const leaguesById = generateLeagueCollection(leagues);

        const isACFolderValid = await validateACFolder(settings);

        const suggestions = _buildSuggestions(leagues);

        setState({
            appStatus: AppStatus.ReadingAcContent,
            dataPath,
            settings,
            leagues,
            leaguesById,
            countryTiers,
            isACFolderValid,
            suggestions,
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

function _buildSuggestions (leagues: League[]) : SuggestionCollections {
    const series = new Set<string>();
    const eras = {} as {[series: string]: Set<string>}
    const makers = new Set<string>();
    const team = {
        fullNames: new Set<string>(),
        shortNames: new Set<string>(),
        constructorNames: new Set<string>(),
        driverNames: new Set<string>(),
    }

    for (const l of leagues) {
        series.add(l.series);

        if (l.makers) makers.add(l.makers);

        if (l.era) {
            if (eras[l.series] === undefined) {
                eras[l.series] = new Set<string>();
            }
    
            eras[l.series].add(l.era);
        }

        for (const t of l.teams) {
            team.fullNames.add(t.name);

            if (t.shortName) team.shortNames.add(t.shortName);
            if (t.constructorName) team.constructorNames.add(t.constructorName);
            
            for (const d of t.drivers) {
                team.driverNames.add(d.name);
            }
        }
    }

    const erasArr = {} as {[series: string]: string[]};

    for (const era of Object.keys(eras)) {
        erasArr[era] = sortArray(Array.from(eras[era]));
    }

    return {
        series: sortArray(Array.from(series)),
        eras: erasArr,
        makers: sortArray(Array.from(makers)),
        team: {
            fullNames: sortArray(Array.from(team.fullNames)),
            shortNames: sortArray(Array.from(team.shortNames)),
            constructorNames: sortArray(Array.from(team.constructorNames)),
            driverNames: sortArray(Array.from(team.driverNames)),
        }
    }

    function sortArray (arr: string[]) {
        return arr.sort((a, b) => a.localeCompare(b, LOCALE));
    }
}