import { League, UserSettings } from "data/schemas";
import fsAsync from "fs/promises";
import fs from "fs";
import { app, dialog, nativeImage } from "electron";
import path from "path";
import { AssetFolder } from "data/assets";

export const USERDATA_FOLDER = "assetto-lega";
export const FILE_SETTINGS = "settings.json";
export const FOLDER_JSON = "json";
export const FOLDER_LEAGUES = "json/leagues";
export const FOLDER_IMAGES = "img";
export const FOLDER_LEAGUE_LOGOS = "img/league-logos";
export const FOLDER_LEAGUE_BG = "img/league-bg";
export const FOLDER_TEAM_BADGES = "img/team-badges";
export const FOLDER_TEAM_LOGOS = "img/team-logos";

const TEXT_FORMAT = "utf-8";
const FILE_NOT_EXISTS = "ENOENT";

export async function verifyUserDataFolder () {
    createDataFolderIfNotExists("");

    await checkSettingsFile();

    createDataFolderIfNotExists(FOLDER_JSON);
    createDataFolderIfNotExists(FOLDER_LEAGUES);

    createDataFolderIfNotExists(FOLDER_IMAGES);
    createDataFolderIfNotExists(FOLDER_LEAGUE_LOGOS);
    createDataFolderIfNotExists(FOLDER_LEAGUE_BG);
    createDataFolderIfNotExists(FOLDER_TEAM_BADGES);
    createDataFolderIfNotExists(FOLDER_TEAM_LOGOS);
}

export const Data = {
    /**
     * Returns the complete path to the data folder (the one stored in AppData).
     */
    getDataFolderPath () : string {
        return getDataFolderPath();
    },

    async loadSettings () : Promise<UserSettings> {
        console.info("Loading userdata > settings.");
        const path = getDataFile(FILE_SETTINGS);

        try {
            const file = await fsAsync.readFile(path, TEXT_FORMAT);
            return JSON.parse(file);
        }
        catch (err) {
            console.error("Couldn't read settings file!", err);
            throw err;
        }
    },

    async loadLeagues () : Promise<League[]> {
        console.info("Loading userdata > leagues.");
        const leagues: League[] = [];

        const files = await fsAsync.readdir(getDataFolder(FOLDER_LEAGUES));

        for (const f of files) {
            const filePath = getDataFolder(FOLDER_LEAGUES) + "/" + f;
            try {
                const filename = path.parse(filePath).name;

                const content = await fsAsync.readFile(filePath, TEXT_FORMAT);
                const json: League = JSON.parse(content);
                json.internalName = filename;

                leagues.push(json);
            }
            catch (err) {
                console.error(`Couldn't load file '${f}'`, err);
            }
        };
    
        return leagues;
    },

    async saveSettings (settings: UserSettings) {
        console.info("Saving userdata > settings.");
        const path = getDataFile(FILE_SETTINGS);

        try {
            const content = JSON.stringify(settings, null, 2);
            fsAsync.writeFile(path, content, TEXT_FORMAT);
            return true;
        }
        catch (err) {
            console.error(`Couldn't wrrite file '${path}'`, err);
            return false;
        }
    },

    async loadImage (path: string) {
        const lm = nativeImage.createFromPath("C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks/monza/ui/preview.png");
        return lm.toPNG();
    },

    async scanFilesInDirectory (folderPath: string) {
        const files = await fsAsync.readdir(folderPath);
        return files;
    },

    async uploadFile (filters: Electron.FileFilter[], directory: AssetFolder)
        : Promise<string | null>
    {
        const result = await dialog.showOpenDialog({
            properties: ["openFile"],
            filters: filters
        });

        if (result.canceled === false && result.filePaths.length <= 0) {
            return null;
        }

        try {
            const srcPath = result.filePaths[0];
            const fileName = path.parse(srcPath).base;
            const destPath = getDataFolderPath() + "/" + directory + "/" + fileName;

            // TODO: Handle when image already exists
            await fsAsync.copyFile(srcPath, destPath);
            console.log(`Copied file ${fileName} into ${destPath}.`);

            return fileName;
        }
        catch (err) {
            console.error("Error while uploading file!", err);

            return null;
        }
    }
};

/**
 * Returns the complete path to the data folder (the one stored in AppData).
 */
function getDataFolderPath () {
    return app.getPath("appData") + "/" + USERDATA_FOLDER;
}

/**
 * Returns the complete path to the data folder given.
 * @param folder A folder's name inside the app's data folder.
 */
function getDataFolder (folder: string) {
    return app.getPath("appData") + "/" + USERDATA_FOLDER + "/" + folder;
}

/**
 * Returns the complete path to the file inside the data folder.
 * @param relativePath The path of the file relative to the data folder.
 */
function getDataFile (relativePath: string) {
    return app.getPath("appData") + "/" + USERDATA_FOLDER + "/" + relativePath;
}

function createDataFolderIfNotExists (folder: string) {    
    const path = getDataFolder(folder);

    if (fs.existsSync(path) === false) {
        fs.mkdirSync(path);
    }
}

async function checkSettingsFile () {
    const path = getDataFile(FILE_SETTINGS);

    if (fs.existsSync(path) === false) {
        console.info("Settings file not found. Creating a new one.");
        createSettingsFile();
    }
}

async function createSettingsFile () {
    const path = getDataFile(FILE_SETTINGS);

    const settings: UserSettings = {
        assettoCorsaFolder: null,
    }

    fs.writeFileSync(path, JSON.stringify(settings, null, 2));
}