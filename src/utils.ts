import { MONTHS } from "al_constants";
import { getCountryIdByAssettoName } from "data/countries";
import { AcTrack } from "data/schemas";
import { saveAs } from "file-saver";

export const LOCALE = "en-US";

export type TextColor = 'black' | 'white';

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

/**
 * Filters the elements in the array given with the filter given, using a smart
 * function, and returns a new array with the filtered elements.
 * @param arr The array to filter.
 * @param filter The filter to pass.
 * @param caseSensitive If true, won't ignore character case when filtering.
 */
export function smartFilterArray (
    arr: string[], filter: string, caseSensitive?: boolean
) {
    const regex = __buildSmartFilterRegex(filter, caseSensitive);

    return arr.filter(str => {
        if (!caseSensitive) {
            str = str.toLocaleLowerCase(LOCALE);
        }

        return str.match(regex) !== null
    });
}

export function smartFilterObjectArray<T> (
    arr: T[],
    filter: string,
    fieldSelector: (obj: T) => string,
    caseSensitive?: boolean
) {
    const regex = __buildSmartFilterRegex(filter, caseSensitive);

    return arr.filter(obj => {
        let str = fieldSelector(obj);

        if (!caseSensitive) {
            str = str.toLocaleLowerCase(LOCALE);
        }

        return str.match(regex) !== null;
    });
}

function __buildSmartFilterRegex (filter: string, caseSensitive?: boolean) {
    let regexStr = "";
    if (filter.length < 2) {
        regexStr = filter;
    }
    // build a regex on the form of: C.*C.*C.*C.*C, where C is each character
    // in the filter.
    else {
        for (let i = 0; i < filter.length - 1; i++) {
            regexStr += filter[i] + ".*";
        }
        regexStr += filter[filter.length - 1];
    }

    if (!caseSensitive) {
        // todo: locale stuff.
        regexStr = regexStr.toLocaleLowerCase(LOCALE);
    }

    return new RegExp(regexStr);
}

export function clampNumber (num: number, min: number, max: number) {
    return Math.max(Math.min(num, max), min);
}

export function truncateNumber (num: number, decimalPlaces: number) {
    const multiplier = 10 ** decimalPlaces;
    const numToTrim = num * multiplier;
    const truncated = Math[numToTrim < 0 ? 'ceil' : 'floor'](numToTrim);
    return truncated / multiplier;
}

export function countDecimalPlaces (num: number) {
    if (isInteger(num)) return 0;

    return num.toString().split(".")[1].length || 0;
}

export function isInteger (num: number) {
    return Math.floor(num) === num;
}

export function isStringNullOrEmpty (str: string | null | undefined) {
    return str !== null && str !== undefined && str !== "";
}

/**
 * Given the hex color of a background, calculates whether the color of higher
 * contrast for text in that background is black or white.
 * @param background 
 */
export function chooseW3CTextColor (background: string) : TextColor {
    // Done according to this: https://stackoverflow.com/a/3943023/23342298

    if (background.startsWith("#")) background = background.substring(1, 7);
    if (background.length < 6) throw `'${background}' is not a valid color.`;


    const r = parseInt(background.substring(0, 2), 16);
    const g = parseInt(background.substring(2, 4), 16);
    const b = parseInt(background.substring(4, 6), 16);

    let rVal = calculateVal(r);
    let gVal = calculateVal(g);
    let bVal = calculateVal(b);

    const l = (0.2126 * rVal) + (0.7152 * gVal) + (0.0722 * bVal);

    return l > 0.179 ? 'black' : 'white';

    function calculateVal (c: number) {
        c /= 255;

        if (c < 0.04045) {
            return c / 12.92;
        }
        else {
            return ((c + 0.055) / 1.055) ** 2.4;
        }
    }
}

export function dateToDisplayName (date: Date) {
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

/**
 * Returns an object that contains a key for each country that has, at least,
 * one track. The value of each field is equal to the number of tracks in that
 * country.
 * @param trackList The tracklist to scan.
 */
export function getCountriesWithTracks (
    trackList: AcTrack[]
) : {[name: string]: number} {
    const countries: {[name: string]: number} = {};
    
    for (const t of trackList) {
        const countryId = getCountryIdByAssettoName(t.displayCountry);

        if (countries[countryId]) {
            countries[countryId]++;
        }
        else {
            countries[countryId] = 1;
        }
    }

    return countries;
}

/**
 * Returns true if the value given is null, undefined or is an empty string.
 * @param value 
 * @returns 
 */
export function valueNullOrEmpty<T> (value: T | null | undefined) {
    return value === null || value === undefined || value === "";
}

export function deleteAt<T> (arr: T[], index: number) {
    arr.splice(index, 1);
}