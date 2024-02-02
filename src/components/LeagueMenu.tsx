import Icon from 'elements/Icon';
import React from 'react';

export interface LeagueMenuProps {

}

function LeagueMenu (props: LeagueMenuProps) {
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
                <div className="category-container">
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
                    <div className="series-icon" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="icon-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Formula 1</span>
                        </div>
                    </div>
                    <div className="series-icon" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="icon-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Formula 1</span>
                        </div>
                    </div>
                    <div className="series-icon" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="icon-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Formula 1</span>
                        </div>
                    </div>
                    <div className="series-icon selected" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="icon-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Formula 1</span>
                        </div>
                    </div>
                    <div className="series-icon" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="icon-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Formula 1</span>
                        </div>
                    </div>
                    <div className="series-icon" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="icon-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Formula 1</span>
                        </div>
                    </div>
                    <div className="series-icon" style={seriesIconStyle}>
                        <div className="series-highlighter" />
                        <div className="icon-container">
                            <img src={__icon} />
                        </div>
                        <div className="name-container">
                            <span>Formula 1</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section seasons">
                <h3>seasons</h3>
            </div>
        </div>
    );

    /*
        <div className="league">
            <div className="logo">
                <img src={__icon} />
            </div>
            <div className="name">
                <span>Formula 1 (2007)</span>
            </div>
        </div>
     */
}

export default LeagueMenu;