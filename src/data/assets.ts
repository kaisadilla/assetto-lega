export enum AssetFolder {
    leagueBackgrounds = "img/league-bg",
    leagueLogos = "img/league-logos",
    teamLogos = "img/team-logos",
}

export const Assets: {[key in AssetFolder]: {[resource: string]: string}} = {
    [AssetFolder.leagueBackgrounds]: {
        "ac-spa": require("@assets/img/league-bg/ac-spa.png"),
    },
    [AssetFolder.leagueLogos]: {
        "dtm": require("@assets/img/league-logos/dtm.png"),
        "f1": require("@assets/img/league-logos/f1.png"),
        "f1-1994": require("@assets/img/league-logos/f1-1994.png"),
        "imsa-sportscar": require("@assets/img/league-logos/imsa-sportscar.png"),
        "indycar": require("@assets/img/league-logos/indycar.png"),
        "nascar": require("@assets/img/league-logos/nascar.png"),
        "supercars": require("@assets/img/league-logos/supercars.png"),
        "wec": require("@assets/img/league-logos/wec.png"),
    },
    [AssetFolder.teamLogos]: {

    }
};