import { createContext, useContext, useMemo, useState } from "react";

interface NavBarContextType {
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
}

const NavBarContext = createContext<NavBarContextType>({} as NavBarContextType);
export const useNavBarContext = () => useContext(NavBarContext);

export const NavBarContextProvider = ({ index, children }: any) => {
    const [state, setState] = useState({
        selectedIndex: index ?? 0
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
        <NavBarContext.Provider value={value}>
            {children}
        </NavBarContext.Provider>
    );
}