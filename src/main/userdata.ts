import { League } from "data/schemas";
import fs from "fs/promises";

export const USERDATA_FOLDER = "assetto-lega";
export const FOLDER_JSON = "json";
export const FOLDER_LEAGUES = "json/leagues";
export const FOLDER_IMAGES = "img";
export const FOLDER_LEAGUE_LOGOS = "img/league-logos";
export const FOLDER_LEAGUE_BG = "img/league-bg";
export const FOLDER_TEAM_LOGOS = "img/team-logos";

export function verifyUserDataFolder () {
    createDataFolderIfNotExists("");

    createDataFolderIfNotExists(FOLDER_JSON);
    createDataFolderIfNotExists(FOLDER_LEAGUES);

    createDataFolderIfNotExists(FOLDER_IMAGES);
    createDataFolderIfNotExists(FOLDER_LEAGUE_LOGOS);
    createDataFolderIfNotExists(FOLDER_LEAGUE_BG);
    createDataFolderIfNotExists(FOLDER_TEAM_LOGOS);
}

export const Data = {
    async loadLeagues () : Promise<League[]> {
        console.log("Loading userdata > leagues.");
        const leagues: League[] = [];

        const files = await fs.readdir(getDataFolder(FOLDER_LEAGUES));

        for (const f of files) {
            const filePath = getDataFolder(FOLDER_LEAGUES) + "/" + f;
            try {
                const content = await fs.readFile(filePath, "utf-8");
                leagues.push(JSON.parse(content));
            }
            catch (err) {
                console.error(`Couldn't load file '${f}'`, err);
            }
        };
    
        return leagues;
    }
}

/**
 * Returns the complete path to the data folder given.
 * @param folder A folder's name inside the app's data folder.
 */
function getDataFolder (folder: string) {
    const app = require("electron").app;

    return app.getPath("appData") + "/" + USERDATA_FOLDER + "/" + folder;
}

function createDataFolderIfNotExists (folder: string) {
    const fs = require("fs");
    
    const path = getDataFolder(folder);

    if (fs.existsSync(path) === false) {
        fs.mkdirSync(path);
    }
}