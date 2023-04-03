import React from 'react';
import "styles/components/main-menu.scss";
import HorizontalNavBar from './HorizontalNavBar';

function MainScreen () {
    return (
        <main className="main-menu">
            <HorizontalNavBar>
                <HorizontalNavBar.Item index={0} text="free session" />
                <HorizontalNavBar.Item index={1} text="leagues" />
            </HorizontalNavBar>
        </main>
    );
}

export default MainScreen;