import { League, LeagueTeam, LeagueTeamDriver, getLeagueDrivers } from "data/schemas";
import { DriverSettings, TrackSettings } from "./FreeSessionPage";
import { useAcContext } from "context/useAcContext";
import { chooseW3CTextColor, getClassString } from "utils";
import AssetImage from "elements/AssetImage";
import { AssetFolder } from "data/assets";
import FlagImage from "elements/images/FlagImage";
import CarThumbnail from "elements/CarThumbnail";
import BackgroundDiv from "elements/BackgroundDiv";
import { Race, StartingGridMode } from "logic/Race";
import SelectableItem from "elements/SelectableItem";
import Img from "elements/Img";
import { FILE_PROTOCOL } from "data/files";
import LabeledCheckbox from "elements/LabeledCheckbox";
import LabeledControl from "elements/LabeledControl";
import CountryField from "components/CountryField";
import Textbox from "elements/Textbox";
import CarSkinThumbnailField from "components/CarSkinThumbnailField";
import Button from "elements/Button";


export interface FreeSession_DriverPanelProps {
    expanded: boolean;
    canBeExpanded: boolean;
    canContinue: boolean;
    league: League | null;
    trackSettings: TrackSettings;
    driverSettings: DriverSettings;
    onChange: (driverSettings: DriverSettings) => void;
    onExpand: () => void;
    onContinue: () => void;
}

function FreeSession_DriverPanel ({
    expanded,
    canBeExpanded,
    canContinue,
    league,
    trackSettings,
    driverSettings,
    onChange,
    onExpand,
    onContinue,
}: FreeSession_DriverPanelProps) {

    if (canBeExpanded === false) {
        return (
            <div className="section collapsed section-not-available">
                Driver
            </div>
        )
    }

    if (expanded === false) {
        if (driverSettings.selectedTeam === null || driverSettings.selectedDriver === null) {
            return (
                <div
                    className="section collapsed section-not-yet-opened"
                    onClick={() => onExpand()}
                >
                    Driver
                </div>
            )
        }
        else {
            const { cars } = useAcContext();

            const team = driverSettings.selectedTeam;
            const driver = driverSettings.selectedDriver;

            const teamCar = cars.carsById[team.cars[league!.specs[0]]];

            const textColor = chooseW3CTextColor(team.color);

            const driverInfoClass = getClassString(
                "driver-info",
                textColor === 'black' && "text-black",
                textColor === 'white' && "text-white",
            );

            const playerIdentity = getPlayerIdentity(driverSettings);

            return (
                <div
                    className="section collapsed driver-section-collapsed"
                    onClick={() => onExpand()}
                >
                    <div className="section-collapsed-title">
                        DRIVER
                    </div>
                    <div className="team-logo" style={{borderColor: team.color}}>
                        <AssetImage folder={AssetFolder.teamLogos} imageName={team.logo} />
                    </div>
                    <div className={driverInfoClass}>
                        <div className="driver-entry" style={{backgroundColor: team.color}}>
                            <div className="driver-number">
                                <div>{playerIdentity.number}</div>
                            </div>
                            <div className="driver-flag-container">
                                <FlagImage country={playerIdentity.country} />
                            </div>
                            <span className="driver-initials">{playerIdentity.initials}</span>
                            <span className="driver-name">{playerIdentity.name}</span>
                        </div>
                        <div className="car-info" style={{backgroundColor: team.color}}>
                            <div className="team-name">
                                {team.name}
                            </div>
                            <div className="car-name">
                                {teamCar.displayName}
                            </div>
                            <div className="team-bop">
                                <div className="team-datum ballast">
                                    <span className="name">ballast </span>
                                    <span className="value">{team.ballast}</span>
                                </div>
                                <div className="team-datum restrictor">
                                    <span className="name">restrictor </span>
                                    <span className="value">{team.restrictor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CarThumbnail
                        className="driver-skin"
                        car={teamCar}
                        carSkin={driverSettings.selectedSkin!}
                        style={{borderColor: team.color}}
                    />
                </div>
            )
        }
    }

    return (
        <BackgroundDiv
            className="section expanded driver-section-expanded"
            folder={AssetFolder.leagueBackgrounds}
            imageName={league?.background ?? ""}
            opacity={0.15}
        >
            <div className="team-section">
                <h2 className="header">Teams</h2>
                <div className="team-container">
                    {league?.teams.map(t => <_DriverSectionTeam
                        key={t.internalName}
                        team={t}
                        spec={league.specs[0]}
                        selectedTeam={driverSettings.selectedTeam}
                        onSelect={() => handleTeamSelection(t)}
                    />)}
                </div>
            </div>
            <div className="driver-section">
                <h2 className="header">Drivers</h2>
                <div className="driver-container">
                    {driverSettings.selectedTeam?.drivers.map(d => <_DriverSectionDriver
                        key={d.internalName}
                        team={driverSettings.selectedTeam!}
                        driver={d}
                        spec={league!.specs[0]}
                        selectedDriver={driverSettings.selectedDriver}
                        onSelect={() => handleDriverSelection(d)}
                    />)}
                </div>
            </div>
            <div className="driver-settings-section">
                <h2 className="header">Driver settings</h2>
                {driverSettings.selectedTeam && driverSettings.selectedDriver && <_DriverSelectionCustomization
                    trackSettings={trackSettings}
                    driverSettings={driverSettings}
                    spec={league!.specs[0]}
                    canContinue={canContinue}
                    onChange={onChange}
                    onContinue={onContinue}
                />}
            </div>
        </BackgroundDiv>
    );

    function handleFieldChange (field: keyof DriverSettings, value: any) {
        onChange({
            ...driverSettings,
            [field]: value,
        });
    }

    function handleTeamSelection (team: LeagueTeam) {
        if (team.internalName === driverSettings.selectedTeam?.internalName) {
            return;
        }
        onChange({
            ...driverSettings,
            selectedTeam: team,
            selectedDriver: null,
        });
    }

    function handleDriverSelection (driver: LeagueTeamDriver) {
        if (driver.internalName === driverSettings.selectedDriver?.internalName) {
            return;
        }
        onChange({
            ...driverSettings,
            selectedDriver: driver,
            selectedSkin: driver.defaultSkins[league!.specs[0]],
        });
    }
}

interface _DriverSectionTeamProps {
    team: LeagueTeam;
    spec: string;
    selectedTeam: LeagueTeam | null;
    onSelect: () => void;
}

function _DriverSectionTeam ({
    team,
    spec,
    selectedTeam,
    onSelect,
}: _DriverSectionTeamProps) {
    const { cars } = useAcContext();

    const teamCar = cars.carsById[team.cars[spec]];

    // TODO: Manage this situation
    if (teamCar === undefined) {
        throw `Car not found.`;
    }

    const textColor = chooseW3CTextColor(team.color);

    const entryClass = getClassString(
        "team-entry",
        textColor === 'black' && "text-black",
        textColor === 'white' && "text-white",
    );

    const style = {
        backgroundColor: team.color,
        borderColor: team.color,
    }

    return (
        <SelectableItem
            className="team-entry-container"
            selectionMode='opacity'
            value={team.internalName}
            selectedValue={selectedTeam?.internalName}
            onClick={() => onSelect()}
        >

        <div className={entryClass} style={style}>
            <div className="team-color" />
            <div className="team-logo">
                <AssetImage folder={AssetFolder.teamLogos} imageName={team.logo} />
            </div>
            <div className="team-data">
                <div className="team-identity">
                    <FlagImage className="flag" country={team.country} />
                    <div className="team-names">
                        <div className="team-name">
                            {team.shortName ?? team.name}
                        </div>
                        <div className="constructor-name">
                            {team.constructorName ?? ""}
                        </div>
                    </div>
                </div>
                <div className="car-data">
                    <div className="team-car">
                        <Img className="team-badge" src={FILE_PROTOCOL + teamCar.badgePath} />
                        <div>{teamCar.ui.name ?? teamCar.folderName}</div>
                    </div>
                    <div className="team-bop">
                        <div className="team-datum ballast">
                            <span className="name">ballast </span>
                            <span className="value">{team.ballast}</span>
                        </div>
                        <div className="team-datum restrictor">
                            <span className="name">restrictor </span>
                            <span className="value">{team.restrictor}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </SelectableItem>
    );
}

interface _DriverSectionDriverProps {
    team: LeagueTeam;
    driver: LeagueTeamDriver;
    spec: string;
    selectedDriver: LeagueTeamDriver | null;
    onSelect: () => void;
}

function _DriverSectionDriver ({
    team,
    driver,
    spec,
    selectedDriver,
    onSelect,
}: _DriverSectionDriverProps) {

    const textColor = chooseW3CTextColor(team.color);

    const entryClass = getClassString(
        "driver-entry",
        textColor === 'black' && "text-black",
        textColor === 'white' && "text-white",
    );

    const style = {
        backgroundColor: team.color,
        borderColor: team.color,
    }

    return (
        <SelectableItem
            className="driver-entry-container"
            selectionMode='opacity'
            value={driver.internalName}
            selectedValue={selectedDriver?.internalName}
            onClick={() => onSelect()}
        >

        <div className={entryClass} style={style}>
            <div className="driver-number">
                <div>{driver.number}</div>
            </div>
            <div className="driver-flag-container">
                <FlagImage country={driver.country} />
            </div>
            <span className="driver-initials">{driver.initials}</span>
            <span className="driver-name">{driver.name}</span>
        </div>

        </SelectableItem>
    );
}

interface _DriverSelectionCustomizationProps {
    trackSettings: TrackSettings;
    driverSettings: DriverSettings;
    spec: string;
    canContinue: boolean;
    onChange: (driverSettings: DriverSettings) => void;
    onContinue: () => void;
}

function _DriverSelectionCustomization ({
    trackSettings,
    driverSettings,
    spec,
    canContinue,
    onChange,
    onContinue,
}: _DriverSelectionCustomizationProps) {
    const countryValue = driverSettings.useDriverIdentity
        ? driverSettings.selectedDriver!.country
        : driverSettings.customDriverCountry;

    const nameValue = driverSettings.useDriverIdentity
        ? driverSettings.selectedDriver!.name
        : driverSettings.customDriverName;

    const numberValue = driverSettings.useDriverIdentity
        ? driverSettings.selectedDriver!.number
        : driverSettings.customDriverNumber;

    const initialsValue = driverSettings.useDriverIdentity
        ? driverSettings.selectedDriver!.initials
        : driverSettings.customDriverInitials;

    return (
        <div className="driver-settings-container">
            <div className="driver-settings-form">
                <LabeledCheckbox
                    label="Use driver's name"
                    value={driverSettings.useDriverIdentity}
                    onChange={v => handleFieldChange('useDriverIdentity', v)}
                />
                <LabeledControl label="Country">
                    <CountryField
                        value={countryValue}
                        readonly={driverSettings.useDriverIdentity}
                        onChange={ctry => handleFieldChange('customDriverCountry', ctry)}
                    />
                </LabeledControl>
                <LabeledControl label="Name">
                    <Textbox
                        value={nameValue}
                        readonly={driverSettings.useDriverIdentity}
                        onChange={str => handleFieldChange('customDriverName', str)}
                    />
                </LabeledControl>
                <LabeledControl label="Number">
                    <Textbox
                        value={numberValue}
                        readonly={driverSettings.useDriverIdentity}
                        onChange={str => handleFieldChange('customDriverNumber', str)}
                    />
                </LabeledControl>
                <LabeledControl label="Initials">
                    <Textbox
                        value={initialsValue}
                        readonly={driverSettings.useDriverIdentity}
                        onChange={str => handleFieldChange('customDriverInitials', str)}
                    />
                </LabeledControl>
                <h3 className="header">Skin</h3>
                <CarSkinThumbnailField
                    className="selected-skin"
                    car={driverSettings.selectedTeam!.cars[spec]}
                    selectedSkin={driverSettings.selectedSkin}
                    availableSkins={driverSettings.selectedDriver!.skins[spec]}
                    onSkinChange={s => handleFieldChange('selectedSkin', s)}
                />
            </div>
            <div className="section-controls">
                <Button
                    highlighted
                    disabled={canContinue === false}
                    onClick={() => onContinue()}
                >
                    Continue
                </Button>
            </div>
        </div>
    );

    function handleFieldChange (field: keyof DriverSettings, value: any) {
        onChange({
            ...driverSettings,
            [field]: value,
        });
    }
}

function getPlayerIdentity (driverSettings: DriverSettings) {
    if (driverSettings.selectedDriver === null) {
        throw `No driver selected.`;
    }

    if (driverSettings.useDriverIdentity) return {
        name: driverSettings.selectedDriver.name,
        number: driverSettings.selectedDriver.number,
        country: driverSettings.selectedDriver.country,
        initials: driverSettings.selectedDriver.initials,
    }
    else return {
        name: driverSettings.customDriverName,
        number: driverSettings.customDriverNumber,
        country: driverSettings.customDriverCountry,
        initials: driverSettings.customDriverInitials,
    }
}

export default FreeSession_DriverPanel;