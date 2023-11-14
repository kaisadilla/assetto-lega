import { League, UserSettings } from "data/schemas";
import { HANDLER_DATA_LOAD_LEAGUES, HANDLER_DATA_LOAD_SETTINGS } from "./ipcNames";

const Ipc = {
    async loadSettings () : Promise<UserSettings> {
        return await getIpcRenderer().invoke(HANDLER_DATA_LOAD_SETTINGS);
    },
    async loadLeagues () : Promise<League[]> {
        return await getIpcRenderer().invoke(HANDLER_DATA_LOAD_LEAGUES);
    },
};

function getIpcRenderer () {
    return window.require("electron").ipcRenderer;
}

export default Ipc;