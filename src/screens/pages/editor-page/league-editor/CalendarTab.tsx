import { Countries } from 'data/countries';
import { AcTrackCollection, League, LeagueCalendarEntry } from 'data/schemas';
import Button from 'elements/Button';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';
import { dateToDisplayName } from 'utils';

export interface CalendarTabProps {
    league: League;
}

function CalendarTab ({
    league,
}: CalendarTabProps) {

    const [tracks, setTracks] = useState<AcTrackCollection | null>(null);

    useEffect(() => {
        loadTracks();
    }, []);

    if (tracks === null) {
        return <div className="editor-tab calendar-tab">Loading...</div>
    }

    const entryCount = league.calendar.length;

    return (
        <div className="editor-tab calendar-tab">
            <div className="calendar-list">
                {league.calendar.map((c, i) => <CalendarEntry
                    key={i}
                    entry={c}
                    tracks={tracks}
                />)}
            </div>
            <div className="status-bar">
                <div className="teams-datum">{entryCount} calendar entries</div>
                <div className="tools">
                    <Button highlighted>
                        Edit teams
                    </Button>
                </div>
            </div>
        </div>
    );

    async function loadTracks () {
        const tracks = await Ipc.getTrackData();
        console.log(tracks.trackList.map(t => t.displayName));
        setTracks(tracks);
    }
}

interface CalendarEntryProps {
    entry: LeagueCalendarEntry;
    tracks: AcTrackCollection;
}

function CalendarEntry ({
    entry,
    tracks,
}: CalendarEntryProps) {
    const countryData = Countries[entry.country];

    const layoutImg = (() => {
        const path = "asset://X:/SteamLibrary/steamapps/common/assettocorsa/content/tracks";
        if (entry.layout) {
            return `${path}/${entry.track}/ui/${entry.layout}/outline.png`;
        }
        else {
            return `${path}/${entry.track}/ui/outline.png`;
        }
    })();

    const track = tracks.tracksById[entry.track];
    // the default track's id is an empty string.
    const trackName = track.layoutsById[entry.layout ?? ""].ui.name ?? track.displayName;

    return (
        <div className="calendar-entry">
            <div className="date">
                {dateToDisplayName(new Date(entry.date))}
            </div>
            <div className="country">
                <img src={countryData?.flag} />
            </div>
            <div className="name">
                {entry.name}
            </div>
            <div className="layout">
                <img src={layoutImg} />
            </div>
            <div className="layout-name">
                {trackName}
            </div>
            <div className="laps">
                {entry.laps} laps
            </div>
            <div className="start-hours">
                <div className="qualifying">
                    <span className="label">Q: </span>
                    <span className="value">{entry.qualifyingStartHour ?? ""}</span>
                </div>
                <div className="race">
                    <span className="label">R: </span>
                    <span className="value">{entry.raceStartHour ?? ""}</span>
                </div>
            </div>
            <div className="selected-weathers">
                &lt; some weathers selected &gt;
            </div>
        </div>
    );
}


export default CalendarTab;
