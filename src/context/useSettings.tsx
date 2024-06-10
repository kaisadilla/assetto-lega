import { createContext, useContext, useMemo, useState } from "react";
import { TextColor, chooseW3CTextColor } from "utils";

// TODO: use LS_KEYS.
enum Setting {
    Theme = "settings/theme",
    Accent = "settings/accent",
    SearchMode = "settings/search-mode",
    ProfileName = "settings/profile/name",
    ProfileCountry = "settings/profile/country",
    ProfileNumber = "settings/profile/number",
    ProfileInitials = "settings/profile/initials",
}

export const DEFAULT_SETTINGS = {
    [Setting.Theme]: 'dark' as AppTheme,
    [Setting.Accent]: '#a10325',
    [Setting.SearchMode]: 'smart' as SearchMode,
    [Setting.ProfileName]: "Player",
    [Setting.ProfileCountry]: "world",
    [Setting.ProfileNumber]: "00",
    [Setting.ProfileInitials]: "PLA",
};

export type AppTheme = 'dark' | 'light';
export type SearchMode = 'literal' | 'smart';

export interface UserProfile {
    name: string;
    country: string;
    number: string;
    initials: string;
}

export const CSS_VARIABLES = {
    BgColor: "--bg-color",
    TextColor0: "--text-color",
    TextColor1: "--text-color-1",
    TextColor2: "--text-color-2",

    ComponentColorTheme0: "--component-color-theme-0",
    ComponentColorTheme1: "--component-color-theme-1",
    ComponentColorTheme2: "--component-color-theme-2",
    ComponentColorTheme3: "--component-color-theme-3",
    ComponentColorTheme4: "--component-color-theme-4",
    ComponentColorTheme5: "--component-color-theme-5",
    ComponentColorTheme6: "--component-color-theme-6",

    TransparentColorTheme0: "--transparent-color-theme-0",
    TransparentColorTheme1: "--transparent-color-theme-1",
    TransparentColorTheme2: "--transparent-color-theme-2",
    TransparentColorTheme3: "--transparent-color-theme-3",
    TransparentColorTheme4: "--transparent-color-theme-4",

    HighlightTextColor0: "--highlight-text-color",
    HighlightTextColor1: "--highlight-text-color-1",
    HighlightTextColor2: "--highlight-text-color-2",
    HighlightColor0: "--highlight-color",
    HighlightColorL1: "--highlight-color-l1",
    HighlightColorL2: "--highlight-color-l2",
    HighlightColorL3: "--highlight-color-l3",
    HighlightColorD1: "--highlight-color-d1",
    HighlightColorD2: "--highlight-color-d2",
    HighlightColorD3: "--highlight-color-d3",
    HighlightColorD4: "--highlight-color-d4",
    HighlightColorD5: "--highlight-color-d5",

    ComponentColorDark0: "--component-color-dark-0",
    ComponentColorDark1: "--component-color-dark-1",
    ComponentColorDark2: "--component-color-dark-2",
    ComponentColorDark3: "--component-color-dark-3",
    ComponentColorDark4: "--component-color-dark-4",
    ComponentColorDark5: "--component-color-dark-5",
    ComponentColorDark6: "--component-color-dark-6",

    ComponentColorLight0: "--component-color-light-0",
    ComponentColorLight1: "--component-color-light-1",
    ComponentColorLight2: "--component-color-light-2",
    ComponentColorLight3: "--component-color-light-3",
    ComponentColorLight4: "--component-color-light-4",
    ComponentColorLight5: "--component-color-light-5",
    ComponentColorLight6: "--component-color-light-6",

    TransparentColorWhite1: "--transparent-color-white-1",
    TransparentColorWhite2: "--transparent-color-white-2",
    TransparentColorWhite3: "--transparent-color-white-3",
    TransparentColorWhite4: "--transparent-color-white-4",

    TransparentColorBlack1: "--transparent-color-black-1",
    TransparentColorBlack2: "--transparent-color-black-2",
    TransparentColorBlack3: "--transparent-color-black-3",
    TransparentColorBlack4: "--transparent-color-black-4",

    TextColorWhite0: "--text-color-white",
    TextColorWhite1: "--text-color-white-1",
    TextColorWhite2: "--text-color-white-2",
    TextColorBlack0: "--text-color-black",
    TextColorBlack1: "--text-color-black-1",
    TextColorBlack2: "--text-color-black-2",
}

interface ISettingsContext {
    theme: AppTheme;
    accent: string;
    searchMode: SearchMode;
    profile: UserProfile;
    loadSettings: () => void;
    getCssVariableValue: (cssVariable: string) => string;
    getThemeAwareClass: (contentColor: 'white' | 'black') => string | null;
    setTheme: (theme: AppTheme) => void;
    setAccent: (accent: string) => void;
    setSearchMode: (searchMode: SearchMode) => void;
    setProfileField: (field: keyof UserProfile, value: any) => void;
}

const SettingsContext = createContext({} as ISettingsContext);
export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsContextProvider = ({ children }: any) => {
    const [state, setState] = useState({
        theme: DEFAULT_SETTINGS[Setting.Theme],
        accent: DEFAULT_SETTINGS[Setting.Accent],
        searchMode: DEFAULT_SETTINGS[Setting.SearchMode],
        profile: {
            name: DEFAULT_SETTINGS[Setting.ProfileName],
            country: DEFAULT_SETTINGS[Setting.ProfileCountry],
            number: DEFAULT_SETTINGS[Setting.ProfileNumber],
            initials: DEFAULT_SETTINGS[Setting.ProfileInitials],
        }
    } as ISettingsContext);

    const value = useMemo(() => {
        function loadSettings () {
            const theme = loadStringSetting(Setting.Theme, state.theme) as AppTheme;
            const accent = loadStringSetting(Setting.Accent, state.accent);
            const searchMode = loadStringSetting(Setting.SearchMode, state.searchMode) as SearchMode;
            const profile = {
                name: loadStringSetting(Setting.ProfileName, state.profile.name),
                country: loadStringSetting(Setting.ProfileCountry, state.profile.country),
                number: loadStringSetting(Setting.ProfileNumber, state.profile.number),
                initials: loadStringSetting(Setting.ProfileInitials, state.profile.initials),
            };

            setState({
                theme,
                accent,
                searchMode,
                profile,
            } as ISettingsContext);

            applyTheme(theme);
            applyAccent(accent);
        }

        function getCssVariableValue (variable: string) {
            return window.getComputedStyle(document.body).getPropertyValue(variable);
        }

        /**
         * Returns a class name that inverts the content's color if the current
         * theme makes the color of the content hard to see.
         * @param contentColor The predominant color of the content.
         */
        function getThemeAwareClass (contentColor: 'white' | 'black') {
            if (contentColor === 'white' && state.theme === 'light') {
                return "invert-color";
            }
            if (contentColor === 'black' && state.theme === 'dark') {
                return "invert-color";
            }

            return null;
        }

        function setTheme (theme: AppTheme) {
            setSettingState('theme', theme);
            saveSetting(Setting.Theme, theme);

            applyTheme(theme);
        };

        function setAccent (accent: string) {
            setSettingState('accent', accent);
            saveSetting(Setting.Accent, accent);

            applyAccent(accent);
        }

        function setSearchMode (searchMode: SearchMode) {
            setSettingState('searchMode', searchMode);
            saveSetting(Setting.SearchMode, searchMode);
        }

        function setProfileField (field: keyof UserProfile, value: any) {
            setState(prevState => ({
                ...prevState,
                profile: {
                    ...prevState.profile,
                    [field]: value,
                }
            }));
            if (field === 'name') saveSetting(Setting.ProfileName, value);
            if (field === 'country') saveSetting(Setting.ProfileCountry, value);
            if (field === 'number') saveSetting(Setting.ProfileNumber, value);
            if (field === 'initials') saveSetting(Setting.ProfileInitials, value);
        }

        return {
            ...state,
            loadSettings,
            getCssVariableValue,
            getThemeAwareClass,
            setTheme,
            setAccent,
            setSearchMode,
            setProfileField,
        }
        
        function setSettingState (field: keyof ISettingsContext, value: any) {
            setState(prevState => ({
                ...prevState,
                [field]: value,
            }));
        }
    }, [state]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

function loadStringSetting (key: Setting, defaultValue: string) : string {
    const valueStr = localStorage.getItem(key);

    if (valueStr === null) {
        localStorage.setItem(key, defaultValue as string);
        return defaultValue;
    }

    return valueStr;
}

function loadNumberSetting (key: Setting, defaultValue: number) : number {
    const valueStr = localStorage.getItem(key);

    if (valueStr === null) {
        localStorage.setItem(key, defaultValue as any);
        return defaultValue;
    }

    return Number(valueStr);
}

function loadBoolSetting (key: Setting, defaultValue: boolean) : boolean {
    const valueStr = localStorage.getItem(key);

    if (valueStr === null) {
        localStorage.setItem(key, defaultValue as any);
        return defaultValue;
    }

    return valueStr === "true";
}

function saveSetting (key: Setting, value: any) {
    localStorage.setItem(key, value);
}

function applyTheme (theme: AppTheme) {
    console.info(`Applied accent '${theme}'.`);

    if (theme === 'dark') {
        setCss(CSS_VARIABLES.BgColor, asVar(CSS_VARIABLES.ComponentColorDark0));
        setCss(CSS_VARIABLES.TextColor0, asVar(CSS_VARIABLES.TextColorWhite0));
        setCss(CSS_VARIABLES.TextColor1, asVar(CSS_VARIABLES.TextColorWhite1));
        setCss(CSS_VARIABLES.TextColor2, asVar(CSS_VARIABLES.TextColorWhite2));
        setCss(CSS_VARIABLES.ComponentColorTheme0, asVar(CSS_VARIABLES.ComponentColorDark0));
        setCss(CSS_VARIABLES.ComponentColorTheme1, asVar(CSS_VARIABLES.ComponentColorDark1));
        setCss(CSS_VARIABLES.ComponentColorTheme2, asVar(CSS_VARIABLES.ComponentColorDark2));
        setCss(CSS_VARIABLES.ComponentColorTheme3, asVar(CSS_VARIABLES.ComponentColorDark3));
        setCss(CSS_VARIABLES.ComponentColorTheme4, asVar(CSS_VARIABLES.ComponentColorDark4));
        setCss(CSS_VARIABLES.ComponentColorTheme5, asVar(CSS_VARIABLES.ComponentColorDark5));
        setCss(CSS_VARIABLES.ComponentColorTheme6, asVar(CSS_VARIABLES.ComponentColorDark6));
        setCss(CSS_VARIABLES.TransparentColorTheme1, asVar(CSS_VARIABLES.TransparentColorWhite1));
        setCss(CSS_VARIABLES.TransparentColorTheme2, asVar(CSS_VARIABLES.TransparentColorWhite2));
        setCss(CSS_VARIABLES.TransparentColorTheme3, asVar(CSS_VARIABLES.TransparentColorWhite3));
        setCss(CSS_VARIABLES.TransparentColorTheme4, asVar(CSS_VARIABLES.TransparentColorWhite4));
    }
    else if (theme === 'light') {
        setCss(CSS_VARIABLES.BgColor, asVar(CSS_VARIABLES.ComponentColorLight0));
        setCss(CSS_VARIABLES.TextColor0, asVar(CSS_VARIABLES.TextColorBlack0));
        setCss(CSS_VARIABLES.TextColor1, asVar(CSS_VARIABLES.TextColorBlack1));
        setCss(CSS_VARIABLES.TextColor2, asVar(CSS_VARIABLES.TextColorBlack2));
        setCss(CSS_VARIABLES.ComponentColorTheme0, asVar(CSS_VARIABLES.ComponentColorLight0));
        setCss(CSS_VARIABLES.ComponentColorTheme1, asVar(CSS_VARIABLES.ComponentColorLight1));
        setCss(CSS_VARIABLES.ComponentColorTheme2, asVar(CSS_VARIABLES.ComponentColorLight2));
        setCss(CSS_VARIABLES.ComponentColorTheme3, asVar(CSS_VARIABLES.ComponentColorLight3));
        setCss(CSS_VARIABLES.ComponentColorTheme4, asVar(CSS_VARIABLES.ComponentColorLight4));
        setCss(CSS_VARIABLES.ComponentColorTheme5, asVar(CSS_VARIABLES.ComponentColorLight5));
        setCss(CSS_VARIABLES.ComponentColorTheme6, asVar(CSS_VARIABLES.ComponentColorLight6));
        setCss(CSS_VARIABLES.TransparentColorTheme1, asVar(CSS_VARIABLES.TransparentColorBlack1));
        setCss(CSS_VARIABLES.TransparentColorTheme2, asVar(CSS_VARIABLES.TransparentColorBlack2));
        setCss(CSS_VARIABLES.TransparentColorTheme3, asVar(CSS_VARIABLES.TransparentColorBlack3));
        setCss(CSS_VARIABLES.TransparentColorTheme4, asVar(CSS_VARIABLES.TransparentColorBlack4));
    }

}

function applyAccent (accent: string) {
    console.info(`Applied accent '${accent}'.`);

    const col = chooseW3CTextColor(accent);

    setCss(CSS_VARIABLES.HighlightColor0, accent);
    setCss(CSS_VARIABLES.HighlightTextColor0, getCssVariableForTextColor0(col));
    setCss(CSS_VARIABLES.HighlightTextColor1, getCssVariableForTextColor1(col));
    setCss(CSS_VARIABLES.HighlightTextColor2, getCssVariableForTextColor2(col));
}

function setCss (variable: string, value: string) {
    document.documentElement.style.setProperty(variable, value);
}

function asVar (variable: string) {
    return `var(${variable})`;
}

function getCssVariableForTextColor0 (col: TextColor) {
    return col === 'black'
        ? asVar(CSS_VARIABLES.TextColorBlack0)
        : asVar(CSS_VARIABLES.TextColorWhite0)
}

function getCssVariableForTextColor1 (col: TextColor) {
    return col === 'black'
        ? asVar(CSS_VARIABLES.TextColorBlack1)
        : asVar(CSS_VARIABLES.TextColorWhite1)
}

function getCssVariableForTextColor2 (col: TextColor) {
    return col === 'black'
        ? asVar(CSS_VARIABLES.TextColorBlack2)
        : asVar(CSS_VARIABLES.TextColorWhite2)
}