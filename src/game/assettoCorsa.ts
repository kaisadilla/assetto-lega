import Ipc from "main/ipc/ipcRenderer";

/**
 * Returns true if the folder contains the expected Assetto Corsa files
 * and folders.
 */
export async function isFolderAssettoCorsa (folderPath: string) {
    return await Ipc.verifyPaths([
        folderPath + "/acs.exe",
        folderPath + "/apps",
        folderPath + "/content/cars",
        folderPath + "/content/tracks",
    ]);
}