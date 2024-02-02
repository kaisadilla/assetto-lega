import { League, UserSettings } from "data/schemas";
import { HANDLER_DATA_LOAD_LEAGUES, HANDLER_DATA_LOAD_SETTINGS, HANDLER_DATA_SAVE_SETTINGS, HANDLER_FILES_OPEN_DIRECTORY, HANDLER_FILES_VERIFY_PATH, HANDLER_FILES_VERIFY_PATHS, HANDLER_GET_DATA_PATH } from "./ipcNames";

const Ipc = {
    async getDataFolderPath () : Promise<string> {
        return await getIpcRenderer().invoke(HANDLER_GET_DATA_PATH);
    },

    async loadSettings () : Promise<UserSettings> {
        return await getIpcRenderer().invoke(HANDLER_DATA_LOAD_SETTINGS);
    },
    async loadLeagues () : Promise<League[]> {
        return await getIpcRenderer().invoke(HANDLER_DATA_LOAD_LEAGUES);
    },

    async saveSettings (settings: UserSettings) : Promise<boolean> {
        return await getIpcRenderer().invoke(HANDLER_DATA_SAVE_SETTINGS, settings);
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
};

function getIpcRenderer () {
    return window.require("electron").ipcRenderer;
}

export default Ipc;