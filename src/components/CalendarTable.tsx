import { useAcContext } from 'context/useAcContext';
import { useSettingsContext } from 'context/useSettings';
import { Countries } from 'data/countries';
import { AcTrackCollection, LeagueCalendarEntry } from 'data/schemas';
import Img from 'elements/Img';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';
import { dateToDisplayName, getClassString } from 'utils';

export interface CalendarTableProps {
    calendar: LeagueCalendarEntry[];
}

function CalendarTable ({
    calendar,
}: CalendarTableProps) {
    const { tracks } = useAcContext();

    return (
        <div className="calendar-table">
            {calendar.map((c, i) => <CalendarEntry
                key={i}
                entry={c}
                tracks={tracks}
            />)}
        </div>
    );
}



interface CalendarEntryProps {
    entry: LeagueCalendarEntry;
    tracks: AcTrackCollection;
}

function CalendarEntry ({
    entry,
    tracks,
}: CalendarEntryProps) {
    const { getThemeAwareClass } = useSettingsContext();
    
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

    const layoutClass = getClassString(
        "layout",
        getThemeAwareClass('white'),
    )

    return (
        <div className="calendar-entry">
            <div className="date">
                {dateToDisplayName(new Date(entry.date ?? ""))}
            </div>
            <div className="country">
                <Img src={countryData?.flag} />
            </div>
            <div className="name">
                {entry.name}
            </div>
            <div className={layoutClass}>
                <Img src={layoutImg} />
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

export default CalendarTable;
