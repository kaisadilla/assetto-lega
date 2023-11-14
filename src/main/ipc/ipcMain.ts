import { Data } from "../userdata";
import { HANDLER_DATA_LOAD_LEAGUES, HANDLER_DATA_LOAD_SETTINGS } from "./ipcNames";

export function createIpcHandlers (ipcMain: Electron.IpcMain) {
    ipcMain.handle(HANDLER_DATA_LOAD_SETTINGS, async (evt, arg) => {
        return await Data.loadSettings();
    });
    ipcMain.handle(HANDLER_DATA_LOAD_LEAGUES, async (evt, arg) => {
        return await Data.loadLeagues();
    });
}