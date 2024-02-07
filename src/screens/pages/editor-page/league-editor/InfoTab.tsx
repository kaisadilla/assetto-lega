import ImageField from 'components/ImageField';
import { AssetFolder } from 'data/assets';
import { League } from 'data/schemas';
import LabeledControl from 'elements/LabeledControl';
import NumericBox from 'elements/NumericBox';
import Textbox from 'elements/Textbox';
import React from 'react';

export interface InfoTabProps {
    league: League;
    onChange: (field: keyof League, value: any) => void;
}

function InfoTab ({
    league,
    onChange,
}: InfoTabProps) {
    return (
        <div className="info-tab">
            <div className="images-section">
                <div className="logo-cell">
                    <ImageField
                        className="logo-image-field"
                        directory={AssetFolder.leagueLogos}
                        image={league.logo}
                        defaultImageBackgroundColor="white"
                        onChange={handleChange_logo}
                    />
                </div>
                <div className="background-cell">
                    <ImageField
                        className="background-image-field"
                        directory={AssetFolder.leagueBackgrounds}
                        image={league.background}
                        onChange={handleChange_background}
                    />
                </div>
            </div>
            <div className="info-section">
                <div className="info-section-cell internal-name-cell">
                    <LabeledControl label="Internal name">
                        <Textbox
                            value={league.internalName}
                        />
                    </LabeledControl>
                </div>
                <div className="info-section-cell series-cell">
                    <LabeledControl label="Series">
                        <Textbox
                            value={league.series}
                            onChange={handleChange_series}
                            suggestions={[
                                "DTM",
                                "Formula 1",
                                "Formula 2",
                                "IMSA SportsCar Championship",
                                "Indycar",
                                "NASCAR",
                                "Super Formula",
                                "Supercars",
                                "WEC",
                            ]}
                        />
                    </LabeledControl>
                </div>
                <div className="info-section-cell year-cell">
                    <LabeledControl label="Year">
                        <NumericBox
                            value={league.year}
                            onChange={handleChange_year}
                        />
                    </LabeledControl>
                </div>
                <div className="info-section-cell display-name-cell">
                    <LabeledControl label="Display name">
                        <Textbox
                            value={league.displayName}
                            onChange={handleChange_displayName}
                        />
                    </LabeledControl>
                </div>
                <div className="info-section-cell era-cell">
                    <LabeledControl label="Era">
                        <Textbox
                            value={league.era}
                            onChange={handleChange_era}
                            suggestions={[
                                "V6 hybrid",
                                "V8",
                                "V10",
                            ]}
                        />
                    </LabeledControl>
                </div>
                <div className="info-section-cell region-cell">
                    <LabeledControl label="Region">
                        {league.region}
                    </LabeledControl>
                </div>
                <div className="info-section-cell categories-cell">
                    <LabeledControl label="Categories">
                        {league.categories}
                    </LabeledControl>
                </div>
            </div>
        </div>
    );

    function handleChange_logo (name: string | null) {
        onChange("logo", name);
    }

    function handleChange_background (name: string | null) {
        onChange("background", name);
    }

    function handleChange_series (text: string) {
        onChange("series", text);
    }

    function handleChange_year (text: number | null) {
        if (text !== null) {
            onChange("year", text);
        }
    }

    function handleChange_displayName (text: string) {
        onChange("displayName", text);
    }

    function handleChange_era (text: string) {
        onChange("era", text);
    }
}

export default InfoTab;