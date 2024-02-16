import React from 'react';
import { COUNTRIES_ASSETTO_TO_LEGA, Countries } from 'data/countries';
import { loadImage } from 'game/files';
import Icon from 'elements/Icon';
import { useSettingsContext } from 'context/useSettings';
import { LeagueTeam, LeagueTeamDriver } from 'data/schemas';

import ukEx from "@assets/flags/united_kingdom.png";
import skinEx from "@assets/skin-icon.png";
import { Files } from 'data/files';
import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { getClassString } from 'utils';

export interface TeamTableProps {
    teams: LeagueTeam[];
}

function TeamTable ({
    teams,
}: TeamTableProps) {
    return (
        <div>
            {teams.map((t, i) => <TeamEntry key={i} team={t} />)}
        </div>
    );
}

export default TeamTable;


interface TeamEntryProps {
    team: LeagueTeam;
    setTeam?: (t: LeagueTeam) => void;
}

function TeamEntry ({
    team,
    setTeam
}: TeamEntryProps
) {
    const { dataPath } = useDataContext();

    const bgStyle = { backgroundColor: team.color ?? "0xff00ff" };

    const logoImg = Files.getFilePath(dataPath, AssetFolder.teamLogos, team.logo);
    const countryData = Countries[team.country];
    const badgeImg = Files.getFilePath(dataPath, AssetFolder.teamBadges, team.badge);

    return (
        <div className="team text-white">
            <div className="team-info" style={bgStyle}>
                <img className="team-logo" src={logoImg} />
                <img className="team-flag" src={countryData?.flag} />
                <div className="team-name-and-badge">
                    <span className="team-name">{team.name}</span>
                <img className="team-badge" src={badgeImg} />
                </div>
                <div className="team-car">
                    <div className="team-car-name">
                        <span>Formula Hybrid 2023</span>
                    </div>
                    <div className="team-car-stats">
                        <div className="team-stat team-car-ballast">
                            <div className="stat-name">ballast</div>
                            <div className="stat-value">{team.ballast}</div>
                        </div>
                        <div className="team-stat team-car-restrictor">
                            <div className="stat-name">restrictor</div>
                            <div className="stat-value">{team.restrictor}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="driver-list">
                {
                    team.drivers.map((d, i) => (
                        <DriverEntry
                            key={i}
                            team={team}
                            driver={d}
                            isSolo={team.drivers.length === 1}
                        />
                    ))
                }
            </div>
        </div>
    );
}

interface DriverEntryProps {
    team: LeagueTeam;
    driver: LeagueTeamDriver;
    isSolo: boolean;
}

function DriverEntry ({
    team,
    driver,
    isSolo,
}: DriverEntryProps
) {
    const bgStyle = { backgroundColor: team.color };

    const countryData = Countries[driver.country];

    const classStr = getClassString(
        "driver-info",
        isSolo && "solo-driver",
    )

    return (
        <div className={classStr} style={bgStyle}>
            <div className="driver-number">
                <div>{driver.number}</div>
            </div>
            <img className="driver-flag" src={countryData.flag} />
            <span className="driver-initials">{driver.initials}</span>
            <span className="driver-name">{driver.name}</span>
            <div className="skin-icons">
                <img className="skin-icon" src={skinEx} />
                <img className="skin-icon" src={skinEx} />
            </div>
            <div className="driver-stats">
                <div className="team-stat">
                    <div className="stat-name">str</div>
                    <div className="stat-value">{driver.strength}</div>
                </div>
                <div className="team-stat">
                    <div className="stat-name">agr</div>
                    <div className="stat-value">{driver.aggression}</div>
                </div>
            </div>
        </div>
    );
}