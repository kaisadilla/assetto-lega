import { createContext, useContext, useMemo, useState } from "react";

interface HorizontalNavBarContextType {
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
}

const HorizontalNavBarContext = createContext<HorizontalNavBarContextType>({} as HorizontalNavBarContextType);
export const useHorizontalNavBarContext = () => useContext(HorizontalNavBarContext);

export const HorizontalNavBarContextProvider = ({ children }: any) => {
    const [state, setState] = useState({
        selectedIndex: 0
    });

    const value = useMemo(() => {
        const setSelectedIndex = (index: number) => {
            setState({
                ...state,
                selectedIndex: index
            })
        };

        return {
            ...state,
            setSelectedIndex,
        }
    }, [state]);

    return (
        <HorizontalNavBarContext.Provider value={value}>
            {children}
        </HorizontalNavBarContext.Provider>
    );
}