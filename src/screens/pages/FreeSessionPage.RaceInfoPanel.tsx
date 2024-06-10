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
import LabeledControl from 'elements/LabeledControl';
import Slider from 'elements/Slider';
import DropdownField from 'elements/DropdownField';
import { CarAid, JumpStartPenalty, StartingGridMode } from 'logic/Race';
import Button from 'elements/Button';
import { useAcContext } from 'context/useAcContext';

export interface FreeSession_RaceInfoPanelProps {
    expanded: boolean;
    canBeExpanded: boolean;
    league: League | null;
    trackSettings: TrackSettings;
    driverSettings: DriverSettings;
    raceSettings: RaceSettings;
    onChange: (raceSettings: RaceSettings) => void;
    onExpand: () => void;
    onStartRace: () => void;
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
    onStartRace,
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

    const driverCount = raceSettings.driverEntries?.length ?? 0;

    return (
        <BackgroundDiv
            className="section expanded race-section-expanded"
            folder={AssetFolder.leagueBackgrounds}
            imageName={league?.background ?? ""}
            opacity={0.15}
        >
            <div className="driver-list-section">
                <h2 className="header">Driver entries ({driverCount})</h2>
                <_DriverListSection
                    teams={league!.teams}
                    playerDriverId={driverSettings.selectedDriver!.internalName}
                    raceEntries={raceSettings.driverEntries}
                    onChange={v => handleFieldChange('driverEntries', v)}
                />
            </div>
            <div className="sessions-section">
                <h2 className="header">Race settings</h2>
                <_RaceSettings
                    trackSettings={trackSettings}
                    raceSettings={raceSettings}
                    onChangeField={handleFieldChange}
                />
                <LabeledCheckbox
                    className="h2-header"
                    label="Free practice"
                    value={raceSettings.hasPractice}
                    onChange={b => handleFieldChange('hasPractice', b)}
                />
                <LabeledControl label="Duration (mins)">
                    <Slider
                        mode='thumb'
                        value={raceSettings.practiceLength}
                        min={1}
                        max={90}
                        step={1}
                        longStep={10}
                        readonly={raceSettings.hasPractice === false}
                        showNumberBox
                        markSpacing={10}
                        onChange={v => handleFieldChange('practiceLength', v)}
                    />
                </LabeledControl>
                <LabeledCheckbox
                    className="h2-header"
                    label="Qualifying"
                    value={raceSettings.hasQualifying}
                    onChange={b => handleFieldChange('hasQualifying', b)}
                />
                {raceSettings.hasQualifying === false && <_AutoQualifyingOptions
                   raceSettings={raceSettings}
                   onChangeField={handleFieldChange}
                />}
                {raceSettings.hasQualifying && <_RealQualifyingOptions
                   raceSettings={raceSettings}
                   onChangeField={handleFieldChange}
                />}
            </div>
            <div className="launch-section">
                <div className="settings-section">
                    <h2 className="header">Difficulty</h2>
                    <_DifficultySection
                        raceSettings={raceSettings}
                        onChangeField={handleFieldChange}
                        onChange={onChange}
                    />
                </div>
                <div className="section-controls">
                    <Button
                        highlighted
                        onClick={() => onStartRace()}
                    >
                        Start race
                    </Button>
                </div>
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
                key={d.internalName}
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
        isPlayer && "player-entry",
    )

    return (
        <div className={classStr}>
            <div className="checkbox-container">
                <Checkbox
                    value={enabled}
                    checkboxColor={team.color}
                    onChange={onEnable}
                    readonly={isPlayer}
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
                <div className="name">{driver.name}</div>
                {driver.isReserveDriver && <div className="reserve-icon">T</div>}
            </div>
        </div>
    );
}

interface _AutoQualifyingOptionsProps {
    raceSettings: RaceSettings;
    onChangeField: (field: keyof RaceSettings, value: any) => void;
}

function _AutoQualifyingOptions ({
    raceSettings,
    onChangeField,
}: _AutoQualifyingOptionsProps) {

    return (
        <LabeledControl
            label="Starting grid mode"
        >
            <DropdownField
                selectedItem={raceSettings.simulatedQualifyingMode}
                items={[
                    {value: StartingGridMode.Realistic, displayName: "Realistic"},
                    {value: StartingGridMode.Random, displayName: "Random"},
                    {value: StartingGridMode.Custom, displayName: "Custom"},
                ]}
                onSelect={i => onChangeField('simulatedQualifyingMode', i)}
            />
        </LabeledControl>
    );
}

interface _RealQualifyingOptionsProps {
    raceSettings: RaceSettings;
    onChangeField: (field: keyof RaceSettings, value: any) => void;
}

function _RealQualifyingOptions ({
    raceSettings,
    onChangeField,
}: _RealQualifyingOptionsProps) {
    return (<>
        <LabeledControl label="Duration (mins)">
            <Slider
                mode='thumb'
                value={raceSettings.qualifyingLength}
                min={1}
                max={90}
                step={1}
                longStep={10}
                showNumberBox
                markSpacing={10}
                onChange={v => onChangeField('qualifyingLength', v)}
            />
        </LabeledControl>
        <LabeledCheckbox
            label="Custom starting position for player"
            value={raceSettings.customStartingPositionForPlayer !== null}
            onChange={b => handleToggleCustomStartingPosition(b)}
        />
        {raceSettings.customStartingPositionForPlayer && <LabeledControl
            label="Starting position"
        >
            <Slider
                mode='thumb'
                value={raceSettings.customStartingPositionForPlayer}
                min={1}
                max={raceSettings.driverEntries?.length ?? 1}
                step={1}
                longStep={5}
                showNumberBox
                markSpacing={1}
                onChange={v => onChangeField('customStartingPositionForPlayer', v)}
            />
        </LabeledControl>}
    </>);

    function handleToggleCustomStartingPosition (toggled: boolean) {
        if (toggled) {
            onChangeField('customStartingPositionForPlayer', 1);
        }
        else {
            onChangeField('customStartingPositionForPlayer', null);
        }
    }
}

interface _RaceSettingsProps {
    trackSettings: TrackSettings;
    raceSettings: RaceSettings;
    onChangeField: (field: keyof RaceSettings, value: any) => void;
}

function _RaceSettings ({
    trackSettings,
    raceSettings,
    onChangeField,
}: _RaceSettingsProps) {
    const noLapBtn = trackSettings.event === null;

    return (<>
        <h4 className="header">Number of laps</h4>
        <LabeledControl label="Distance (approx, in km)">
            <div className="button-row">
                <Button onClick={() => _lapsByKm(30)}>30</Button>
                <Button onClick={() => _lapsByKm(50)}>70</Button>
                <Button onClick={() => _lapsByKm(100)}>100</Button>
                <Button onClick={() => _lapsByKm(150)}>150</Button>
                <Button onClick={() => _lapsByKm(200)}>200</Button>
                <Button onClick={() => _lapsByKm(300)}>300</Button>
                <Button onClick={() => _lapsByKm(500)}>500</Button>
            </div>
        </LabeledControl>
        <LabeledControl label="% of event">
            <div className="button-row">
                <Button disabled={noLapBtn} onClick={() => _lapsByPerc(0.1)}>10%</Button>
                <Button disabled={noLapBtn} onClick={() => _lapsByPerc(0.25)}>25%</Button>
                <Button disabled={noLapBtn} onClick={() => _lapsByPerc(0.33)}>33%</Button>
                <Button disabled={noLapBtn} onClick={() => _lapsByPerc(0.5)}>50%</Button>
                <Button disabled={noLapBtn} onClick={() => _lapsByPerc(0.75)}>75%</Button>
                <Button disabled={noLapBtn} onClick={() => _lapsByPerc(1)}>100%</Button>
            </div>
        </LabeledControl>
        <LabeledControl label="# of laps">
            <Slider
                mode='thumb'
                value={raceSettings.laps}
                min={1}
                max={Math.max(trackSettings.event?.laps ?? 1, 120)}
                step={1}
                longStep={5}
                showNumberBox
                numberBoxMax={500}
                markSpacing={5}
                onChange={v => onChangeField('laps', v)}
            />
        </LabeledControl>
        <LabeledCheckbox
            label="Tyre blankets"
            value={raceSettings.tyreBlankets}
            onChange={v => onChangeField('tyreBlankets', v)}
        />
        <LabeledCheckbox
            label="Penalties"
            value={raceSettings.penaltiesEnabled}
            onChange={v => onChangeField('penaltiesEnabled', v)}
        />
        <LabeledControl label="Jump start penalty">
            <DropdownField
                selectedItem={raceSettings.jumpStartPenalty}
                items={[
                    {displayName: "None", value: JumpStartPenalty.None},
                    {displayName: "Drive-through", value: JumpStartPenalty.DriveThrough},
                    {displayName: "Restart from box", value: JumpStartPenalty.BoxRestart},
                ]}
                onSelect={v => onChangeField('jumpStartPenalty', v)}
            />
        </LabeledControl>
    </>);

    function _lapsByKm (km: number) {
        const trackLength = trackSettings.layout?.length;

        if (trackLength) {
            const raceLength = Math.ceil(km / (trackLength / 1000));
            onChangeField('laps', raceLength);
        }
    }

    function _lapsByPerc (proportion: number) {
        if (trackSettings.event === null) return;

        onChangeField('laps', Math.trunc(trackSettings.event.laps * proportion));
    }
}

interface _DifficultySectionProps {
    raceSettings: RaceSettings;
    onChangeField: (field: keyof RaceSettings, value: any) => void;
    onChange: (raceSettings: RaceSettings) => void;
}

function _DifficultySection ({
    raceSettings,
    onChangeField,
    onChange,
}: _DifficultySectionProps) {

    return (<>
        <LabeledControl label="Opponent's strength">
            <Slider
                mode='thumb'
                value={raceSettings.opponentStrength}
                min={70}
                max={100}
                step={1}
                longStep={5}
                showNumberBox
                markSpacing={5}
                onChange={v => onChangeField('opponentStrength', v)}
            />
        </LabeledControl>
        <LabeledControl label="Opponent's aggression">
            <Slider
                mode='thumb'
                value={raceSettings.opponentAggression}
                min={0}
                max={100}
                step={1}
                longStep={10}
                showNumberBox
                markSpacing={10}
                onChange={v => onChangeField('opponentAggression', v)}
            />
        </LabeledControl>
        <div className="button-row">
            <Button onClick={() => handleDifficultyArcade()}>Arcade</Button>
            <Button onClick={() => handleDifficultyIntermediate()}>Intermediate</Button>
            <Button onClick={() => handleDifficultyRealistic()}>Realistic</Button>
            <Button>Save preset</Button>
        </div>
        <div className="two-column-options">
            <LabeledCheckbox
                label="Automatic shifting"
                value={raceSettings.automaticShifting}
                onChange={v => onChangeField('automaticShifting', v)}
            />
            <LabeledCheckbox
                label="Automatic clutch"
                value={raceSettings.automaticClutch}
                onChange={v => onChangeField('automaticClutch', v)}
            />
            <LabeledCheckbox
                label="Autoblip"
                value={raceSettings.autoblip}
                onChange={v => onChangeField('autoblip', v)}
            />
            <LabeledCheckbox
                label="Race line"
                value={raceSettings.idealLine}
                onChange={v => onChangeField('idealLine', v)}
            />
            <LabeledControl label="Traction control">
                <DropdownField
                    selectedItem={raceSettings.tractionControl}
                    items={[
                        {displayName: "Off", value: CarAid.Off},
                        {displayName: "Realistic", value: CarAid.RealSetting},
                        {displayName: "On", value: CarAid.On},
                    ]}
                    onSelect={v => onChangeField('tractionControl', v)}
                />
            </LabeledControl>
            <LabeledControl label="ABS">
                <DropdownField
                    selectedItem={raceSettings.abs}
                    items={[
                        {displayName: "Off", value: CarAid.Off},
                        {displayName: "Realistic", value: CarAid.RealSetting},
                        {displayName: "On", value: CarAid.On},
                    ]}
                    onSelect={v => onChangeField('abs', v)}
                />
            </LabeledControl>
        </div>
        <LabeledControl label="Stability control">
            <Slider
                mode='thumb'
                value={raceSettings.stabilityControl}
                min={0}
                max={100}
                step={1}
                longStep={10}
                showNumberBox
                markSpacing={10}
                onChange={v => onChangeField('stabilityControl', v)}
            />
        </LabeledControl>
        <LabeledControl label="Mechanical damage">
            <Slider
                mode='thumb'
                value={raceSettings.mechanicalDamage}
                min={0}
                max={100}
                step={1}
                longStep={10}
                showNumberBox
                markSpacing={10}
                onChange={v => onChangeField('mechanicalDamage', v)}
            />
        </LabeledControl>
        <LabeledControl label="Fuel consumption">
            <Slider
                mode='thumb'
                value={raceSettings.fuelConsumption}
                min={0}
                max={5}
                step={0.01}
                longStep={1}
                showNumberBox
                markSpacing={1}
                onChange={v => onChangeField('fuelConsumption', v)}
            />
        </LabeledControl>
        <LabeledControl label="Tyre wear">
            <Slider
                mode='thumb'
                value={raceSettings.tyreWear}
                min={0}
                max={5}
                step={0.01}
                longStep={1}
                showNumberBox
                markSpacing={1}
                onChange={v => onChangeField('tyreWear', v)}
            />
        </LabeledControl>
        <LabeledControl label="Slipstream effect">
            <Slider
                mode='thumb'
                value={raceSettings.slipstreamEffect}
                min={0}
                max={10}
                step={0.1}
                longStep={1}
                showNumberBox
                markSpacing={1}
                onChange={v => onChangeField('slipstreamEffect', v)}
            />
        </LabeledControl>
    </>);

    function handleDifficultyArcade () {
        onChange({
            ...raceSettings,
            automaticShifting: true,
            automaticClutch: true,
            autoblip: true,
            idealLine: true,
            tractionControl: CarAid.On,
            abs: CarAid.On,
            stabilityControl: 100,
            mechanicalDamage: 20,
            fuelConsumption: 1,
            tyreWear: 1,
            slipstreamEffect: 5,
        });
    }

    function handleDifficultyIntermediate () {
        onChange({
            ...raceSettings,
            automaticShifting: false,
            automaticClutch: true,
            autoblip: true,
            idealLine: false,
            tractionControl: CarAid.RealSetting,
            abs: CarAid.RealSetting,
            stabilityControl: 50,
            mechanicalDamage: 50,
            fuelConsumption: 1,
            tyreWear: 1,
            slipstreamEffect: 1,
        });
    }

    function handleDifficultyRealistic () {
        onChange({
            ...raceSettings,
            automaticShifting: false,
            automaticClutch: false,
            autoblip: true,
            idealLine: false,
            tractionControl: CarAid.RealSetting,
            abs: CarAid.RealSetting,
            stabilityControl: 0,
            mechanicalDamage: 100,
            fuelConsumption: 1,
            tyreWear: 1,
            slipstreamEffect: 1,
        });
    }
}

export default FreeSession_RaceInfoPanel;
