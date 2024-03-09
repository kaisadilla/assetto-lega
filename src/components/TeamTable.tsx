import React, { useEffect, useState } from 'react';
import { Countries } from 'data/countries';
import { loadImage } from 'game/files';
import Icon from 'elements/Icon';
import { useSettingsContext } from 'context/useSettings';
import { AcCar, LeagueTeam, LeagueTeamDriver } from 'data/schemas';

import ukEx from "@assets/flags/united_kingdom.png";
import skinEx from "@assets/skin-icon.png";
import { Files } from 'data/files';
import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { chooseW3CTextColor, getClassString } from 'utils';
import Ipc from 'main/ipc/ipcRenderer';
import { getCarSkinIconFromId } from 'paths';

export interface TeamTableProps {
    teams: LeagueTeam[];
    defaultSpec: string;
}

function TeamTable ({
    teams,
    defaultSpec,
}: TeamTableProps) {
    return (
        <div className="team-table">
            {teams.map((t, i) => <TeamEntry
                key={i}
                team={t}
                defaultSpec={defaultSpec}
            />)}
        </div>
    );
}

interface TeamEntryProps {
    team: LeagueTeam;
    defaultSpec: string;
}

function TeamEntry ({
    team,
    defaultSpec,
}: TeamEntryProps
) {
    const { dataPath } = useDataContext();

    const [car, setCar] = useState<AcCar | null>(null);

    useEffect(() => {
        loadCar();
    }, []);

    const teamInfoStyle = { borderColor: team.color ?? "transparent" };
    const teamColorStyle = { backgroundColor: team.color ?? "transparent" };

    const logoImg = Files.getFilePath(dataPath, AssetFolder.teamLogos, team.logo);
    const countryData = Countries[team.country];
    const badgeImg = Files.getFilePath(dataPath, AssetFolder.teamBadges, team.badge);

    const calcTextColor = chooseW3CTextColor(team.color);

    const classStr = getClassString(
        "team",
        calcTextColor === 'black' && "text-black",
        calcTextColor === 'white' && "text-white",
    )

    return (
        <div className={classStr}>
            <div className="team-info" style={teamInfoStyle}>
                <div className="team-color" style={teamColorStyle} />
                <div className="team-logo">
                    <img src={logoImg} />
                </div>
                <div className="team-flag">
                    <img src={countryData?.flag} />
                </div>
                <div className="team-names-and-badge">
                    <div className="team-names">
                        <div className="team-name">{team.name}</div>
                        {team.constructorName && (
                            <span className="team-constructor">
                                {team.constructorName}
                            </span>
                        )}
                    </div>
                    <img className="team-badge" src={badgeImg} />
                </div>
                <div className="team-car">
                    <div className="team-car-name">
                        <span>{car?.ui.name ?? team.cars[defaultSpec]}</span>
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
                            car={car}
                            defaultSpec={defaultSpec}
                            isSolo={team.drivers.length === 1}
                        />
                    ))
                }
            </div>
        </div>
    );

    async function loadCar () {
        const car = await Ipc.getCar(team.cars[defaultSpec]);
        setCar(car);
    }
}

interface DriverEntryProps {
    team: LeagueTeam;
    driver: LeagueTeamDriver;
    car: AcCar | null;
    defaultSpec: string;
    isSolo: boolean;
}

function DriverEntry ({
    team,
    driver,
    car,
    defaultSpec,
    isSolo,
}: DriverEntryProps
) {
    const bgStyle = { backgroundColor: team.color };

    const countryData = Countries[driver.country];
    if (!countryData) {
        throw `Cannot find country with id '${driver.country}'.`;
    }

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
                <DriverEntryCarSkinCollection
                    driver={driver}
                    car={car}
                    defaultSpec={defaultSpec}
                />
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

export interface DriverEntryCarSkinCollectionProps {
    driver: LeagueTeamDriver;
    car: AcCar | null;
    defaultSpec: string;
}

function DriverEntryCarSkinCollection ({
    driver,
    car,
    defaultSpec,
}: DriverEntryCarSkinCollectionProps) {
    const { settings } = useDataContext();

    if (car === null) return <></>;

    const $skins = driver.skins[defaultSpec]?.map(skin => {
        const classStr = getClassString(
            "skin-icon",
            driver.defaultSkins[defaultSpec] === skin && "default-skin"
        )

        return (
            <img
                key={skin}
                className={classStr}
                src={getCarSkinIconFromId(
                    settings.assettoCorsaFolder!, car.folderName, skin, true
                )}
            />
        );
    }) ?? [];

    return (
        <>
            {$skins}
        </>
    );
}


export default TeamTable;