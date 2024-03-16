import { useAcContext } from 'context/useAcContext';
import { AssetFolder } from 'data/assets';
import { FILE_PROTOCOL } from 'data/files';
import { LeagueTeam } from 'data/schemas';
import AssetImage from 'elements/AssetImage';
import AutoSizeGrid from 'elements/AutoSizeGrid';
import DefaultHighlighter from 'elements/Highlighter';
import SelectableItem from 'elements/SelectableItem';
import FlagImage from 'elements/images/FlagImage';
import React, { CSSProperties } from 'react';
import { chooseW3CTextColor, getClassString } from 'utils';

export interface TeamGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
    teams: LeagueTeam[];
    spec: string;
    selectedTeam?: string | null;
    onSelectValue?: (team: LeagueTeam) => void;
}

function TeamGallery ({
    teams,
    spec,
    selectedTeam,
    onSelectValue,
    className,
    ...divProps
}: TeamGalleryProps) {
    
    return (
        <AutoSizeGrid
            minElementWidth={200}
            maxElementWidth={320}
            containerGapWidth={10}
            containerWidth={1348}
            containerPadding={5}
            prioritizeSize='smallest'
            className="default-team-gallery"
        >
            {teams.map(t => <_TeamGalleryEntry
                key={t.internalName}
                team={t}
                spec={spec}
                selectedTeam={selectedTeam}
                onSelect={() => onSelectValue?.(t)}
            />)}
        </AutoSizeGrid>
    );
}

interface _TeamGalleryEntryProps {
    team: LeagueTeam;
    spec: string;
    selectedTeam: string | null | undefined;
    onSelect: () => void;
    style?: CSSProperties,
}

function _TeamGalleryEntry ({
    team,
    spec,
    selectedTeam,
    onSelect,
    style,
}: _TeamGalleryEntryProps) {
    const { cars } = useAcContext();

    const teamCar = cars.carsById[team.cars[spec]];

    // TODO: Manage this situation
    if (teamCar === undefined) {
        throw `Car not found.`;
    }

    const textColor = chooseW3CTextColor(team.color);

    const entryClass = getClassString(
        "entry",
        textColor === 'black' && "text-black",
        textColor === 'white' && "text-white",
    );

    style = {
        ...(style ?? {}),
        backgroundColor: team.color,
        borderColor: team.color,
    }
    

    return (
        <SelectableItem
            selectionMode='border'
            borderWidth={5}
            value={team.internalName}
            selectedValue={selectedTeam}
        >

        <div className={entryClass} style={style} onClick={() => onSelect()}>
            <div className="team-logo">
                <AssetImage folder={AssetFolder.teamLogos} imageName={team.logo} />
            </div>
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
            <div className="team-data">
                <div className="team-car">
                    <img className="team-badge" src={FILE_PROTOCOL + teamCar.badgePath} />
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

        </SelectableItem>
    );
}


export default TeamGallery;
