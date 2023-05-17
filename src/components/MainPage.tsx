import React, { useEffect } from 'react';
import "styles/components/main-menu.scss";
import NavBar, { NavBarSize } from 'elements/NavBar';
import LeaguePage from './LeaguePage';
import FreeSessionPage from './FreeSessionPage';
import { AppTab, useNavigationContext } from './useNavigation';

function MainPage () {
    const { selectedTab, setSelectedTab } = useNavigationContext();

    const $content = (() => {
        if (selectedTab === AppTab.FREE_DRIVE) {
            return <FreeSessionPage />;
        }
        else if (selectedTab === AppTab.LEAGUES) {
            return (
                <LeaguePage />
            );
        }
        else {
            return <></>;
        }
    })();

    return (
        <main className="main-menu">
            <div className="cell-navbar">
                <NavBar size={NavBarSize.BIG} get={selectedTab} set={setSelectedTab}>
                    <NavBar.Item text="free session" index={AppTab.FREE_DRIVE} />
                    <NavBar.Item text="leagues" index={AppTab.LEAGUES} />
                </NavBar>
            </div>
            <div className="cell-content">
                {$content}
            </div>
        </main>
    );
}

export default MainPage;