import { AcTrackCollection, AcTrackLayout } from "data/schemas";
import { AssettoCorsa } from "./acFolder";
import { LOCALE } from "../mainProcessUtils";

const Tracks: AcTrackCollection = {
    trackList: [],
    tracksById: {},
    tags: [],
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

export default Tracks;