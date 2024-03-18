import { League, UserSettings, AcCarCollection, AcCar, AcCarBrand, AcTrackCollection, AcTrack, } from "data/schemas";
import { AssetFolder } from "data/assets";
import { HANDLER_AC_GET_CAR_DATA, HANDLER_AC_GET_CAR_BRAND_LIST, HANDLER_AC_GET_CAR, HANDLER_AC_GET_CAR_LIST, HANDLER_AC_LOAD_DATA, HANDLER_AC_SET_PATH, HANDLER_DATA_LOAD_LEAGUES, HANDLER_DATA_LOAD_SETTINGS, HANDLER_DATA_SAVE_LEAGUE, HANDLER_DATA_SAVE_SETTINGS, HANDLER_FILES_OPEN_DIRECTORY, HANDLER_FILES_SCAN_DIRECTORY, HANDLER_FILES_UPLOAD, HANDLER_FILES_VERIFY_PATH, HANDLER_FILES_VERIFY_PATHS, HANDLER_GET_DATA_PATH, HANDLER_AC_GET_TRACK_LIST, HANDLER_AC_GET_TRACK_DATA, HANDLER_AC_GET_TRACK, HANDLER_DATA_LOAD_COUNTRY_TIERS, HANDLER_DATA_SAVE_COUNTRY_TIERS, HANDLER_DATA_OPEN_FOLDER_LEAGUES, HANDLER_ACS_LAUNCH_RACE } from "./ipcNames";
import { RaceIni } from "logic/game/iniSchemas";

const Ipc = {
    async getDataFolderPath () : Promise<string> {
        return await getIpcRenderer().invoke(HANDLER_GET_DATA_PATH);
    },

    async openLeaguesFolder () {
        await getIpcRenderer().invoke(HANDLER_DATA_OPEN_FOLDER_LEAGUES);
    },
    
    async loadSettings () : Promise<UserSettings> {
        return await getIpcRenderer().invoke(HANDLER_DATA_LOAD_SETTINGS);
    },
    async loadLeagues () : Promise<League[]> {
        return await getIpcRenderer().invoke(HANDLER_DATA_LOAD_LEAGUES);
    },
    async loadCountryTiers () : Promise<{[country: string]: string}> {
        return await getIpcRenderer().invoke(HANDLER_DATA_LOAD_COUNTRY_TIERS);
    },

    async saveSettings (settings: UserSettings) : Promise<boolean> {
        return await getIpcRenderer().invoke(HANDLER_DATA_SAVE_SETTINGS, settings);
    },

    /**
     * Saves the given league in the user data's folder.
     * @param originalInternalName The ORIGINAL internal name of the league,
     * even if the league has been renamed.
     * @param league ALL the league's data to save.
     */
    async saveLeague (
        originalInternalName: string | null, league: League
    ) : Promise<League> {
        return await getIpcRenderer().invoke(HANDLER_DATA_SAVE_LEAGUE, {
            originalInternalName,
            league,
        });
    },

    async saveCountryTiers (tiers: {[country: string]: string}) : Promise<boolean> {
        return await getIpcRenderer().invoke(HANDLER_DATA_SAVE_COUNTRY_TIERS, tiers);
    },

    async openDirectory () : Promise<string> {
        return await getIpcRenderer().invoke(HANDLER_FILES_OPEN_DIRECTORY);
    },
    async verifyPath (path: string) : Promise<boolean> {
        return await getIpcRenderer().invoke(HANDLER_FILES_VERIFY_PATH, path);
    },
    async verifyPaths (paths: string[]) : Promise<boolean> {
        return await getIpcRenderer().invoke(HANDLER_FILES_VERIFY_PATHS, paths);
    },

    async scanFilesInDirectory (folderPath: string) : Promise<string[]> {
        return await getIpcRenderer().invoke(HANDLER_FILES_SCAN_DIRECTORY, folderPath);
    },

    async uploadFile (
        format: Electron.FileFilter[] | Electron.FileFilter,
        directory: AssetFolder
    ) : Promise<string | null>
    {
        if (Array.isArray(format) === false) {
            format = [format];
        }
        return await getIpcRenderer().invoke(HANDLER_FILES_UPLOAD, {format, directory});
    },

    async setAssettoCorsaPath (folderPath: string) {
        await getIpcRenderer().invoke(HANDLER_AC_SET_PATH, folderPath);
        
        return true;
    },

    async readAcContent () : Promise<boolean> {
        return await getIpcRenderer().invoke(HANDLER_AC_LOAD_DATA);
    },

    async getCarData () : Promise<AcCarCollection> {
        return await getIpcRenderer().invoke(HANDLER_AC_GET_CAR_DATA);
    },

    async getCarList () : Promise<AcCar[]> {
        return await getIpcRenderer().invoke(HANDLER_AC_GET_CAR_LIST);
    },

    async getCar (folderPath: string) : Promise<AcCar | null> {
        return await getIpcRenderer().invoke(HANDLER_AC_GET_CAR, folderPath);
    },

    async getBrandList () : Promise<AcCarBrand[]> {
        return await getIpcRenderer().invoke(HANDLER_AC_GET_CAR_BRAND_LIST);
    },

    async getTrackData () : Promise<AcTrackCollection> {
        return await getIpcRenderer().invoke(HANDLER_AC_GET_TRACK_DATA);
    },

    async getTrackList () : Promise<AcTrack[]> {
        return await getIpcRenderer().invoke(HANDLER_AC_GET_TRACK_LIST);
    },

    async getTrack (folderPath: string) : Promise<AcTrack | null> {
        return await getIpcRenderer().invoke(HANDLER_AC_GET_TRACK, folderPath);
    },

    async launchRace (raceIni: RaceIni) : Promise<AcTrack | null> {
        return await getIpcRenderer().invoke(HANDLER_ACS_LAUNCH_RACE, {
            raceIni: raceIni
        });
    },
};

function getIpcRenderer () {
    return window.require("electron").ipcRenderer;
}

export default Ipc;