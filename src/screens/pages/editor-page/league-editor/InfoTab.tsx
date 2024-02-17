import ColorField from 'components/ColorField';
import CountryField from 'components/CountryField';
import ImageField from 'components/ImageField';
import MultiTagField from 'components/MultiTagField';
import { AssetFolder } from 'data/assets';
import { League } from 'data/schemas';
import LabeledControl from 'elements/LabeledControl';
import NumericBox from 'elements/NumericBox';
import Textbox from 'elements/Textbox';
import FormTitle from 'elements/form/FormTitle';
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
        <div className="editor-tab info-tab">
            <div className="images-section">
                <FormTitle title="Logo" />
                <div className="logo-cell">
                    <ImageField
                        className="logo-image-field"
                        directory={AssetFolder.leagueLogos}
                        image={league.logo}
                        defaultImageBackgroundColor="white"
                        onChange={handleChange_logo}
                    />
                </div>
                <FormTitle title="Background" />
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
                    <LabeledControl label="Internal name" required>
                        <Textbox
                            value={league.internalName}
                            onChange={handleChange_internalName}
                            //readonly
                        />
                    </LabeledControl>
                </div>
                <div className="info-section-cell series-cell">
                    <LabeledControl label="Series" required>
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
                    <LabeledControl label="Year" required>
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
                <div className="info-section-cell era-cell">
                    <LabeledControl label="Makers">
                        <Textbox
                            value={league.makers}
                            onChange={handleChange_makers}
                        />
                    </LabeledControl>
                </div>
                <div className="info-section-cell region-cell">
                    <LabeledControl label="Region" required>
                        <CountryField
                            value={league.region}
                            onChange={handleChange_region}
                            allowRegions
                            required
                        />
                    </LabeledControl>
                </div>
                <div className="info-section-cell region-cell">
                    <LabeledControl label="Color" required>
                        <ColorField
                            value={league.color}
                            onChange={handleChange_color}
                        />
                    </LabeledControl>
                </div>
                <div className="info-section-cell categories-cell">
                    <LabeledControl label="Categories">
                        <MultiTagField
                            values={league.categories}
                            onChange={handleChange_categories}
                        />
                    </LabeledControl>
                </div>
            </div>
        </div>
    );

    function handleChange_logo (name: string | null) {
        onChange('logo', name);
    }

    function handleChange_background (name: string | null) {
        onChange('background', name);
    }

    function handleChange_internalName (text: string) {
        onChange('internalName', text);
    }

    function handleChange_series (text: string) {
        onChange('series', text);
    }

    function handleChange_year (year: number | null) {
        if (year !== null) {
            onChange('year', year);
        }
    }

    function handleChange_displayName (text: string) {
        onChange('displayName', text);
    }

    function handleChange_era (text: string) {
        onChange('era', text);
    }

    function handleChange_makers (text: string) {
        onChange('makers', text);
    }

    function handleChange_region (region: string | null) {
        onChange('region', region);
    }

    function handleChange_color (color: string) {
        onChange('color', color);
    }

    function handleChange_categories (categories: string[]) {
        onChange('categories', categories);
    }
}

export default InfoTab;