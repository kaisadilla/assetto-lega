import { useDataContext } from 'context/useDataContext';
import { AcTrack, League, LeagueCalendarEntry } from 'data/schemas';
import React, { useEffect, useState } from 'react';
import LeagueMenu from 'components/LeagueMenu';
import { FILE_PROTOCOL } from 'data/files';
import { AssetFolder } from 'data/assets';
import BackgroundDiv from 'elements/BackgroundDiv';
import AssetImage from 'elements/AssetImage';
import FlagImage from 'elements/images/FlagImage';
import { getClassString, timeNumberToString, timeStringToNumber } from 'utils';
import { useAcContext } from 'context/useAcContext';
import TrackThumbnailField from 'components/TrackThumbnailField';
import { TrackPickerValue } from 'components/TrackPicker';
import CircularSlider from '@fseehawer/react-circular-slider';
import Slider from 'elements/Slider';
import LabeledControl from 'elements/LabeledControl';
import Checkbox from 'elements/Checkbox';
import HourSlider from 'components/HourSlider';
import DropdownField from 'elements/DropdownField';

enum Section {
    League,
    Track,
    Driver,
    RaceInfo,
}

enum TrackCondition {
    Auto,
    Dusty, // 86%
    Old, // 89%
    Green, // 95%
    Slow, // 96%
    Fast, // 98%
    Optimal, // 100%
}

enum QualifyingMode {
    timeAttack,
}

enum JumpStartPenalty {
    None,
    DriveThrough,
    SentToPits,
}

interface TrackSettings {
    track: AcTrack | null;
    layout: string | null;
    //hasPractice: boolean;
    //practiceLength: number;
    //hasQualifying: boolean;
    //qualifyingMode: QualifyingMode;
    //qualifyingLength: number;
    //raceLaps: number;
    //arePenaltiesEnabled: boolean;
    //jumpStartPenalty: JumpStartPenalty;
    startTime: number;
    timeMultiplier: number;
    randomTime: boolean;
    trackCondition: TrackCondition;
    ambientTemperature: number;
    roadTemperature: number;
    windSpeedMin: number;
    windSpeedMax: number;
    direction: number; // in degrees (0-360).
}

export interface FreeSessionPageProps {

}

function FreeSessionPage (props: FreeSessionPageProps) {
    const [section, setSection] = useState(Section.League);

    const [league, setLeague] = useState<League | null>(null);
    const [trackSettings, setTrackSettings] = useState<TrackSettings>(
        loadTrackSettings(),
    )

    return (
        <div className="free-session-page">
            <_LeagueSection
                expanded={section === Section.League}
                selectedLeague={league}
                onSelectLeague={handleSelectLeague}
                onExpand={() => handleExpandSection(Section.League)}
            />
            <_TrackSection
                expanded={section === Section.Track}
                league={league}
                trackSettings={trackSettings}
                onChange={setTrackSettings}
                onExpand={() => handleExpandSection(Section.Track)}
            />
        </div>
    );

    function handleExpandSection (section: Section) {
        setSection(section);
    }

    function handleSelectLeague (league: League) {
        setLeague(league);
        setSection(Section.Track);
    }
}

interface _LeagueSectionProps {
    expanded: boolean;
    selectedLeague: League | null;
    onSelectLeague: (league: League) => void;
    onExpand: () => void;
}

function _LeagueSection ({
    expanded,
    selectedLeague,
    onSelectLeague,
    onExpand,
}: _LeagueSectionProps) {
    const { leagues, leaguesById } = useDataContext();

    if (expanded === false) {
        const leagueName = selectedLeague
            ? `${selectedLeague.series} > ${selectedLeague?.displayName ?? selectedLeague.year}`
            : "No league selected";

        return (
            <div
                className="section collapsed league-section-collapsed"
                onClick={() => onExpand()}
            >
                {selectedLeague && <AssetImage
                    className="league-icon"
                    folder={AssetFolder.leagueLogos}
                    imageName={selectedLeague.logo}
                />}
                <div className="league-name">{leagueName}</div>
            </div>
        )
    }

    return (
        <div className="section expanded league-section-expanded">
            <LeagueMenu
                leagues={leagues}
                onSelect={l => onSelectLeague(leaguesById[l])}
                selectedLeague={selectedLeague?.internalName}
            />
        </div>
    );
}

interface _TrackSectionProps {
    expanded: boolean;
    league: League | null;
    trackSettings: TrackSettings;
    onChange: (trackSettings: TrackSettings) => void;
    onExpand: () => void;
}

function _TrackSection ({
    expanded,
    league,
    trackSettings,
    onChange,
    onExpand,
}: _TrackSectionProps) {

    const { tracks } = useAcContext();

    const track = trackSettings.track;
    const layout = track?.layoutsById[trackSettings.layout ?? ""];

    if (league === null) {
        return (
            <div className="section collapsed section-not-available">
                Track
            </div>
        )
    }

    if (expanded === false) {
        return (
            <div
                className="section collapsed track-section-collapsed"
                onClick={() => onExpand()}
            >
                track!
            </div>
        )
    }

    return (
        <BackgroundDiv
            className="section expanded track-section-expanded"
            folder={AssetFolder.leagueBackgrounds}
            imageName={league?.background ?? ""}
            opacity={0.15}
        >
            <div className="event-section">
                <h2>Preset events</h2>
                <div className="event-container">
                    {league.calendar.map(e => <_TrackSectionEvent
                        key={e.internalName}
                        entry={e}
                        selected={e.track === trackSettings.track?.folderName}
                        onSelect={() => handleSelectEvent(e)}
                    />)}
                </div>
            </div>
            <div className="customize-section">
                <h2>Race details</h2>
                <div className="section-content">
                    <TrackThumbnailField
                        className="track-thumbnail"
                        track={track}
                        layout={layout}
                        onTrackChange={handleTrackChange}
                    />
                    <div className="time-section">
                        <h3>Time</h3>
                        <LabeledControl label="Random time">
                            <Checkbox
                                value={trackSettings.randomTime}
                                onChange={
                                    v => handleFieldChange('randomTime', v)
                                }
                            />
                        </LabeledControl>
                        <LabeledControl label="Start time">
                            <HourSlider
                                value={trackSettings.startTime}
                                onValueChange={
                                    v => handleFieldChange('startTime', v)
                                }
                                readonly={trackSettings.randomTime}
                            />
                        </LabeledControl>
                        <LabeledControl label="Time scale">
                            <Slider
                                mode='thumb'
                                className="time-scale-slider"
                                value={trackSettings.timeMultiplier}
                                onChange={
                                    v => handleFieldChange('timeMultiplier', v)
                                }
                                min={0}
                                max={100}
                                step={1}
                                showNumberBox
                                showFillTrack
                                markCount={10}
                            />
                        </LabeledControl>
                    </div>
                    <div className="conditions-section">
                        <h3>Atmospheric conditions</h3>
                        <LabeledControl label="Weather">
                            <DropdownField
                                items={[{displayName: "Clear", value: "Clear"}]}
                                selectedItem="Clear"
                            />
                        </LabeledControl>
                    </div>
                </div>
            </div>
        </BackgroundDiv>
    );

    function handleSelectEvent (event: LeagueCalendarEntry) {
        const track = tracks.tracksById[event.track];
        const layout = track.layoutsById[event.layout];

        onChange({
            ...trackSettings,
            track: track,
            layout: layout.folderName,
            startTime: timeStringToNumber(event.raceStartHour) ?? trackSettings.startTime,
        })
    }

    function handleTrackChange (values: TrackPickerValue) {
        if (values.track === undefined || values.layout === undefined) return;
        const track = tracks.tracksById[values.track];
        //const layout = track.layoutsById[values.layout];

        onChange({
            ...trackSettings,
            track,
            layout: values.layout,
        })
    }

    function handleFieldChange (field: keyof TrackSettings, value: any) {
        onChange({
            ...trackSettings,
            [field]: value,
        })
    }
}

interface _TrackSectionEventProps {
    entry: LeagueCalendarEntry;
    selected: boolean;
    onSelect: () => void;
}

function _TrackSectionEvent ({
    entry,
    selected,
    onSelect,
}: _TrackSectionEventProps) {
    const { tracks } = useAcContext();
    
    const track = tracks.tracksById[entry.track];
    const layout = track.layoutsById[entry.layout];

    return (
        <div
            className={getClassString("event-entry", selected && "selected")}
            onClick={() => onSelect()}
        >
            <div className="outline-section">
                <img src={FILE_PROTOCOL + layout.outlinePath} />
            </div>
            <div className="info-section">
                <div className="event-title">
                    <div className="event-flag">
                        <FlagImage country={entry.country} />
                    </div>
                    <div className="event-name">
                        {entry.name}
                    </div>
                </div>
                <div className="track-name">
                    {layout.ui.name}
                </div>
            </div>
        </div>
    );
}

/**
 * Loads track settings to use.
 */
function loadTrackSettings () : TrackSettings {
    return {
        track: null,
        layout: null,
        startTime: 0.5,
        timeMultiplier: 1.0,
        randomTime: false,
        trackCondition: TrackCondition.Auto,
        ambientTemperature: 26.0,
        roadTemperature: 36.7,
        windSpeedMin: 0,
        windSpeedMax: 0,
        direction: 0,
    }
}


export default FreeSessionPage;