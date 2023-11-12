import { Data } from "../userdata";
import { HANDLER_DATA_LOAD_LEAGUES } from "./ipcNames";

export function createIpcHandlers (ipcMain: Electron.IpcMain) {
    ipcMain.handle(HANDLER_DATA_LOAD_LEAGUES, async (evt, arg) => {
        return await Data.loadLeagues();
    });
}