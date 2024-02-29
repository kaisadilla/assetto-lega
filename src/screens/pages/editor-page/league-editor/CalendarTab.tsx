import { Countries } from 'data/countries';
import { League, LeagueCalendarEntry } from 'data/schemas';
import React from 'react';
import { dateToDisplayName } from 'utils';

export interface CalendarTabProps {
    league: League;
}

function CalendarTab ({
    league,
}: CalendarTabProps) {

    return (
        <div className="editor-tab calendar-tab">
            <div className="calendar-list">
                {league.calendar.map((c, i) => <CalendarEntry
                    key={i}
                    entry={c}
                />)}
            </div>
        </div>
    );
}

interface CalendarEntryProps {
    entry: LeagueCalendarEntry
}

function CalendarEntry ({
    entry,
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
                {entry.track} {entry.layout && "(" + entry.layout + ")"}
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
