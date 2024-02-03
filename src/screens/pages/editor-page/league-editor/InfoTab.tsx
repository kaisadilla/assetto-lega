import ImagePicker from 'components/ImagePicker';
import { AssetFolder } from 'data/assets';
import React from 'react';

export interface InfoTabProps {

}

function InfoTab (props: InfoTabProps) {
    return (
        <div className="info-tab">
            <div className="images-section">
                <div className="logo-cell">
                    <ImagePicker
                        directory={AssetFolder.leagueLogos}
                        image={"@f1"}
                    />
                </div>
                <div className="background-cell">
                    <ImagePicker
                        directory={AssetFolder.leagueBackgrounds}
                        image={"@ac-spa"}
                    />
                </div>
            </div>
            <div className="info-section">
                <div className="internal-name-cell">
                    INTERNAL
                </div>
                <div className="series-cell">
                    SERIES
                </div>
                <div className="year-cell">
                    YEAR
                </div>
                <div className="display-name-cell">
                    DISPLAY NAME
                </div>
                <div className="era-cell">
                    ERA
                </div>
                <div className="region-cell">
                    REGION
                </div>
                <div className="categories-cell">
                    CATEGORIES
                </div>
            </div>
        </div>
    );
}

export default InfoTab;