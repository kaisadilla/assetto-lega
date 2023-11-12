import { createContext, useContext, useMemo, useState } from "react";

interface ISettingsContext {
    legaPath: string;
    setLegaPath: (path: string) => void;
}

const SettingsContext = createContext({} as ISettingsContext);
export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsContextProvider = ({ tab, children }: any) => {
    const [state, setState] = useState({
        legaPath: "D:/repos/assetto-lega",
    });

    const value = useMemo(() => {
        const setLegaPath = (path: string) => {
            setState({
                ...state,
                legaPath: path
            })
        };

        return {
            ...state,
            setLegaPath,
        }
    }, [state]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}