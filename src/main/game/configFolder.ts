import { RaceIni } from "../../logic/game/iniSchemas";
import Ini from 'ini';
import fsAsync from "fs/promises";
import fs from "fs";
import { app } from "electron";

const AC_ROOT_FOLDER = "Assetto Corsa";
const AC_CFG_FOLDER = "cfg";

export async function setupRace (raceIni: RaceIni) {
    const path = _getAcConfigFolder() + "/" + AC_CFG_FOLDER + "/" + "race.ini";
    const fileContent = Ini.stringify(raceIni);
    fs.writeFileSync(path, fileContent);
}

function _getAcConfigFolder () {
    const docPath = app.getPath('documents');
    return docPath + "/" + AC_ROOT_FOLDER;
}