
interface _DriverSectionProps {
    expanded: boolean;
    canBeExpanded: boolean;
    league: League | null;
    trackSettings: TrackSettings;
    driverSettings: DriverSettings;
    onChange: (driverSettings: DriverSettings) => void;
    onExpand: () => void;
}

function _DriverSection ({
    expanded,
    canBeExpanded,
    league,
    trackSettings,
    driverSettings,
    onChange,
    onExpand,
}: _DriverSectionProps) {
    // Whether we'll show the pick team menu or not. The initial value depends
    // on whether a team is already picked.
    const [showTeamSelection, setShowTeamSelection] = useState(
        driverSettings.selectedTeam === null
    );

    useEffect(() => {
        setShowTeamSelection(driverSettings.selectedTeam === null);
    }, [expanded]);

    if (canBeExpanded === false) {
        return (
            <div className="section collapsed section-not-available">
                Driver
            </div>
        )
    }

    if (expanded === false) {
        if (true) {
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
            return (
                <div
                    className="section collapsed track-section-collapsed"
                    onClick={() => onExpand()}
                >
                    driver!
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
            {showTeamSelection && <_DriverSectionTeamSelection
                league={league!}
                selectedTeam={driverSettings.selectedTeam?.internalName}
                onSelect={v => handleTeamSelection(v)}
            />}
            {showTeamSelection === false && <_DriverSelectionForm
                league={league!}
                driverSettings={driverSettings}
            />}
        </BackgroundDiv>
    );

    function handleFieldChange (field: keyof DriverSettings, value: any) {
        onChange({
            ...driverSettings,
            [field]: value,
        });
    }

    function handleTeamSelection (team: LeagueTeam) {
        handleFieldChange('selectedTeam', team);
        setShowTeamSelection(false);
    }
}

interface _DriverSectionTeamSelectionProps {
    league: League;
    selectedTeam: string | null | undefined;
    onSelect: (team: LeagueTeam) => void;
}

function _DriverSectionTeamSelection ({
    league,
    selectedTeam,
    onSelect
}: _DriverSectionTeamSelectionProps) {

    return (
        <div className="team-gallery-container">
            <TeamGallery
                teams={league.teams}
                spec={league.specs[0]}
                selectedTeam={selectedTeam}
                onSelectValue={onSelect}
            />
        </div>
    );
}

interface _DriverSelectionFormProps {
    league: League;
    driverSettings: DriverSettings;
}

function _DriverSelectionForm ({
    league,
    driverSettings,
}: _DriverSelectionFormProps) {

    return (
        <div>
            {driverSettings.selectedTeam?.name}
        </div>
    );
}