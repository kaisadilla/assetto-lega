export enum AssetFolder {
    leagueBackgrounds = "img/league-bg",
    leagueLogos = "img/league-logos",
    teamLogos = "img/team-logos",
}

export const Assets = {
    [AssetFolder.leagueLogos]: {
        "dtm": require("@assets/img/league-logos/dtm.png"),
        "f1": require("@assets/img/league-logos/f1.png"),
        "f1_1994": require("@assets/img/league-logos/f1_1994.png"),
        "imsa_sportscar": require("@assets/img/league-logos/imsa_sportscar.png"),
        "indycar": require("@assets/img/league-logos/indycar.png"),
        "nascar": require("@assets/img/league-logos/nascar.png"),
        "supercars": require("@assets/img/league-logos/supercars.png"),
        "wec": require("@assets/img/league-logos/wec.png"),
    }
};