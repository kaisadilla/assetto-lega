import React from 'react';
import "styles/components/main-menu.scss";
import NavBar from './NavBar';

function MainScreen () {
    return (
        <main className="main-menu">
            <NavBar startingIndex={1}>
                <NavBar.Item index={0} text="free session" />
                <NavBar.Item index={1} text="leagues" />
            </NavBar>
        </main>
    );
}

export default MainScreen;