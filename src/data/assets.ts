export enum AssetFolder {
    leagueBackgrounds = "img/league-bg",
    leagueLogos = "img/league-logos",
    teamBadges = "img/team-badges",
    teamLogos = "img/team-logos",
}

// All asset names must start with "@", since that character is used to identify
// default assets.
export const Assets: {[key in AssetFolder]: {[resource: string]: string}} = {
    [AssetFolder.leagueBackgrounds]: {
        "@ac-spa": require("@assets/img/league-bg/ac-spa.png"),
    },
    [AssetFolder.leagueLogos]: {
        "@dtm": require("@assets/img/league-logos/dtm.png"),
        "@f1": require("@assets/img/league-logos/f1.png"),
        "@f1-1994": require("@assets/img/league-logos/f1-1994.png"),
        "@imsa-sportscar": require("@assets/img/league-logos/imsa-sportscar.png"),
        "@indycar": require("@assets/img/league-logos/indycar.png"),
        "@nascar": require("@assets/img/league-logos/nascar.png"),
        "@supercars": require("@assets/img/league-logos/supercars.png"),
        "@wec": require("@assets/img/league-logos/wec.png"),
    },
    [AssetFolder.teamBadges]: {
        "@alfa-romeo": require("@assets/img/team-badges/alfa-romeo.png"),
        "@alpha-tauri": require("@assets/img/team-badges/alpha-tauri.png"),
        "@alpine": require("@assets/img/team-badges/alpine.png"),
        "@aston-martin": require("@assets/img/team-badges/aston-martin.png"),
        "@ferrari": require("@assets/img/team-badges/ferrari.png"),
        "@haas": require("@assets/img/team-badges/haas.png"),
        "@mclaren": require("@assets/img/team-badges/mclaren.png"),
        "@mercedes": require("@assets/img/team-badges/mercedes.png"),
        "@red-bull": require("@assets/img/team-badges/red-bull.png"),
        "@williams": require("@assets/img/team-badges/williams.png"),
    },
    [AssetFolder.teamLogos]: {
        "@alfa-romeo": require("@assets/img/team-logos/alfa-romeo.png"),
        "@alpha-tauri": require("@assets/img/team-logos/alpha-tauri.png"),
        "@alpine": require("@assets/img/team-logos/alpine.png"),
        "@aston-martin": require("@assets/img/team-logos/aston-martin.png"),
        "@ferrari": require("@assets/img/team-logos/ferrari.png"),
        "@haas": require("@assets/img/team-logos/haas.png"),
        "@mclaren": require("@assets/img/team-logos/mclaren.png"),
        "@mercedes": require("@assets/img/team-logos/mercedes.png"),
        "@red-bull": require("@assets/img/team-logos/red-bull.png"),
        "@williams": require("@assets/img/team-logos/williams.png"),
    }
};