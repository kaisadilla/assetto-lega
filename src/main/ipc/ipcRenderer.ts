import { League } from "data/schemas";
import { HANDLER_DATA_LOAD_LEAGUES } from "./ipcNames";

const Ipc = {
    async loadLeagues () : Promise<League[]> {
        return await getIpcRenderer().invoke(HANDLER_DATA_LOAD_LEAGUES);
    }
};

function getIpcRenderer () {
    return window.require("electron").ipcRenderer;
}

export default Ipc;