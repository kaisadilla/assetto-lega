import PathSelector from 'elements/PathSelector';
import React from 'react';

export interface InitializeAppPageProps {

}

function InitializeAppPage (props: InitializeAppPageProps) {
    return (
        <div className="page page-initialize-app">
            <div className="settings-table">
                <div className="settings-row">
                    <PathSelector
                        label="Assetto corsa folder"
                        value="X:\SteamLibrary\steamapps\common\assettocorsa"
                        setValue={() => {}}
                    />
                </div>
            </div>
        </div>
    );
}

export default InitializeAppPage;