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
        "@f1-1987": require("@assets/img/league-logos/f1-1987.png"),
        "@f1-1994": require("@assets/img/league-logos/f1-1994.png"),
        "@f1-2018": require("@assets/img/league-logos/f1-2018.png"),
        "@imsa-sportscar": require("@assets/img/league-logos/imsa-sportscar.png"),
        "@indycar": require("@assets/img/league-logos/indycar.png"),
        "@nascar": require("@assets/img/league-logos/nascar.png"),
        "@supercars": require("@assets/img/league-logos/supercars.png"),
        "@wec-2012": require("@assets/img/league-logos/wec-2012.png"),
        "@wec-2019": require("@assets/img/league-logos/wec-2019.png"),
        "@wec-2024": require("@assets/img/league-logos/wec-2024.png"),
    },
    [AssetFolder.teamBadges]: {
        "@default": require("@assets/img/team-badges/default.png"),
        "@alfa-romeo": require("@assets/img/team-badges/alfa-romeo.png"),
        "@alpha-tauri": require("@assets/img/team-badges/alpha-tauri.png"),
        "@alpine": require("@assets/img/team-badges/alpine.png"),
        "@arrows": require("@assets/img/team-badges/arrows.png"),
        "@aston-martin": require("@assets/img/team-badges/aston-martin.png"),
        "@bar": require("@assets/img/team-badges/bar.png"),
        "@bmw": require("@assets/img/team-badges/bmw.png"),
        "@cadillac": require("@assets/img/team-badges/cadillac.png"),
        "@caterham": require("@assets/img/team-badges/caterham.png"),
        "@caterham_c": require("@assets/img/team-badges/caterham_c.png"),
        "@ferrari": require("@assets/img/team-badges/ferrari.png"),
        "@floyd-vanwall": require("@assets/img/team-badges/floyd-vanwall.png"),
        "@force-india": require("@assets/img/team-badges/force-india.png"),
        "@glickenhaus": require("@assets/img/team-badges/glickenhaus.png"),
        "@haas": require("@assets/img/team-badges/haas.png"),
        "@hispania": require("@assets/img/team-badges/hispania.png"),
        "@honda": require("@assets/img/team-badges/honda.png"),
        "@hrt": require("@assets/img/team-badges/hrt.png"),
        "@jaguar": require("@assets/img/team-badges/jaguar.png"),
        "@jordan": require("@assets/img/team-badges/jordan.png"),
        "@lotus-f1-1950s": require("@assets/img/team-badges/lotus-f1-1950s.png"),
        "@lotus-f1-2010": require("@assets/img/team-badges/lotus-f1-2010.png"),
        "@lotus-f1-2012": require("@assets/img/team-badges/lotus-f1-2012.png"),
        "@manor": require("@assets/img/team-badges/manor.png"),
        "@marussia": require("@assets/img/team-badges/marussia.png"),
        "@mclaren": require("@assets/img/team-badges/mclaren.png"),
        "@mclaren-2005": require("@assets/img/team-badges/mclaren-2005.png"),
        "@mercedes": require("@assets/img/team-badges/mercedes.png"),
        "@minardi": require("@assets/img/team-badges/minardi.png"),
        "@midland": require("@assets/img/team-badges/midland.png"),
        "@peugeot-2021": require("@assets/img/team-badges/peugeot-2021.png"),
        "@porsche": require("@assets/img/team-badges/porsche.png"),
        "@racing-point": require("@assets/img/team-badges/racing-point.png"),
        "@red-bull": require("@assets/img/team-badges/red-bull.png"),
        "@renault": require("@assets/img/team-badges/renault.png"),
        "@renault-f1-2016": require("@assets/img/team-badges/renault-f1-2016.png"),
        "@renault-f1-2016-white": require("@assets/img/team-badges/renault-f1-2016-white.png"),
        "@sauber": require("@assets/img/team-badges/sauber.png"),
        "@spyker": require("@assets/img/team-badges/spyker.png"),
        "@stewart": require("@assets/img/team-badges/stewart.png"),
        "@super-aguri": require("@assets/img/team-badges/super-aguri.png"),
        "@toro-rosso": require("@assets/img/team-badges/toro-rosso.png"),
        "@toro-rosso-2017-black": require("@assets/img/team-badges/toro-rosso-2017-black.png"),
        "@toro-rosso-2017-white": require("@assets/img/team-badges/toro-rosso-2017-white.png"),
        "@toyota": require("@assets/img/team-badges/toyota.png"),
        "@toyota-f1": require("@assets/img/team-badges/toyota-f1.png"),
        "@virgin": require("@assets/img/team-badges/virgin.png"),
        "@williams": require("@assets/img/team-badges/williams.png"),
        "@williams-2007": require("@assets/img/team-badges/williams-2007.png"),
    },
    [AssetFolder.teamLogos]: {
        "@default": require("@assets/img/team-logos/default.png"),
        "@alfa-romeo": require("@assets/img/team-logos/alfa-romeo.png"),
        "@alpha-tauri": require("@assets/img/team-logos/alpha-tauri.png"),
        "@alpine": require("@assets/img/team-logos/alpine.png"),
        "@arrows": require("@assets/img/team-logos/arrows.png"),
        "@aston-martin": require("@assets/img/team-logos/aston-martin.png"),
        "@bar": require("@assets/img/team-logos/bar.png"),
        "@bmw-williams": require("@assets/img/team-logos/bmw-williams.png"),
        "@cadillac-wec": require("@assets/img/team-logos/cadillac-wec.png"),
        "@caterham": require("@assets/img/team-logos/caterham.png"),
        "@ferrari": require("@assets/img/team-logos/ferrari.png"),
        "@floyd-vanwall": require("@assets/img/team-logos/floyd-vanwall.png"),
        "@force-india": require("@assets/img/team-logos/force-india.png"),
        "@glickenhaus": require("@assets/img/team-logos/glickenhaus.png"),
        "@haas": require("@assets/img/team-logos/haas.png"),
        "@hispania": require("@assets/img/team-logos/hispania.png"),
        "@honda": require("@assets/img/team-logos/honda.png"),
        "@honda-f1": require("@assets/img/team-logos/honda-f1.png"),
        "@hrt": require("@assets/img/team-logos/hrt.png"),
        "@jaguar": require("@assets/img/team-logos/jaguar.png"),
        "@jordan": require("@assets/img/team-logos/jordan.png"),
        "@lotus-f1-1950s": require("@assets/img/team-logos/lotus-f1-1950s.png"),
        "@lotus-f1-2010": require("@assets/img/team-logos/lotus-f1-2010.png"),
        "@lotus-f1-2012": require("@assets/img/team-logos/lotus-f1-2012.png"),
        "@manor": require("@assets/img/team-logos/manor.png"),
        "@marussia": require("@assets/img/team-logos/marussia.png"),
        "@mclaren": require("@assets/img/team-logos/mclaren.png"),
        "@mclaren-2006": require("@assets/img/team-logos/mclaren-2006.png"),
        "@mercedes": require("@assets/img/team-logos/mercedes.png"),
        "@minardi-2000s": require("@assets/img/team-logos/minardi-2000s.png"),
        "@midland": require("@assets/img/team-logos/midland.png"),
        "@peugeot-sport": require("@assets/img/team-logos/peugeot-sport.png"),
        "@porsche-penske": require("@assets/img/team-logos/porsche-penske.png"),
        "@proton-competition": require("@assets/img/team-logos/proton-competition.png"),
        "@racing-point": require("@assets/img/team-logos/racing-point.png"),
        "@red-bull": require("@assets/img/team-logos/red-bull.png"),
        "@renault-2005": require("@assets/img/team-logos/renault-2005.png"),
        "@renault-f1-2016": require("@assets/img/team-logos/renault-f1-2016.png"),
        "@sauber": require("@assets/img/team-logos/sauber.png"),
        "@spyker": require("@assets/img/team-logos/spyker.png"),
        "@stewart": require("@assets/img/team-logos/stewart.png"),
        "@super-aguri": require("@assets/img/team-logos/super-aguri.png"),
        "@team-jota-hertz": require("@assets/img/team-logos/team-jota-hertz.png"),
        "@toro-rosso": require("@assets/img/team-logos/toro-rosso.png"),
        "@toro-rosso-2017": require("@assets/img/team-logos/toro-rosso-2017.png"),
        "@toyota": require("@assets/img/team-logos/toyota.png"),
        "@toyota-f1": require("@assets/img/team-logos/toyota-f1.png"),
        "@toyota-gazoo": require("@assets/img/team-logos/toyota-gazoo.png"),
        "@virgin": require("@assets/img/team-logos/virgin.png"),
        "@williams": require("@assets/img/team-logos/williams.png"),
        "@williams-2007": require("@assets/img/team-logos/williams-2007.png"),
    }
};