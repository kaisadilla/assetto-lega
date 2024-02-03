/*
 * This source file is intended to be used in the renderer process and, as such,
 * must not contain any method that interacts with the file system, or other
 * actions reserved for the main process.
 */

import { AssetFolder, Assets } from "./assets";

export const Files = {
    /**
     * Returns the absolute RESOURCE path where the given file (folder and name within
     * the folder) is expected to be. For example, the file "@aaa.png" in the folder
     * "img/league-bg" is expected to be in
     * "atom://[unit]/Users/[user name]/AppData/roaming/assetto-lega/img/league-bg/aaa.png"
     * @param userDataPath The user data folder.
     * @param folder The folder where the file is located.
     * @param name The name of the file, as specified in the json data container
     * (i.e. including flags such as '@').
     */
    getFilePath (userDataPath: string, folder: AssetFolder, name: string) : string {
        let isDefaultResource = false;

        // it's a default resource bundled with the program.
        if (name.charAt(0) === '@') {
            isDefaultResource = true;
            name = name.substring(1);
        }
    
        if (isDefaultResource) {
            return folder + "/" + name;
        }
        else {
            return "atom://" + userDataPath + "/" + folder + "/" + name;
        }
    }
    
}