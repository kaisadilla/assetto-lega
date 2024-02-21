import { League, Tier } from 'data/schemas';
import Icon from 'elements/Icon';
import TextSelectorList from 'elements/TextSelectorList';
import React from 'react';

export interface LeagueMenuProps {
    leagues: League[];
    onSelect?: (leagueId: string) => void;
}

// todo: build with real data
function LeagueMenu ({
    onSelect,
}: LeagueMenuProps) {
    const __icon = require("@assets/league_icon.png");
    const __bg = require("@assets/preview.png");

    const seriesIconStyle = {
        width: "96px",
        height: "96px",
        backgroundImage: `linear-gradient(#00000060, #00000060), url(${__bg})`,
    }

    // TODO - Important: include "maker" or something like that to distinguish
    // F1 by VRC from F1 by RSS.
    return (
        <div className="league-menu">
            <div className="section categories">
                <h3>categories</h3>
                <div className="categories-container">
                    <TextSelectorList
                        entries={[
                            {
                                name: "ALL",
                                value: "ALL",
                                isAll: true,
                            },
                            {
                                name: "GT3",
                                value: "GT3",
                                tier: Tier.Legendary,
                            },
                            {
                                name: "Hypercar",
                                value: "Hypercar",
                                tier: Tier.Legendary,
                            },
                            {
                                name: "Open-wheel",
                                value: "Open-wheel",
                                tier: Tier.Legendary,
                                selected: true,
                            },
                            {
                                name: "Spec series",
                                value: "Spec series",
                                tier: Tier.Epic,
                            },
                            {
                                name: "Karts",
                                value: "Karts",
                                tier: Tier.Epic,
                            },
                            {
                                name: "LMP1",
                                value: "LMP1",
                                tier: Tier.Distinguished,
                            },
                            {
                                name: "LMP2",
                                value: "LMP2",
                                tier: Tier.Distinguished,
                            },
                            {
                                name: "Open cockpit",
                                value: "Open cockpit",
                            }
                        ]}
                    />
                </div>
            </div>
            <div className="section series">
                <h3>series</h3>
                <div className="series-container">
                    <div className="series-icon selected" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="logo-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Formula 1</span>
                        </div>
                    </div>
                    <div className="series-icon" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="logo-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Indycar</span>
                        </div>
                    </div>
                    <div className="series-icon" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="logo-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Formula 2</span>
                        </div>
                    </div>
                    <div className="series-icon" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="logo-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Formula 3</span>
                        </div>
                    </div>
                    <div className="series-icon" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="logo-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Formula E</span>
                        </div>
                    </div>
                    <div className="series-icon" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="logo-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Super Formula</span>
                        </div>
                    </div>
                    <div className="series-icon" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="logo-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Formula Renault</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section seasons">
                <h3>seasons</h3>
                <div className="season-container">
                    <div className="season" onClick={() => onSelect?.("f1-2023-rss")}>
                        <div className="season-color" style={{backgroundColor: "#00ffff"}} />
                        <div className="season-logo">
                            <img src={__icon} />
                        </div>
                        <div className="season-name">
                            <span className="name">2023</span>
                        </div>
                        <div className="season-fact season-teams">
                            <span>10 teams</span>
                        </div>
                        <div className="season-fact season-drivers">
                            <span>20 drivers</span>
                        </div>
                        <div className="season-fact season-tracks">
                            <span>24 tracks</span>
                        </div>
                        <div className="season-fact season-era">
                            <span>V6 hybrid</span>
                        </div>
                        <div className="season-fact season-makers">
                            <span>RSS</span>
                        </div>
                    </div>
                    <div className="season">
                        <div className="season-color" style={{backgroundColor: "#00ffff"}} />
                        <div className="season-logo">
                            <img src={__icon} />
                        </div>
                        <div className="season-name">
                            <span className="name">2022</span>
                        </div>
                        <div className="season-fact season-teams">
                            <span>10 teams</span>
                        </div>
                        <div className="season-fact season-drivers">
                            <span>20 drivers</span>
                        </div>
                        <div className="season-fact season-tracks">
                            <span>22 tracks</span>
                        </div>
                        <div className="season-fact season-era">
                            <span>V6 hybrid</span>
                        </div>
                        <div className="season-fact season-makers">
                            <span>SimDream</span>
                        </div>
                    </div>
                    <div className="season">
                        <div className="season-color" style={{backgroundColor: "#00ffff"}} />
                        <div className="season-logo">
                            <img src={__icon} />
                        </div>
                        <div className="season-name">
                            <span className="name">Super series '21</span>
                            <span className="year">2021</span>
                        </div>
                        <div className="season-fact season-teams">
                            <span>11 teams</span>
                        </div>
                        <div className="season-fact season-drivers">
                            <span>22 drivers</span>
                        </div>
                        <div className="season-fact season-tracks">
                            <span>20 tracks</span>
                        </div>
                        <div className="season-fact season-era">
                            <span>V6 hybrid</span>
                        </div>
                        <div className="season-fact season-makers">
                            <span>SuzQ</span>
                        </div>
                    </div>
                    <div className="season">
                        <div className="season-color" style={{backgroundColor: "#640096"}} />
                        <div className="season-logo">
                            <img src={__icon} />
                        </div>
                        <div className="season-name">
                            <span className="name">Super series '20</span>
                            <span className="year">2020</span>
                        </div>
                        <div className="season-fact season-teams">
                            <span>12 teams</span>
                        </div>
                        <div className="season-fact season-drivers">
                            <span>24 drivers</span>
                        </div>
                        <div className="season-fact season-tracks">
                            <span>20 tracks</span>
                        </div>
                        <div className="season-fact season-era">
                            <span>V8</span>
                        </div>
                        <div className="season-fact season-makers">
                            <span>SuzQ</span>
                        </div>
                    </div>
                    <div className="season">
                        <div className="season-color" style={{backgroundColor: "#640096"}} />
                        <div className="season-logo">
                            <img src={__icon} />
                        </div>
                        <div className="season-name">
                            <span className="name">Super series '19</span>
                            <span className="year">2019</span>
                        </div>
                        <div className="season-fact season-teams">
                            <span>12 teams</span>
                        </div>
                        <div className="season-fact season-drivers">
                            <span>24 drivers</span>
                        </div>
                        <div className="season-fact season-tracks">
                            <span>18 tracks</span>
                        </div>
                        <div className="season-fact season-era">
                            <span>V8</span>
                        </div>
                        <div className="season-fact season-makers">
                            <span>SuzQ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeagueMenu;
