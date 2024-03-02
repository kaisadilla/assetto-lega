import { Data } from "../userdata";
import { HANDLER_AC_GET_CAR_DATA, HANDLER_AC_GET_CAR_BRAND_LIST, HANDLER_AC_GET_CAR, HANDLER_AC_GET_CAR_LIST, HANDLER_AC_LOAD_DATA, HANDLER_AC_SET_PATH, HANDLER_DATA_LOAD_LEAGUES, HANDLER_DATA_LOAD_SETTINGS, HANDLER_DATA_SAVE_LEAGUE, HANDLER_DATA_SAVE_SETTINGS, HANDLER_FILES_OPEN_DIRECTORY, HANDLER_FILES_SCAN_DIRECTORY, HANDLER_FILES_UPLOAD, HANDLER_FILES_VERIFY_PATH, HANDLER_FILES_VERIFY_PATHS, HANDLER_GET_DATA_PATH, HANDLER_AC_GET_TRACK, HANDLER_AC_GET_TRACK_LIST, HANDLER_AC_GET_TRACK_DATA, HANDLER_AC_INITIALIZE_RENDER_STEP } from "./ipcNames";
import { dialog } from "electron";
import fsAsync from "fs/promises";
import fs from "fs";
import { AcCarCollection, AcCarBrand, AcCar, League, UserSettings, AcTrackCollection, AcTrack } from "data/schemas";
import { AssetFolder } from "data/assets";
import { AssettoCorsa } from "../assettoCorsa/acFolder";
import Cars, { loadAcCarCollection } from "../assettoCorsa/cars";
import Tracks, { initializeTracks, loadAcTrackCollection } from "../assettoCorsa/tracks";

interface UploadFilesArgs {
    format: Electron.FileFilter[],
    directory: AssetFolder,
}

interface SaveLeagueArgs {
    /**
     * The name of the ORIGINAL file being edited (even if the league's internal
     * name has been changed); or `null` if the league is new.
     */
    originalInternalName: string | null;
    league: League;
}

export function createIpcHandlers (ipcMain: Electron.IpcMain) {
    // User data
    ipcMain.handle(HANDLER_GET_DATA_PATH, (evt, arg) => {
        return Data.getDataFolderPath();
    });

    ipcMain.handle(HANDLER_DATA_LOAD_SETTINGS, async (evt, arg) => {
        return await Data.loadSettings();
    });

    ipcMain.handle(HANDLER_DATA_LOAD_LEAGUES, async (evt, arg) => {
        return await Data.loadLeagues();
    });

    ipcMain.handle(HANDLER_DATA_SAVE_SETTINGS, async (
        evt, settings: UserSettings
    ) => {
        return await Data.saveSettings(settings);
    });

    ipcMain.handle(HANDLER_DATA_SAVE_LEAGUE, async (
        evt, {originalInternalName, league}: SaveLeagueArgs
    ) => {
        Data.saveLeague(originalInternalName, league);
    })

    // Files and folders
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

    ipcMain.handle(HANDLER_FILES_SCAN_DIRECTORY, async (evt, folderPath: string) => {
        const files = await Data.scanFilesInDirectory(folderPath);
        return files;
    });

    ipcMain.handle(HANDLER_FILES_UPLOAD, async (
        evt, {format, directory}: UploadFilesArgs
    ) : Promise<string | null> =>
    {
        return await Data.uploadFile(format, directory);
    });

    // Assetto corsa's folder
    ipcMain.handle(HANDLER_AC_SET_PATH, async (evt, folderPath: string) => {
        AssettoCorsa.acPath = folderPath;
    });

    ipcMain.handle(HANDLER_AC_LOAD_DATA, async (evt, arg)
        : Promise<boolean> =>
    {
        await loadAcCarCollection();
        await loadAcTrackCollection();
        return true;
    });

    ipcMain.handle(HANDLER_AC_GET_CAR_DATA, (evt, arg)
        : AcCarCollection =>
    {
        return Cars;
    });

    ipcMain.handle(HANDLER_AC_GET_CAR_LIST, (evt, arg)
        : AcCar[] =>
    {
        return Cars.carList;
    });

    ipcMain.handle(HANDLER_AC_GET_CAR, (evt, folderName: string)
        : AcCar | null =>
    {
        return Cars.carsById[folderName] ?? null;
    });

    ipcMain.handle(HANDLER_AC_GET_CAR_BRAND_LIST, (evt, arg)
        : AcCarBrand[] =>
    {
        return Cars.brands;
    });

    ipcMain.handle(HANDLER_AC_GET_TRACK_DATA, (evt, arg)
        : AcTrackCollection =>
    {
        return Tracks;
    });

    ipcMain.handle(HANDLER_AC_GET_TRACK_LIST, (evt, arg)
        : AcTrack[] =>
    {
        return Tracks.trackList;
    });

    ipcMain.handle(HANDLER_AC_GET_TRACK, (evt, folderName: string)
        : AcTrack | null =>
    {
        return Tracks.tracksById[folderName] ?? null;
    });

    //ipcMain.handle(HANDLER_AC_INITIALIZE_RENDER_STEP, (evt, args: {
    //    
    //})
    //    : AcTrack | null =>
    //{
    //    return initializeTracks();
    //});
}