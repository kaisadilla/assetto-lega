import fsAsync from "fs/promises";
import fs from "fs";

const TEXT_FORMAT = "utf-8";

export const AssettoCorsa = {
    acPath: "",
    async getCarData (folderName: string) : Promise<CarData> {
        const carFolder = this.acPath + "/content/cars/" + folderName;
        const carUiFile = carFolder + "/ui/ui_car.json";
        const carSkinFolder = carFolder + "/skins";

        if (fs.existsSync(carFolder) === false) {
            throw `Folder '${carFolder}' for car '${folderName}' does not exist.`;
        }
        if (fs.existsSync(carUiFile) === false) {
            throw `Car ${folderName} has no './ui/ui_car.json' file.`;
        }

        const ui = await readJsonFile<CarUi>(carUiFile);

        const skinFolders = await fsAsync.readdir(carSkinFolder);
        const skins: {[folderName: string]: CarSkin} = {};

        for (const f of skinFolders) {
            const skinFolder = carSkinFolder + "/" + f;
            const skinUiFile = skinFolder + "/ui_skin.json";

            if (fs.existsSync(skinUiFile) === false) {
                console.error(`Car ${folderName} has no './ui_skin.json' file.`);
            }

            const skinUi = await readJsonFile<CarSkinUi>(skinUiFile);

            skins[f] = {
                folderName: f,
                folderPath: skinFolder,
                ui: skinUi,
            };
        }

        return {
            folderName,
            folderPath: carFolder,
            ui,
            skins,
        }
    },
};

async function readJsonFile<T> (path: string) : Promise<T> {
    const str = await fsAsync.readFile(path, TEXT_FORMAT); // Todo: detect-file-encoding-and-language
    return JSON.parse(str) as T;
}

export interface CarData {
    folderName: string;
    /**
     * The absolute path to the folder containing this car.
     */
    folderPath: string;
    ui: CarUi;
    /**
     * The skins present in this car's folder. Each key corresponds to the name
     * of a folder, and each value holds information about that skin.
     */
    skins: {[folderName: string]: CarSkin};
}

export interface CarUi {
    name?: string;
    brand?: string;
    country?: string;
    year?: number;
    description?: string;
    tags?: string[];
    class?: string;
    specs?: CarUiSpecs;
    torqueCurve?: [number, number][];
    powerCurve?: [number, number][];
    author?: string;
    version?: string;
    url?: string;
}

export interface CarUiSpecs {
    bhp?: string;
    torque?: string;
    weight?: string;
    topspeed?: string;
    acceleration?: string;
    pwratio?: string;
}

export interface CarSkin {
    folderName: string;
    folderPath: string;
    ui: CarSkinUi;
}

export interface CarSkinUi {
    skinname?: string;
    country?: string;
    drivername?: string;
    team?: string;
    number?: string;
    priority?: number;
}