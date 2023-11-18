import { useDataContext } from 'context/useDataContext';
import Button from 'elements/Button';
import PathSelector, { PathSelectorStatus } from 'elements/PathSelector';
import { isFolderAssettoCorsa } from 'game/assettoCorsa';
import Ipc from 'main/ipc/ipcRenderer';
import React, { useEffect, useState } from 'react';

export interface InitializeAppPageProps {

}

function InitializeAppPage (props: InitializeAppPageProps) {
    const { settings, updateSettings } = useDataContext();

    const [path, setPath] = useState(settings.assettoCorsaFolder ?? "");
    const [pathStatus, setPathStatus] = useState<PathSelectorStatus>({
        isValid: true,
    });

    useEffect(() => {
        checkPath();
    }, [path]);

    return (
        <div className="page page-initialize-app">
            <div className="settings-table">
                <div className="settings-row">
                    <PathSelector
                        mode="folder"
                        label="Assetto corsa folder"
                        value={path}
                        status={pathStatus}
                        onChange={handleAssettoCorsaPath}
                    />
                </div>

                <div className="settings-buttons">
                    <Button
                        onClick={handleSave}
                        disabled={pathStatus.isValid === false}
                    >
                        Save and continue
                    </Button>
                </div>
            </div>
        </div>
    );

    async function handleAssettoCorsaPath (path: string) {
        setPath(path);
    }

    async function handleSave () {
        updateSettings({
            ...settings,
            assettoCorsaFolder: path,
        })
    }

    async function checkPath () {
        // if there is no path.
        if (!path || path === "") {
            setPathStatus({
                isValid: false,
                message: "No folder selected.",
            })
            return;
        }

        const validPath = await Ipc.verifyPath(path);

        // if the path is invalid.
        if (validPath === false) {
            setPathStatus({
                isValid: false,
                message: "The given directory does not exist.",
            })
            return;
        }

        // if the path contains expected AC files.
        if (await isFolderAssettoCorsa(path) === false) {
            setPathStatus({
                isValid: false,
                message: "The given directory does not look like " +
                    "Assetto Corsa's root directory.",
            })
            return;
        }

        // the path is valid.
        setPathStatus({ isValid: true });
    }
}

export default InitializeAppPage;