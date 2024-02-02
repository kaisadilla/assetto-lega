import React, { useEffect, useState } from 'react';
import "styles/components/main-menu.scss";
import NavBar, { NavBarSize } from 'elements/NavBar';
import LeaguePage from './pages/LeaguePage';
import FreeSessionPage from './pages/FreeSessionPage';
import { AppTab, useNavigationContext } from '../context/useNavigation';
import { useDataContext } from 'context/useDataContext';
import InitializeAppScreen from './InitializeAppScreen';
import { isFolderAssettoCorsa } from 'game/assettoCorsa';
import EditorPage from './pages/EditorPage';

function MainScreen () {
    const { loading, settings, isACFolderValid } = useDataContext();
    const { selectedTab, setSelectedTab } = useNavigationContext();

    if (loading) {
        return <div>Loading...</div>
    }

    if (isACFolderValid === false) {
        return <InitializeAppScreen />
    }

    const $content = (() => {
        if (selectedTab === AppTab.FREE_DRIVE) {
            return <FreeSessionPage />;
        }
        else if (selectedTab === AppTab.LEAGUES) {
            return (
                <LeaguePage />
            );
        }
        else if (selectedTab === AppTab.EDITOR) {
            return (
                <EditorPage />
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
                    <NavBar.Item text="editor" index={AppTab.EDITOR} />
                </NavBar>
            </div>
            <div className="cell-content">
                {$content}
            </div>
        </main>
    );
}

export default MainScreen;