import { League, LeagueDriver, LeagueTeam, getLeagueDrivers } from 'data/schemas';
import React, { useEffect, useState } from 'react';
import { DriverSettings, RaceSettings, TrackSettings } from './FreeSessionPage';
import BackgroundDiv from 'elements/BackgroundDiv';
import { AssetFolder } from 'data/assets';
import { deleteArrayItem, getClassString } from 'utils';
import Checkbox from 'elements/Checkbox';
import AssetImage from 'elements/AssetImage';
import FlagImage from 'elements/images/FlagImage';
import LabeledCheckbox from 'elements/LabeledCheckbox';

export interface FreeSession_RaceInfoPanelProps {
    expanded: boolean;
    canBeExpanded: boolean;
    league: League | null;
    trackSettings: TrackSettings;
    driverSettings: DriverSettings;
    raceSettings: RaceSettings;
    onChange: (raceSettings: RaceSettings) => void;
    onExpand: () => void;
    onContinue: () => void;
}

function FreeSession_RaceInfoPanel ({
    expanded,
    canBeExpanded,
    league,
    trackSettings,
    driverSettings,
    raceSettings,
    onChange,
    onExpand,
    onContinue,
}: FreeSession_RaceInfoPanelProps) {
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        if (expanded) {
            setShowInfo(true);
        }
        else if (canBeExpanded === false) {
            setShowInfo(false);
        }
    }, [expanded, canBeExpanded]);

    if (canBeExpanded === false) {
        return (
            <div className="section collapsed section-not-available">
                Race info
            </div>
        )
    }

    if (expanded === false) {
        if (showInfo === false) {
            return <div
                className="section collapsed section-not-yet-opened"
                onClick={() => onExpand()}
            >
                Race info
            </div>
        }
        else {
            return <_CollapsedSection
                onExpand={onExpand}
            />
        }
    }

    return (
        <BackgroundDiv
            className="section expanded race-section-expanded"
            folder={AssetFolder.leagueBackgrounds}
            imageName={league?.background ?? ""}
            opacity={0.15}
        >
            <div className="driver-list-section">
                <h2 className="header">Driver entries</h2>
                <_DriverListSection
                    teams={league!.teams}
                    playerDriverId={driverSettings.selectedDriver!.internalName}
                    raceEntries={raceSettings.driverEntries}
                    onChange={v => handleFieldChange('driverEntries', v)}
                />
            </div>
            <div className="sessions-section">
                <LabeledCheckbox
                    label="Free practice"
                    value={raceSettings.hasPractice}
                    onChange={b => handleFieldChange('hasPractice', b)}
                />
                <h2 className="header">Free practice</h2>
                <h2 className="header">Qualifying</h2>
            </div>
            <div className="race-settings-section">
                <h2 className="header">Race settings</h2>
            </div>
        </BackgroundDiv>
    );

    function handleFieldChange (field: keyof RaceSettings, value: any) {
        onChange({
            ...raceSettings,
            [field]: value,
        });
    }
}

interface _CollapsedSectionProps {
    onExpand: () => void;
}

function _CollapsedSection ({
    onExpand,
}: _CollapsedSectionProps) {
    return (
        <div
            className="section collapsed driver-section-collapsed"
            onClick={() => onExpand()}
        >
            (ALL THE EXPANDED DATA)
        </div>
    )
}

interface _DriverListSectionProps {
    teams: LeagueTeam[];
    playerDriverId: string;
    raceEntries: string[] | null;
    onChange: (raceEntries: string[]) => void;
}

function _DriverListSection ({
    teams,
    playerDriverId,
    raceEntries,
    onChange,
}: _DriverListSectionProps) {
    const driverList = getLeagueDrivers(teams);

    if (raceEntries === null) {
        onChange(driverList
            .filter(d => d.isReserveDriver === false || d.internalName === playerDriverId)
            .map(d => d.internalName)
        );
    }

    if (raceEntries === null) {
        return <div></div>;
    }

    return (
        <div className="driver-list">
            {driverList.map(d => <_DriverListEntry
                driver={d}
                teams={teams}
                isPlayer={d.internalName === playerDriverId}
                enabled={raceEntries!.includes(d.internalName)}
                onEnable={b => handleDriverEnable(d.internalName, b)}
            />)}
        </div>
    );

    function handleDriverEnable (id: string, enabled: boolean) {
        if (raceEntries!.includes(id) && enabled === false) {
            const update = [...raceEntries!];
            deleteArrayItem(update, id);

            onChange(update);
        }
        else if (raceEntries!.includes(id) === false && enabled) {
            onChange([...raceEntries!, id]);
        }
    }
}

interface _DriverListEntryProps {
    driver: LeagueDriver;
    teams: LeagueTeam[];
    isPlayer: boolean;
    enabled: boolean;
    onEnable: (enabled: boolean) => void;
}

function _DriverListEntry ({
    driver,
    teams,
    isPlayer,
    enabled,
    onEnable,
}: _DriverListEntryProps) {
    const team = teams.find(t => t.internalName === driver.team);

    if (team === undefined) {
        throw `Team with id ${driver.team} doesn't exist.`;
    }

    const classStr = getClassString(
        "driver-list-entry",
        enabled === false && "disabled",
    )

    return (
        <div className={classStr}>
            <div className="checkbox-container">
                <Checkbox
                    value={enabled}
                    checkboxColor={team.color}
                    onChange={onEnable}
                />
            </div>
            <div className="team-logo-container">
                <AssetImage folder={AssetFolder.teamBadges} imageName={team.badge} />
            </div>
            <div className="number-container">
                <div>{driver.number}</div>
            </div>
            <div className="flag-container">
                <FlagImage country={driver.country} />
            </div>
            <div className="name-container">
                {driver.name}
            </div>
        </div>
    );
}



export default FreeSession_RaceInfoPanel;
