import { League, UserSettings } from "data/schemas";
import fsAsync from "fs/promises";
import fs from "fs";
import { app } from "electron";

export const USERDATA_FOLDER = "assetto-lega";
export const FILE_SETTINGS = "settings.json";
export const FOLDER_JSON = "json";
export const FOLDER_LEAGUES = "json/leagues";
export const FOLDER_IMAGES = "img";
export const FOLDER_LEAGUE_LOGOS = "img/league-logos";
export const FOLDER_LEAGUE_BG = "img/league-bg";
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
    createDataFolderIfNotExists(FOLDER_TEAM_LOGOS);
}

export const Data = {
    async loadSettings () : Promise<UserSettings> {
        console.log("Loading userdata > settings.");
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
        console.log("Loading userdata > leagues.");
        const leagues: League[] = [];

        const files = await fsAsync.readdir(getDataFolder(FOLDER_LEAGUES));

        for (const f of files) {
            const filePath = getDataFolder(FOLDER_LEAGUES) + "/" + f;
            try {
                const content = await fsAsync.readFile(filePath, TEXT_FORMAT);
                leagues.push(JSON.parse(content));
            }
            catch (err) {
                console.error(`Couldn't load file '${f}'`, err);
            }
        };
    
        return leagues;
    },
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

    await fs.writeFileSync(path, JSON.stringify(settings, null, 2));
}