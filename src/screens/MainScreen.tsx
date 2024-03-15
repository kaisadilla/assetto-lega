import React, { useEffect, useState } from 'react';
import NavBar, { NavBarSize } from 'elements/NavBar';
import LeaguePage from './pages/LeaguePage';
import FreeSessionPage from './pages/FreeSessionPage';
import { useNavigationContext } from '../context/useNavigation';
import { AppStatus, useDataContext } from 'context/useDataContext';
import InitializeAppScreen from './InitializeAppScreen';
import EditorPage from './pages/EditorPage';
import ReadingAcContentScreen from './ReadingAcContent';
import DragRegion from 'elements/DragRegion';
import { useAcContext } from 'context/useAcContext';
import Button from 'elements/Button';
import MaterialSymbol from 'elements/MaterialSymbol';
import { useSettingsContext } from 'context/useSettings';
import SettingsPage from './pages/SettingsPage';

enum Page {
    FREE_DRIVE,
    LEAGUES,
    EDITOR,
    CONTENT,
    STATS,
    IMPORT,
    SETTINGS,
};

function MainScreen () {
    const [ page, setPage] = useState(Page.FREE_DRIVE);

    const { loadSettings } = useSettingsContext();
    const { appStatus, isACFolderValid, readAcContent, confirmReady } = useDataContext();
    const { loadAcContent, acContentReady } = useAcContext();

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        // TODO: Probably load outside of here altogether.
        if (isACFolderValid && appStatus === AppStatus.ReadingAcContent) {
            readAcContent();
        }
        if (appStatus === AppStatus.ReadyWhenConfirmed) {
            if (acContentReady) {
                confirmReady();
            }
            else {
                loadAcContent();
            }
        }
    }, [appStatus, isACFolderValid, acContentReady]);

    if (appStatus === AppStatus.LoadingData) {
        return <div>Loading...</div>
    }

    if (isACFolderValid === false) {
        return <InitializeAppScreen />
    }

    if (appStatus === AppStatus.ReadingAcContent) {
        return <ReadingAcContentScreen />
    }

    if (appStatus === AppStatus.ReadyWhenConfirmed) {
        return <div>Tidying up...</div>
    }

    const $content = (() => {
        if (page === Page.FREE_DRIVE) {
            return <FreeSessionPage />;
        }
        else if (page === Page.LEAGUES) {
            return (
                <LeaguePage />
            );
        }
        else if (page === Page.EDITOR) {
            return (
                <EditorPage />
            );
        }
        else if (page === Page.SETTINGS) {
            return (
                <SettingsPage />
            );
        }
        else {
            return <></>;
        }
    })();

    return (
        <main className="main-menu">
            <div className="cell-navbar">
                <NavBar size={NavBarSize.BIG} get={page} set={setPage}>
                    <NavBar.Item text="free session" index={Page.FREE_DRIVE} />
                    <NavBar.Item text="leagues" index={Page.LEAGUES} />
                    <NavBar.Item text="editor" index={Page.EDITOR} />
                    <NavBar.Item text="content" index={Page.CONTENT} />
                    <NavBar.Item text="stats" index={Page.STATS} />
                    <NavBar.Item text="import / export" index={Page.IMPORT} />
                    <NavBar.Item text="settings" index={Page.SETTINGS} />
                </NavBar>
                <div className="window-titlebar">
                    <DragRegion className="window-dragbar" />
                    <Button className="titlebar-button">
                        <MaterialSymbol symbol='settings' />
                    </Button>
                </div>
            </div>
            <div className="cell-content">
                {$content}
            </div>
        </main>
    );
}

export default MainScreen;