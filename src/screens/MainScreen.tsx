import React, { useEffect, useState } from 'react';
import NavBar, { NavBarSize } from 'elements/NavBar';
import LeaguePage from './pages/LeaguePage';
import FreeSessionPage from './pages/FreeSessionPage';
import { Page, useNavigationContext } from '../context/useNavigation';
import { AppStatus, useDataContext } from 'context/useDataContext';
import InitializeAppScreen from './InitializeAppScreen';
import { isFolderAssettoCorsa } from 'game/assettoCorsa';
import EditorPage from './pages/EditorPage';
import ReadingAcContentScreen from './ReadingAcContent';
import DragRegion from 'elements/DragRegion';

function MainScreen () {
    const { appStatus, settings, isACFolderValid, readAcContent } = useDataContext();
    const { currentPage: selectedTab, setCurrentPage: setSelectedTab } = useNavigationContext();

    useEffect(() => {
        // TODO: Probably load outside of here altogether.
        if (isACFolderValid && appStatus === AppStatus.ReadingAcContent) {
            readAcContent();
        }
    }, [appStatus, isACFolderValid]);

    if (appStatus === AppStatus.LoadingData) {
        return <div>Loading...</div>
    }

    if (isACFolderValid === false) {
        return <InitializeAppScreen />
    }

    if (appStatus === AppStatus.ReadingAcContent) {
        return <ReadingAcContentScreen />
    }

    const $content = (() => {
        if (selectedTab === Page.FREE_DRIVE) {
            return <FreeSessionPage />;
        }
        else if (selectedTab === Page.LEAGUES) {
            return (
                <LeaguePage />
            );
        }
        else if (selectedTab === Page.EDITOR) {
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
                    <NavBar.Item text="free session" index={Page.FREE_DRIVE} />
                    <NavBar.Item text="leagues" index={Page.LEAGUES} />
                    <NavBar.Item text="editor" index={Page.EDITOR} />
                    <NavBar.Item text="stats" index={Page.STATS} />
                </NavBar>
                <DragRegion />
            </div>
            <div className="cell-content">
                {$content}
            </div>
        </main>
    );
}

export default MainScreen;