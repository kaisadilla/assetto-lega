import { AcTrackCollection, AcTrackLayout } from "data/schemas";
import { AssettoCorsa } from "./acFolder";
import { LOCALE } from "../mainProcessUtils";

let initialized = false;
const Tracks: AcTrackCollection = {
    trackList: [],
    tracksById: {},
    tags: [],
    presentCountries: [],
};

export async function loadAcTrackCollection () : Promise<number> {
    Tracks.trackList = await AssettoCorsa.getTrackList();
    Tracks.trackList = Tracks.trackList.sort(
        (a, b) => a.displayName.localeCompare(b.displayName, LOCALE)
    );

    // Create other collections derived from the track list.
    const tagSet: Set<string> = new Set();
    Tracks.tracksById = {};

    for (const t of Tracks.trackList) {
        const allLayouts = Object.values(t.layoutsById);

        Tracks.tracksById[t.folderName] = t;

        // add all tags in this track to the tag list.
        for (const layout of allLayouts) {
            for (const tag of layout.ui.tags ?? []) {
                tagSet.add(tag);
            }
        }
    }

    Tracks.tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b, LOCALE));

    return Tracks.trackList.length;
}

// TODO: Implement all this once I figure out how to use webpack in main process.
/**
 * Initializes fields in the Tracks object that require data received from
 * the render process.
 * @param countryMap 
 * @returns 
 */
export function initializeTracks (countryMap: {[assettoName: string]: string}) {
    if (initialized) return;

    buildCountryList(countryMap);

    initialized = true;
}

function buildCountryList (countryMap: {[assettoName: string]: string}) {
    const countrySet = new Set<string>();
    
    for (const t of Tracks.trackList) {
        for (const l of t.layouts) {
            const assettoCountry = l.ui.country;
            if (!assettoCountry) continue;
            
            const legaCountry = countryMap[assettoCountry];

            if (countryMap) {
                countrySet.add(legaCountry);
            }
        }
    }

    Tracks.presentCountries = Array.from(countrySet);
}

export default Tracks;