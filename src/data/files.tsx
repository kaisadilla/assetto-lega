/*
 * This source file is intended to be available in both processes (main and
 * renderer) and, as such, must not contain any method that interacts with the
 * file system, or other actions reserved for only one process.
 */

import { AssetFolder, Assets } from "./assets";

export const FileTypes = {
    images: {
        name: "Images",
        extensions: ["png", "jpg", "jpeg", "webp"]
    },
}

export const Files = {
    /**
     * Returns the absolute RESOURCE path where the given file (folder and name within
     * the folder) is expected to be. For example, the file "@aaa.png" in the folder
     * "img/league-bg" is expected to be in
     * "asset://[unit]/Users/[user name]/AppData/roaming/assetto-lega/img/league-bg/aaa.png"
     * @param dataPath The user data folder.
     * @param folder The folder where the file is located.
     * @param name The name of the file, as specified in the json data container
     * (i.e. including flags such as '@').
     */
    getFilePath (dataPath: string, folder: AssetFolder, name: string) : string {
        let isLegaAsset = false;

        // it's a default resource bundled with the program.
        if (name.charAt(0) === '@') {
            isLegaAsset = true;
        }
    
        if (isLegaAsset) {
            if (Assets[folder]?.[name] === undefined) {
                throw `Asset '${name}' does not exist inside '${folder}'. ` +
                    "As files searched in the assets folder are controlled by " +
                    "the program, this should never happen.";
            }

            return Assets[folder][name];
        }
        else {
            return "asset://" + dataPath + "/" + folder + "/" + name;
        }
    }
    
}