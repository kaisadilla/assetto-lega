import { saveAs } from "file-saver";

export interface ConditionalClass {
    [className: string]: boolean;
}

/**
 * Generates the className string from the arguments given.
 * Two types of arguments can be passed:
 ** A string, which will be added to the class names.
 ** An array containing a string and a boolean. The string will be added as
 * a class name only if the boolean given is true.
 * @param params 
 * @returns 
 */
export function getClassString (
    ...params: (string | boolean | [string, boolean | undefined] | undefined)[]
) : string
{
    let str = "";

    for (const classEntry of params) {
        if (classEntry === undefined) {
            continue;
        }
        if (classEntry === false) {
            continue;
        }
        // if the entry is conditional.
        if (Array.isArray(classEntry)) {
            if (classEntry[1]) {
                str += classEntry[0] + " ";
            }
        }
        else {
            str += classEntry + " ";
        }
    }

    return str.trim();
}

export function getRandomHexColor (useHashtag: boolean = true) : string {
    const col = Math.floor(Math.random() * 16_777_215)
        .toString(16).padStart(6, "0");

    return useHashtag ? "#" + col : col;
}

export function addMinutes (date: Date, minutes: number) : Date {
    return new Date(date.getTime() + minutes * 60_000);
}

export function formatDateString (dateStr: string) : string {
    const localDate = new Date(dateStr);

    // if the date is invalid, its "correct format" is an empty string.
    if (isNaN(localDate.getTime())) {
        return "";
    }

    // remove
    const agnosticDate = addMinutes(localDate, -localDate.getTimezoneOffset());

    return agnosticDate.toISOString().split("T")[0];
}

export function saveAsFile (fileName: string, content: string) {
    const blob = new Blob([content], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, fileName);
}

export function readTextFile (file: File) : Promise<string | null> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
    
        reader.onload = (evt => {
            const content = evt.target?.result;
            if (content && typeof content === "string") {
                resolve(content);
            }
            else if (content) {
                reject("Content type was not string.");
            }
            else {
                reject("No content was found on the file given.");
            }
        });
    });
}

export function cropString (
    str: string, maxLength: number, ellipsis: boolean = false
) : string
{
    if (str.length <= maxLength) return str;

    str = str.substring(0, maxLength);

    return ellipsis ? str + "..." : str;
}

export function formatNumber (number: number, decimalPlaces: number) {
    return number.toLocaleString("en-US", {
        minimumIntegerDigits: 1,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });
}

export function generateRandomColor () {
    const col = Math.floor(Math.random() * 0xffffff).toString(16);

    return "#" + col;
}