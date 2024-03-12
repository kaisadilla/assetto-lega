import { useDataContext } from 'context/useDataContext';
import { AcTrack, AcTrackCollection, League, LeagueCalendarEntry } from 'data/schemas';
import React, { useEffect, useState } from 'react';
import LeagueMenu from 'components/LeagueMenu';
import { FILE_PROTOCOL, Files } from 'data/files';
import { AssetFolder } from 'data/assets';
import BackgroundDiv from 'elements/BackgroundDiv';
import AssetImage from 'elements/AssetImage';
import FlagImage from 'elements/images/FlagImage';
import Ipc from 'main/ipc/ipcRenderer';

enum Section {
    League,
    Track,
    Driver,
    RaceInfo,
}

export interface FreeSessionPageProps {

}

function FreeSessionPage (props: FreeSessionPageProps) {
    const [section, setSection] = useState(Section.League);

    const [league, setLeague] = useState<League | null>(null);

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
    onExpand: () => void;
}

function _TrackSection ({
    expanded,
    league,
    onExpand,
}: _TrackSectionProps) {

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
            <div className="gp-section">
                <h2>Choose a GP...</h2>
                <div className="gp-container">
                    {league.calendar.map(e => <_TrackSectionGpEntry
                        key={e.internalName}
                        entry={e}
                    />)}
                </div>
            </div>
            <div className="customize-section">
                <h2>...or customize your own race</h2>
            </div>
        </BackgroundDiv>
    );
}

interface _TrackSectionGpEntryProps {
    entry: LeagueCalendarEntry;
}

function _TrackSectionGpEntry ({
    entry
}: _TrackSectionGpEntryProps) {
    const [tracks, setTracks] = useState<AcTrackCollection | null>(null);

    useEffect(() => {
        loadTracks();
    }, []);


    if (tracks === null) {
        return <></>;
    }

    const track = tracks.tracksById[entry.track];
    const layout = track.layoutsById[entry.layout];

    return (
        <div className="gp-entry">
            <div className="outline-section">
                <img src={FILE_PROTOCOL + layout.outlinePath} />
            </div>
            <div className="info-section">
                <div className="gp-title">
                    <div className="gp-flag">
                        <FlagImage country={entry.country} />
                    </div>
                    <div className="gp-name">
                        {entry.name}
                    </div>
                </div>
                <div className="track-name">
                    {layout.ui.name}
                </div>
            </div>
            {/*<div className="gp-flag-container">
                <FlagImage className="gp-flag" country={entry.country} />
            </div>
            <div className="gp-name">
                {entry.name}
            </div>
            <div className="track-outline">
                <img src={FILE_PROTOCOL + layout.outlinePath} />
            </div>
            <div className="track-name">
                {layout.ui.name}
            </div>*/}
        </div>
    );

    async function loadTracks () {
        const _tracks = await Ipc.getTrackData();
        setTracks(_tracks);
    }
}




export default FreeSessionPage;