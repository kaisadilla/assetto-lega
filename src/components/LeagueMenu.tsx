import { League } from 'data/schemas';
import Icon from 'elements/Icon';
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
                <div className="category-container">
                    <div className="category category-all">
                        <span>ALL</span>
                    </div>
                    <div className="category">
                        <Icon name="fa-star" />
                        <span>GT3</span>
                    </div>
                    <div className="category">
                        <Icon name="fa-star" />
                        <span>Hypercar</span>
                    </div>
                    <div className="category selected">
                        <Icon name="fa-star" />
                        <span>Open-wheel</span>
                    </div>
                    <div className="category">
                        <Icon name="fa-star" />
                        <span>Spec series</span>
                    </div>
                    <div className="category">
                        <span>Karts</span>
                    </div>
                    <div className="category">
                        <span>LMP1</span>
                    </div>
                    <div className="category">
                        <span>LMP2</span>
                    </div>
                    <div className="category">
                        <span>Open cockpit</span>
                    </div>
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
                    <div className="season" onClick={() => onSelect?.("league-vanilla")}>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeagueMenu;
