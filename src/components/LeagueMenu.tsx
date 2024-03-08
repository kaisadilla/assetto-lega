import { useDataContext } from 'context/useDataContext';
import { AssetFolder } from 'data/assets';
import { Files } from 'data/files';
import { League, Tier } from 'data/schemas';
import DefaultHighlighter from 'elements/Highlighter';
import Icon from 'elements/Icon';
import TextSelectorList from 'elements/TextSelectorList';
import React, { useEffect, useState } from 'react';
import { getClassString } from 'utils';

const ALL_CATEGORY = "ALL";

type SeriesCategoryMap = {[series: string]: string[]};
type SeriesLeagueMap = {[series: string]: League[]};

export interface LeagueMenuProps {
    leagues: League[];
    onSelect?: (leagueId: string) => void;
}

// todo: build with real data
function LeagueMenu ({
    leagues,
    onSelect,
}: LeagueMenuProps) {
    const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
    const [selectedSeries, setSelectedSeries] = useState("");

    const [categories, setCategories]
        = useState<string[] | null>(null);
    const [seriesCategories, setSeriesCategories]
        = useState<SeriesCategoryMap | null>(null);
    const [seriesLeagues, setSeriesLeagues]
        = useState<SeriesLeagueMap | null>(null);

    const [thumbnailSize, setThumbnailSize] = useState(128);

    useEffect(() => {
        setCategories(getAllCategories(leagues));
        setSeriesCategories(getAllSeriesCategories(leagues));
        setSeriesLeagues(getAllSeriesLeagues(leagues));
    }, [leagues]);

    if (categories === null || seriesCategories === null || seriesLeagues === null) {
        return (
            <div className="league-menu">
                Loading...
            </div>
        );
    }

    const __icon = require("@assets/league_icon.png");
    const __bg = require("@assets/preview.png");

    const seriesIconStyle = {
        width: "96px",
        height: "96px",
        backgroundImage: `linear-gradient(#00000060, #00000060), url(${__bg})`,
    }

    return (
        <div className="league-menu">
            <div className="section categories">
                <h3>categories</h3>
                <div className="categories-container">
                    <TextSelectorList
                        entries={[
                            {
                                name: ALL_CATEGORY,
                                value: ALL_CATEGORY,
                                isAll: true,
                                selected: selectedCategory === ALL_CATEGORY,
                                onSelect: setSelectedCategory,
                            },
                            ...categories.map(c => ({
                                name: c,
                                value: c,
                                tier: Tier.Regular,
                                selected: selectedCategory === c,
                                onSelect: setSelectedCategory,
                            }))
                        ]}
                    />
                </div>
            </div>
            <div className="section series">
                <h3>series</h3>
                <SeriesPanel
                    series={seriesCategories}
                    leagues={seriesLeagues}
                    category={selectedCategory}
                    thumbnailSize={thumbnailSize}
                    selectedSeries={selectedSeries}
                    onSelect={setSelectedSeries}
                />
            </div>
            <div className="section seasons">
                <h3>seasons</h3>
                <SeasonsPanel
                    leagues={seriesLeagues[selectedSeries] ?? []}
                    category={selectedCategory}
                    onSelect={l => onSelect?.(l)}
                />
            </div>
        </div>
    );
}

interface SeriesPanelProps {
    series: SeriesCategoryMap;
    leagues: SeriesLeagueMap;
    category: string;
    thumbnailSize: number;
    selectedSeries: string;
    onSelect: (series: string) => void;
}

function SeriesPanel ({
    series,
    leagues,
    category,
    thumbnailSize,
    selectedSeries,
    onSelect,
}: SeriesPanelProps) {
    const validSeries: string[] = [];

    for (const s in series) {
        if (category === ALL_CATEGORY || series[s].includes(category)) {
            validSeries.push(s);
        }
    }

    return (
        <div className="series-container">
            {validSeries.map(s => (<SeriesPanelThumbnail
                series={s}
                league={leagues[s][0]}
                thumbnailSize={thumbnailSize}
                selected={selectedSeries === s}
                onSelect={() => onSelect(s)}
            />))}
        </div>
    );
}

interface SeriesPanelThumbnailProps {
    series: string;
    league: League;
    thumbnailSize: number;
    selected: boolean;
    onSelect: () => void;
}

function SeriesPanelThumbnail ({
    series,
    league,
    thumbnailSize,
    selected,
    onSelect,
}: SeriesPanelThumbnailProps) {
    const { dataPath } = useDataContext();

    const classStr = getClassString(
        "series-icon",
        selected && "selected",
    );

    const imgBackground = Files.getFilePath(
        dataPath, AssetFolder.leagueBackgrounds, league.background
    );
    const imgLogo = Files.getFilePath(
        dataPath, AssetFolder.leagueLogos, league.logo
    );

    const seriesIconStyle = {
        width: `${thumbnailSize}px`,
        height: `${thumbnailSize}px`,
        backgroundImage: `linear-gradient(#00000060, #00000060), url(${imgBackground})`,
    }

    return (
        <div
            className={classStr}
            style={seriesIconStyle}
            onClick={() => onSelect()}>
            <div className="series-highlighter"
        />
            <div className="logo-container">
                <img src={imgLogo} />
            </div>
            <div className="name-container">
                <span>{series}</span>
            </div>
        </div>
    );
}

interface SeasonsPanelProps {
    leagues: League[];
    category: string;
    onSelect: (league: string) => void;
}

function SeasonsPanel ({
    leagues,
    category,
    onSelect
}: SeasonsPanelProps) {
    const validLeagues: League[] = [];

    for (const l of leagues) {
        if (category === ALL_CATEGORY || l.categories.includes(category)) {
            validLeagues.push(l);
        }
    }

    return (
        <div className="season-container">
            {validLeagues.map(l => <SeasonsPanelEntry
                league={l}
                onSelect={() => onSelect(l.internalName)}
            />)}
        </div>
    );
}

interface SeasonsPanelEntryProps {
    league: League,
    onSelect: () => void;
}

function SeasonsPanelEntry ({
    league,
    onSelect,
}: SeasonsPanelEntryProps) {
    const { dataPath } = useDataContext();

    const imgLogo = Files.getFilePath(
        dataPath, AssetFolder.leagueLogos, league.logo
    );

    const teamCount = league.teams.length;
    const driverCount = league.teams.reduce(
        (acc, t) => acc += t.drivers.length, 0
    );
    const trackCount = league.calendar.length;

    return (
        <div className="season" onClick={() => onSelect()}>
            <div
                className="season-color"
                style={{backgroundColor: league.color}}
            />
            <div className="season-logo">
                <img src={imgLogo} />
            </div>
            <div className="season-name">
                <span className="name">{league.displayName ?? league.year}</span>
            </div>
            <div className="season-fact season-teams">
                <span>{teamCount} teams</span>
            </div>
            <div className="season-fact season-drivers">
                <span>{driverCount} drivers</span>
            </div>
            <div className="season-fact season-tracks">
                <span>{trackCount} tracks</span>
            </div>
            <div className="season-fact season-era">
                <span>{league.era ?? ""}</span>
            </div>
            <div className="season-fact season-makers">
                <span>{league.makers ?? ""}</span>
            </div>
        </div>
    );
}

// TODO: getAllCategories copied in two places total.
/**
 * Generates an array of strings containing all different categories within the
 * leagues given.
 */
function getAllCategories (leagues: League[]) : string[] {
    const catSet = new Set<string>();

    for (const l of leagues) {
        for (const c of l.categories) {
            catSet.add(c);
        }
    }

    return Array.from(catSet);
}

/**
 * Generates an object where each key is a series, and each value is an array of
 * categories that have, at least, one league in that series. Note that different
 * leagues of the same series may not be in the same categories.
 */
function getAllSeriesCategories (leagues: League[]) {
    const seriesSets: {[seies: string]: Set<string>} = {};
    const series: SeriesCategoryMap = {};

    for (const l of leagues) {        
        if (seriesSets[l.series] === undefined) {
            seriesSets[l.series] = new Set<string>();
        }

        for (const c of l.categories) {
            seriesSets[l.series].add(c);
        }
    }

    for (const s in seriesSets) {
        series[s] = Array.from(seriesSets[s]);
    }

    return series;
}

/**
 * Generates an object where each key is a series, and each value is an array of
 * leagues that belong to that series.
 */
function getAllSeriesLeagues (leagues: League[]) {
    const series: {[series: string]: League[]} = {};

    for (const l of leagues) {     
        if (series[l.series] === undefined) {
            series[l.series] = [];
        }
        
        series[l.series].push(l);
    }

    for (const s in series) {
        series[s] = series[s].sort((a, b) => b.year - a.year);
    }

    return series;
}

export default LeagueMenu;
