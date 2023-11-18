import { Data } from "../userdata";
import { HANDLER_DATA_LOAD_LEAGUES, HANDLER_DATA_LOAD_SETTINGS, HANDLER_DATA_SAVE_SETTINGS, HANDLER_FILES_OPEN_DIRECTORY, HANDLER_FILES_VERIFY_PATH, HANDLER_FILES_VERIFY_PATHS } from "./ipcNames";
import { dialog } from "electron";
import fsAsync from "fs/promises";
import fs from "fs";
import { UserSettings } from "data/schemas";

export function createIpcHandlers (ipcMain: Electron.IpcMain) {
    ipcMain.handle(HANDLER_DATA_LOAD_SETTINGS, async (evt, arg) => {
        return await Data.loadSettings();
    });
    ipcMain.handle(HANDLER_DATA_LOAD_LEAGUES, async (evt, arg) => {
        return await Data.loadLeagues();
    });

    ipcMain.handle(HANDLER_DATA_SAVE_SETTINGS, async (evt, settings: UserSettings) => {
        return await Data.saveSettings(settings);
    });

    ipcMain.handle(HANDLER_FILES_OPEN_DIRECTORY, async (evt, arg) => {
        const path = await dialog.showOpenDialog({
            properties: ["openDirectory"],
        });

        return path.filePaths ? path.filePaths[0] : "";
    });
    ipcMain.handle(HANDLER_FILES_VERIFY_PATH, async (evt, path: string) => {
        return fs.existsSync(path);
    });
    ipcMain.handle(HANDLER_FILES_VERIFY_PATHS, async (evt, paths: string[]) => {
        let exists = true;

        for (const p of paths) {
            exists = fs.existsSync(p);

            if (exists === false) break;
        }

        return exists;
    });
}