import fsAsync from "fs/promises";
import fs from "fs";
import { AcCar, AcCarSkin, CarSkinUi, CarUi, AcTrack, AcTrackLayout, AcTrackUi, AcTrackLayoutCollection } from "data/schemas";
import DetectFileEncodingAndLanguage from "detect-file-encoding-and-language";

const TEXT_FORMAT = "utf-8";

export const AssettoCorsa = {
    acPath: "",

    async getCarList () : Promise<AcCar[]> {
        const start = Date.now();

        const carsRoot = this.acPath + "/content/cars";
        const carFolders = await fsAsync.readdir(carsRoot);

        const cars = [];

        for (const f of carFolders) {
            try {
                const carData = await this.getCar(f);
                cars.push(carData);
            }
            catch (ex) {
                console.error(
                    `An error occurred while trying to load car '${f}'`,
                    ex,
                );
            }
        }

        const end = Date.now();
        console.info(`All cars read in ${end - start} ms.`);

        return cars;
    },

    async getTrackList () : Promise<AcTrack[]> {
        const start = Date.now();

        const tracksRoot = this.acPath + "/content/tracks";
        const trackFolders = await fsAsync.readdir(tracksRoot);

        const tracks = [];

        for (const f of trackFolders) {
            try {
                const trackData = await this.getTrack(f);
                tracks.push(trackData);
            }
            catch (ex) {
                console.error(
                    `An error occurred while trying to load track '${f}'`,
                    ex,
                );
            }
        }

        const end = Date.now();
        console.info(`All tracks read in ${end - start} ms.`);

        return tracks;
    },

    async getCar (folderName: string) : Promise<AcCar> {
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
        const skinsById: {[folderName: string]: AcCarSkin} = {};

        for (const f of skinFolders) {
            const skinFolder = carSkinFolder + "/" + f;
            const skinUiFile = skinFolder + "/ui_skin.json";

            if (fs.existsSync(skinUiFile) === false) {
                console.error(`Car ${folderName} has no './ui_skin.json' file.`);
            }

            console.info(`Loading UI json for car skin '${f}'...`);
            let skinUi: CarSkinUi | null = null;

            try {
                skinUi = await readJsonFile<CarSkinUi>(skinUiFile);
            }
            catch (ex) {
                console.error(`Couldn't read UI json for car skin '${f}'`, ex);
            }

            if (skinUi) {
                skinsById[f] = {
                    folderName: f,
                    folderPath: skinFolder,
                    ui: skinUi,
                };
            }
            else {
                skinsById[f] = {
                    folderName: f,
                    folderPath: skinFolder,
                    ui: {
                        skinname: f,
                    } as CarSkinUi,
                };
            }
        }

        if (Object.keys(skinsById).length === 0) {
            throw `Couldn't find any valid skin for car '${folderName}'.`;
        }

        const skins = Object.values(skinsById).sort((a, b) => {
            const anum = parseInt(a.ui.number ?? "");
            const bnum = parseInt(b.ui.number ?? "");

            if (Number.isNaN(anum)) return 1;
            if (Number.isNaN(bnum)) return -1;

            return anum - bnum;
        });

        return {
            folderName,
            folderPath: carFolder,
            ui,
            skinsById,
            skins,
        }
    },

    async getTrack (folderName: string) : Promise<AcTrack> {
        const folderPath = this.acPath + "/content/tracks/" + folderName;
        const uiFolderPath = folderPath + "/ui";

        if (fs.existsSync(folderPath) === false) {
            throw `Folder '${folderPath}' for track '${folderName}' does not exist.`;
        }

        const uiFolderContent = fs.readdirSync(uiFolderPath, {withFileTypes: true});
        const uiLayoutFolders = uiFolderContent.filter(el => el.isDirectory());

        const hasDefaultLayout = uiFolderContent.find(
            el => el.name === "ui_track.json"
        ) !== undefined;
        const hasExtraLayouts = uiLayoutFolders.length > 0;

        if (hasDefaultLayout === false && hasExtraLayouts === false) {
            throw `Track '${folderName}' has no layouts.`;
        }
        let layouts: AcTrackLayout[] = [];
        let layoutsById: AcTrackLayoutCollection = {};

        const layoutDisplayNames = [];

        if (hasDefaultLayout) {
            const defaultLayout = await buildTrackLayoutObject(uiFolderPath, "");
            layouts.push(defaultLayout);
            layoutsById[""] = defaultLayout;

            if (defaultLayout.ui.name) {
                layoutDisplayNames.push(defaultLayout.ui.name)
            }
        }

        if (hasExtraLayouts) {
            for (const folder of uiLayoutFolders) {
                const layoutPath = uiFolderPath + "/" + folder.name;
                
                const obj = await buildTrackLayoutObject(layoutPath, folder.name);
                layouts.push(obj);
                layoutsById[obj.folderName] = obj;

                if (obj.ui.name) {
                    layoutDisplayNames.push(obj.ui.name)
                }
            }
        }

        const displayName = buildTrackDisplayName(folderName, layoutDisplayNames);

        if (layouts.length === 0) {
            throw `No valid layout was found for track '${folderName}'`
        }

        return {
            folderName: folderName,
            folderPath: folderPath,
            displayName: displayName,
            firstLayoutIsDefault: hasDefaultLayout,
            layouts: layouts,
            layoutsById: layoutsById,
        } as AcTrack;
    }
};

async function buildTrackLayoutObject (folderPath: string, folderName: string) {
    const uiFile = folderPath + "/ui_track.json";
    const ui = await readJsonFile<AcTrackUi>(uiFile);

    return {
        folderName: folderName,
        folderPath: folderPath,
        previewPath: folderPath + "/preview.png",
        outlinePath: folderPath + "/outline.png",
        ui: ui,
    } as AcTrackLayout;
}

function buildTrackDisplayName (folderName: string, layoutNames: string[]) {
    // A regex to find unnecessary characters at the end of a string.
    // Currently matches the characters ` `, `-`, `(`, `|`, `/` and `:`.
    const trimEndRegex = /[-\s\(\|\/\:]+$/g;

    const shortestName = layoutNames.reduce((prev, curr) => {
        return (curr && curr.length < prev.length)
            ? curr
            : prev;
    }, layoutNames[0]);

    let end = 0;
    const shortestLength = shortestName.length;
    
    CharLoop:
    while (end < shortestLength) {
        const refChar = shortestName.charAt(end);

        for (const n of layoutNames) {
            if (n.charAt(end) !== refChar) {
                break CharLoop;
            }
        }

        end++;
    }

    // The common part of the string, trimming unecessary characters at the end.
    let name = shortestName.substring(0, end).replace(trimEndRegex, "");
    // If the selected name is an empty string, use the name of the first layout
    // that has a name. If no layout has names, use the folder's name.
    if (!name) {
        name = layoutNames.find(n => !!n) ?? folderName;
    }

    return name;
}

async function readJsonFile<T extends object> (path: string) : Promise<T> {
    // replace removes UTF-8 with BOM characters.
    const str = fs.readFileSync(path, TEXT_FORMAT).replace(/^\uFEFF/, ""); // Todo: detect-file-encoding-and-language
    //const buffer = await fsAsync.readFile(path);
    //const format = await DetectFileEncodingAndLanguage(buffer);
    //const str = buffer.toString(format.encoding);

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