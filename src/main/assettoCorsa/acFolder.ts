import fsAsync from "fs/promises";
import fs from "fs";
import { AcCar, CarSkin, CarSkinUi, CarUi } from "data/schemas";

const TEXT_FORMAT = "utf-8";

export const AssettoCorsa = {
    acPath: "",
    async getCarList () : Promise<AcCar[]> {
        const start = Date.now();

        const carFolder = this.acPath + "/content/cars";
        const carFolders = await fsAsync.readdir(carFolder);

        const cars = [];

        for (const f of carFolders) {
            try {
                const carData = await this.getCar(f);
                cars.push(carData);
            }
            catch (ex) {
                console.error(
                    `An error occurred while trying to load car '${f}'`,
                    ex
                );
            }
        }

        const end = Date.now();
        console.info(`All cars read in ${end - start} ms.`);

        return cars;
    },
    async getCar (folderName: string) : Promise<AcCar> {
        // TODO: Extremely important: fix malformed AC json files.
        const carFolder = this.acPath + "/content/cars/" + folderName;
        const carUiFile = carFolder + "/ui/ui_car.json";
        const carSkinFolder = carFolder + "/skins";

        if (fs.existsSync(carFolder) === false) {
            throw `Folder '${carFolder}' for car '${folderName}' does not exist.`;
        }
        if (fs.existsSync(carUiFile) === false) {
            throw `Car ${folderName} has no './ui/ui_car.json' file.`;
        }

        console.info(`Loading UI json for car '${folderName}'...`);
        const ui = await readJsonFile<CarUi>(carUiFile);

        const skinFolders = await fsAsync.readdir(carSkinFolder);
        const skins: {[folderName: string]: CarSkin} = {};

        for (const f of skinFolders) {
            const skinFolder = carSkinFolder + "/" + f;
            const skinUiFile = skinFolder + "/ui_skin.json";

            if (fs.existsSync(skinUiFile) === false) {
                console.error(`Car ${folderName} has no './ui_skin.json' file.`);
            }

            console.info(`Loading UI json for car skin '${f}'...`);
            let skinUi: CarSkinUi;

            try {
                skinUi = await readJsonFile<CarSkinUi>(skinUiFile);
            }
            catch (ex) {
                console.error(`Couldn't read UI json for car skin '${f}'`, ex);
                continue;
            }

            skins[f] = {
                folderName: f,
                folderPath: skinFolder,
                ui: skinUi,
            };
        }

        if (Object.keys(skins).length === 0) {
            throw `Couldn't find any valid skin for car '${folderName}'.`;
        }

        return {
            folderName,
            folderPath: carFolder,
            ui,
            skins,
        }
    },
};

async function readJsonFile<T extends object> (path: string) : Promise<T> {
    const str = await fsAsync.readFile(path, TEXT_FORMAT); // Todo: detect-file-encoding-and-language

    try {
        return JSON.parse(str) as T;
    }
    catch (ex) {
        console.error(`Couldn't parse json file. Attempting to fix it.`, ex);
        const fixedJson = fixMalformedJson<T>(str);

        if (fixedJson !== null) {
            return fixedJson;
        }
        else {
            throw `Couldn't parse json file.`;
        }
    }
}

function fixMalformedJson<T extends object> (
    content: string
) : T | null {
    // TODO: Replace with a custom parser, this is a temporary workaround.

    // regularize all endings to Linux ones.
    let fixed = content.replaceAll("\r\n", "\n");
    // replace all tab characters with spaces.
    fixed = fixed.replaceAll("\t", " ");
    // remove newlines, without joining them together.
    fixed = fixed.replaceAll("\n", " ");
    let obj: T;

    // try to find occurences of a number literal that has an invalid leading 0.
    // To do this, this regex tries to find expressions of the type `"field": 0xx`,
    // purposefully avoiding `\": 0xx` since a escaped quote would only make sense
    // inside a string literal (although no reason why that should ever happen).
    const zeroLeadingNumbers = fixed.match(/([^\\]"):\s*0[0-9]/g);
    if (zeroLeadingNumbers !== null) {
        console.info(`leading zeroes found: ${zeroLeadingNumbers} in json ${fixed}`);
        for (const expr of zeroLeadingNumbers) {
            // if expr is `r": 05`, this will replace that for `r": 5`, removing
            // the leading 0. This would fix, for example, `"number": 058` to
            // `"number": 58`.
            fixed = fixed.replaceAll(expr, expr[0] + '": ' + expr[expr.length - 1]);
        }
    }

    try {
        // try to parse the new object
        obj = JSON.parse(fixed);
    }
    catch (ex) {
        // if it still can't be parsed, we give up.
        console.error(`Error when trying to fix malformed json.`, content);
        return null;
    }

    // string fields may have been left with multiple spaces as a result of
    // the transformations made to the text file to try to re-parse it. Remove
    // any excess of spaces found in them.
    for (const key in Object.keys(obj)) {
        const val = (obj as any)[key];
        if (typeof val === 'string' || val instanceof String) {
            (obj as any)[key] = val.replaceAll(/\s+/g, " ");
        }
    }

    return obj;
}