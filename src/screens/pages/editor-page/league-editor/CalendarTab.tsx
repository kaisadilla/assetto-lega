import CalendarTable from 'components/CalendarTable';
import { Countries } from 'data/countries';
import { AcTrackCollection, League, LeagueCalendarEntry } from 'data/schemas';
import Button from 'elements/Button';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';
import { dateToDisplayName } from 'utils';
import CalendarEditionTable from './CalendarEditionTable';

enum TabMode {
    View,
    Edit,
}

export interface CalendarTabProps {
    league: League;
}

function CalendarTab ({
    league,
}: CalendarTabProps) {
    const [mode, setMode] = useState(TabMode.View);

    return (
        <div className="editor-tab calendar-tab">
            {mode === TabMode.View && <CalendarViewModePanel
                calendar={league.calendar}
                onEdit={handleEdit}
            />}
            {mode === TabMode.Edit && <CalendarEditModePanel
                calendar={league.calendar}
                onEdit={() => {}}
            />}
        </div>
    );

    function handleEdit () {
        setMode(TabMode.Edit);
    }
}

interface CalendarViewModePanelProps {
    calendar: LeagueCalendarEntry[];
    onEdit: () => void;
}

function CalendarViewModePanel ({
    calendar,
    onEdit,
}: CalendarViewModePanelProps) {
    const entryCount = calendar.length;

    return (
        <div className="calendar-tab-view">
            <div className="calendar-table-container">
                <CalendarTable
                    calendar={calendar}
                />
            </div>
            <div className="status-bar">
                <div className="teams-datum">{entryCount} calendar entries</div>
                <div className="tools">
                    <Button onClick={onEdit} highlighted>
                        Edit calendar
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface CalendarEditModePanelProps {
    calendar: LeagueCalendarEntry[];
    onEdit: () => void;
}

function CalendarEditModePanel ({
    calendar,
    onEdit,
}: CalendarEditModePanelProps) {

    return (
        <div className="calendar-tab-edit">
            <CalendarEditionTable
                calendar={calendar}
            />
        </div>
    );
}



export default CalendarTab;
