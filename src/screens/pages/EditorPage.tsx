import LeagueMenu from 'components/LeagueMenu';
import React from 'react';

export interface EditorPageProps {

}

function EditorPage (props: EditorPageProps) {

    return (
        <div className="editor-page">
            <div className="league-container">
                <LeagueMenu />
            </div>
        </div>
    );
}

export default EditorPage;