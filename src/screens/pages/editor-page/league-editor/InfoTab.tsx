import ColorField from 'components/ColorField';
import CountryField from 'components/CountryField';
import ImageField from 'components/ImageField';
import MultiTagField from 'components/MultiTagField';
import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { League } from 'data/schemas';
import Checkbox from 'elements/Checkbox';
import EditableList from 'elements/EditableList';
import LabeledControl from 'elements/LabeledControl';
import NumericBox from 'elements/NumericBox';
import Textbox from 'elements/Textbox';
import Form from 'elements/form/Form';
import React from 'react';
import { arrayUnion } from 'utils';

export interface InfoTabProps {
    league: League;
    existingLeagueCategories: string[];
    onChange: (field: keyof League, value: any) => void;
}

function InfoTab ({
    league,
    existingLeagueCategories,
    onChange,
}: InfoTabProps) {
    const { suggestions } = useDataContext();

    return (
        <div className="editor-tab info-tab">
            <Form>
                <Form.Section className="images-section" horizontalAlignment='center'>
                    <Form.Title title="Logo" />
                        <div className="logo-cell">
                            <ImageField
                                className="logo-image-field"
                                directory={AssetFolder.leagueLogos}
                                image={league.logo}
                                defaultImageBackgroundColor='white'
                                onChange={handleChange_logo}
                            />
                        </div>
                    <Form.Title title="Background" />
                        <div className="background-cell">
                            <ImageField
                                className="background-image-field"
                                directory={AssetFolder.leagueBackgrounds}
                                image={league.background}
                                onChange={handleChange_background}
                            />
                        </div>
                </Form.Section>
                <Form.Section className="info-section">
                    <LabeledControl label="Internal name" required>
                        <Textbox
                            value={league.internalName}
                            onChange={handleChange_internalName}
                            //readonly
                        />
                    </LabeledControl>
                    <LabeledControl label="Series" required>
                        <Textbox
                            value={league.series}
                            onChange={handleChange_series}
                            suggestions={suggestions.series}
                        />
                    </LabeledControl>
                    <LabeledControl label="Year" required>
                        <NumericBox
                            value={league.year}
                            onChange={handleChange_year}
                        />
                    </LabeledControl>
                    <LabeledControl label="Display name">
                        <Textbox
                            value={league.displayName}
                            onChange={handleChange_displayName}
                        />
                    </LabeledControl>
                    <LabeledControl label="Era">
                        <Textbox
                            value={league.era}
                            onChange={handleChange_era}
                            suggestions={suggestions.eras[league.series]}
                        />
                    </LabeledControl>
                    <LabeledControl label="Makers">
                        <Textbox
                            value={league.makers}
                            onChange={handleChange_makers}
                        />
                    </LabeledControl>
                    <LabeledControl label="Region" required>
                        <CountryField
                            value={league.region}
                            onChange={handleChange_region}
                            allowRegions
                            required
                        />
                    </LabeledControl>
                    <LabeledControl label="Color" required>
                        <ColorField
                            value={league.color}
                            onChange={handleChange_color}
                        />
                    </LabeledControl>
                    <LabeledControl label="Use random skins" required>
                        <Checkbox
                            value={league.useRandomSkins}
                            onChange={v => onChange('useRandomSkins', v)}
                        />
                    </LabeledControl>
                </Form.Section>
                <Form.Section className="groups-section">
                    <Form.Title title="Specs" />
                    <EditableList
                        items={league.specs}
                        onChangeList={list => onChange('specs', list)}
                        allowRemove
                        minimumNumberOfItems={1}
                    />
                    <Form.Title title="Classes" />
                </Form.Section>
                <Form.Section className="categories-section">
                    <Form.Title title="Categories" />
                    <EditableList
                        items={arrayUnion(league.categories, existingLeagueCategories)}
                        checkedItems={league.categories}
                        onChangeCheckedItems={handleChange_categories}
                    />
                </Form.Section>
            </Form>
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

    function handleChange_year (year: number) {
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
        console.log(categories)
        onChange('categories', categories);
    }
}

export default InfoTab;