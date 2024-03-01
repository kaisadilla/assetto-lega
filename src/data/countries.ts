export interface Country {
    displayName: string;
    category: CountryCategory;
    isRegion?: boolean;
    isPseudo?: boolean;
    flag: string;
    assettoCorsa: CorsaCountry | null;
}

export enum CountryCategory {
    regions = "Regions",
    europe = "Europe",
    americas = "Americas",
    oceania = "Oceania",
    asia = "Asia",
    middleEast = "Middle East",
    africa = "Africa",
    caribbean = "Caribbean",
    subnational = "Sub-national",
    unrecognized = "Unrecognized",
    historical = "Historical",
}

interface CorsaCountry {
    name: string;
    code: string;
    isMod?: boolean;
}

let initialized = false;

export const Countries: { [key: string]: Country } = {
    "assetto_corsa": {
        "displayName": "Assetto Corsa",
        "category": CountryCategory.regions,
        "isRegion": true,
        "flag": require("@assets/flags/assetto_corsa.png"),
        "assettoCorsa": {
            "name": "Assetto Corsa",
            "code": "AC",
        },
    },
    "eu": {
        "displayName": "Europe",
        "category": CountryCategory.regions,
        "isRegion": true,
        "flag": require("@assets/flags/eu.png"),
        "assettoCorsa": null,
    },
    "world": {
        "displayName": "World",
        "category": CountryCategory.regions,
        "isRegion": true,
        "flag": require("@assets/flags/world.png"),
        "assettoCorsa": null,
    },
    "afghanistan": {
        "displayName": "Afghanistan",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/afghanistan.png"),
        "assettoCorsa": {
            "name": "Afghanistan",
            "code": "AFG",
        },
    },
    "albania": {
        "displayName": "Albania",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/albania.png"),
        "assettoCorsa": {
            "name": "Albania",
            "code": "ALB",
        },
    },
    "algeria": {
        "displayName": "Algeria",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/algeria.png"),
        "assettoCorsa": {
            "name": "Algeria",
            "code": "DZA",
        },
    },
    "andorra": {
        "displayName": "Andorra",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/andorra.png"),
        "assettoCorsa": {
            "name": "Andorra",
            "code": "AND",
        },
    },
    "angola": {
        "displayName": "Angola",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/angola.png"),
        "assettoCorsa": {
            "name": "Angola",
            "code": "AGO",
        },
    },
    "antigua_and_barbuda": {
        "displayName": "Antigua and Barbuda",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/antigua_and_barbuda.png"),
        "assettoCorsa": {
            "name": "Antigua and Barbuda",
            "code": "ATG",
        },
    },
    "argentina": {
        "displayName": "Argentina",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/argentina.png"),
        "assettoCorsa": {
            "name": "Argentina",
            "code": "ARG",
        },
    },
    "armenia": {
        "displayName": "Armenia",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/armenia.png"),
        "assettoCorsa": {
            "name": "Armenia",
            "code": "ARM",
        },
    },
    "australia": {
        "displayName": "Australia",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/australia.png"),
        "assettoCorsa": {
            "name": "Australia",
            "code": "AUS",
        },
    },
    "austria": {
        "displayName": "Austria",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/austria.png"),
        "assettoCorsa": {
            "name": "Austria",
            "code": "AUT",
        },
    },
    "azerbaijan": {
        "displayName": "Azerbaijan",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/azerbaijan.png"),
        "assettoCorsa": {
            "name": "Azerbaijan",
            "code": "AZE",
        },
    },
    "bahamas": {
        "displayName": "The Bahamas",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/bahamas.png"),
        "assettoCorsa": {
            "name": "Bahamas",
            "code": "BHS",
        },
    },
    "bahrain": {
        "displayName": "Bahrain",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/bahrain.png"),
        "assettoCorsa": {
            "name": "Bahrain",
            "code": "BHR",
        },
    },
    "bangladesh": {
        "displayName": "Bangladesh",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/bangladesh.png"),
        "assettoCorsa": {
            "name": "Bangladesh",
            "code": "BGD",
        },
    },
    "barbados": {
        "displayName": "Barbados",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/barbados.png"),
        "assettoCorsa": {
            "name": "Barbados",
            "code": "BRB",
        },
    },
    "belarus": {
        "displayName": "Belarus",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/belarus.png"),
        "assettoCorsa": {
            "name": "Belarus",
            "code": "BLR",
        },
    },
    "belgium": {
        "displayName": "Belgium",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/belgium.png"),
        "assettoCorsa": {
            "name": "Belgium",
            "code": "BEL",
        },
    },
    "belize": {
        "displayName": "Belize",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/belize.png"),
        "assettoCorsa": {
            "name": "Belize",
            "code": "BLZ",
        },
    },
    "benin": {
        "displayName": "Benin",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/benin.png"),
        "assettoCorsa": {
            "name": "Benin",
            "code": "BEN",
        },
    },
    "bhutan": {
        "displayName": "Bhutan",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/bhutan.png"),
        "assettoCorsa": {
            "name": "Bhutan",
            "code": "BTN",
        },
    },
    "bolivia": {
        "displayName": "Bolivia",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/bolivia.png"),
        "assettoCorsa": {
            "name": "Bolivia",
            "code": "BOL",
        },
    },
    "bosnia": {
        "displayName": "Bosnia and Herzegovina",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/bosnia.png"),
        "assettoCorsa": {
            "name": "Bosnia and Herzegovina",
            "code": "BIH",
        },
    },
    "botswana": {
        "displayName": "Botswana",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/botswana.png"),
        "assettoCorsa": {
            "name": "Botswana",
            "code": "BWA",
        },
    },
    "brazil": {
        "displayName": "Brazil",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/brazil.png"),
        "assettoCorsa": {
            "name": "Brazil",
            "code": "BRA",
        },
    },
    "brunei": {
        "displayName": "Brunei",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/brunei.png"),
        "assettoCorsa": {
            "name": "Brunei",
            "code": "BRN",
        },
    },
    "bulgaria": {
        "displayName": "Bulgaria",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/bulgaria.png"),
        "assettoCorsa": {
            "name": "Bulgaria",
            "code": "BGR",
        },
    },
    "burkina_faso": {
        "displayName": "Burkina Faso",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/burkina_faso.png"),
        "assettoCorsa": {
            "name": "Burkina Faso",
            "code": "BFA",
        },
    },
    "burundi": {
        "displayName": "Burundi",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/burundi.png"),
        "assettoCorsa": {
            "name": "Burundi",
            "code": "BDI",
        },
    },
    "cambodia": {
        "displayName": "Cambodia",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/cambodia.png"),
        "assettoCorsa": {
            "name": "Cambodia",
            "code": "KHM",
        },
    },
    "cameroon": {
        "displayName": "Cameroon",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/cameroon.png"),
        "assettoCorsa": {
            "name": "Cameroon",
            "code": "CMR",
        },
    },
    "canada": {
        "displayName": "Canada",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/canada.png"),
        "assettoCorsa": {
            "name": "Canada",
            "code": "CAN",
        },
    },
    "cape_verde": {
        "displayName": "Cape Verde",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/cape_verde.png"),
        "assettoCorsa": {
            "name": "Cape Verde",
            "code": "CPV",
        },
    },
    "central_african_republic": {
        "displayName": "Central Africa R.",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/central_african_republic.png"),
        "assettoCorsa": {
            "name": "Central African Republic",
            "code": "CAF",
        },
    },
    "chad": {
        "displayName": "Chad",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/chad.png"),
        "assettoCorsa": {
            "name": "Chad",
            "code": "TCH",
        },
    },
    "chile": {
        "displayName": "Chile",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/chile.png"),
        "assettoCorsa": {
            "name": "Chile",
            "code": "CHL",
        },
    },
    "china": {
        "displayName": "China",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/china.png"),
        "assettoCorsa": {
            "name": "China",
            "code": "CHN",
        },
    },
    "colombia": {
        "displayName": "Colombia",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/colombia.png"),
        "assettoCorsa": {
            "name": "Colombia",
            "code": "COL",
        },
    },
    "comoros": {
        "displayName": "Comoros",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/comoros.png"),
        "assettoCorsa": {
            "name": "Comoros",
            "code": "COM",
        },
    },
    "congo_kinsasha": {
        "displayName": "Congo, Dem. Rep.",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/congo_kinsasha.png"),
        "assettoCorsa": {
            "name": "Congo",
            "code": "COD",
        },
    },
    "congo_brazzaville": {
        "displayName": "Congo, Rep.",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/congo_brazzaville.png"),
        "assettoCorsa": {
            "name": "Congo, Rep.",
            "code": "COG",
        },
    },
    "cook_islands": {
        "displayName": "Cook Islands",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/cook_islands.png"),
        "assettoCorsa": {
            "name": "Cook Islands",
            "code": "COK",
        },
    },
    "costa_rica": {
        "displayName": "Costa Rica",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/costa_rica.png"),
        "assettoCorsa": {
            "name": "Costa Rica",
            "code": "CRI",
        },
    },
    "croatia": {
        "displayName": "Croatia",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/croatia.png"),
        "assettoCorsa": {
            "name": "Croatia",
            "code": "HRV",
        },
    },
    "cuba": {
        "displayName": "Cuba",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/cuba.png"),
        "assettoCorsa": {
            "name": "Cuba",
            "code": "CUB",
        },
    },
    "cyprus": {
        "displayName": "Cyprus",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/cyprus.png"),
        "assettoCorsa": {
            "name": "Cyprus",
            "code": "CYP",
        },
    },
    "czech_republic": {
        "displayName": "Czech Republic",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/czech_republic.png"),
        "assettoCorsa": {
            "name": "Czech Republic",
            "code": "CZE",
        },
    },
    "denmark": {
        "displayName": "Denmark",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/denmark.png"),
        "assettoCorsa": {
            "name": "Denmark",
            "code": "DNK",
        },
    },
    "djibouti": {
        "displayName": "Djibouti",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/djibouti.png"),
        "assettoCorsa": {
            "name": "Djibouti",
            "code": "DJI",
        },
    },
    "dominica": {
        "displayName": "Dominica",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/dominica.png"),
        "assettoCorsa": {
            "name": "Dominica",
            "code": "DMA",
        },
    },
    "dominican_republic": {
        "displayName": "Dominican Republic",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/dominican_republic.png"),
        "assettoCorsa": {
            "name": "Dominican Republic",
            "code": "DOM",
        },
    },
    "east_timor": {
        "displayName": "Timor-Leste",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/east_timor.png"),
        "assettoCorsa": {
            "name": "Timor-Leste",
            "code": "TLS",
        },
    },
    "ecuador": {
        "displayName": "Ecuador",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/ecuador.png"),
        "assettoCorsa": {
            "name": "Ecuador",
            "code": "ECU",
        },
    },
    "egypt": {
        "displayName": "Egypt",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/egypt.png"),
        "assettoCorsa": {
            "name": "Egypt",
            "code": "EGY",
        },
    },
    "el_salvador": {
        "displayName": "El Salvador",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/el_salvador.png"),
        "assettoCorsa": {
            "name": "El Salvador",
            "code": "SLV",
        },
    },
    "equatorial_guinea": {
        "displayName": "Equatorial Guinea",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/equatorial_guinea.png"),
        "assettoCorsa": {
            "name": "Equatorial Guinea",
            "code": "GNQ",
        },
    },
    "eritrea": {
        "displayName": "Eritrea",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/eritrea.png"),
        "assettoCorsa": {
            "name": "Eritrea",
            "code": "ERI",
        },
    },
    "estonia": {
        "displayName": "Estonia",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/estonia.png"),
        "assettoCorsa": {
            "name": "Estonia",
            "code": "EST",
        },
    },
    "eswatini": {
        "displayName": "Eswatini",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/eswatini.png"),
        "assettoCorsa": {
            "name": "Swaziland",
            "code": "SWZ",
        },
    },
    "ethiopia": {
        "displayName": "Ethiopia",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/ethiopia.png"),
        "assettoCorsa": {
            "name": "Ethiopia",
            "code": "ETH",
        },
    },
    "fiji": {
        "displayName": "Fiji",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/fiji.png"),
        "assettoCorsa": {
            "name": "Fiji",
            "code": "FJI",
        },
    },
    "finland": {
        "displayName": "Finland",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/finland.png"),
        "assettoCorsa": {
            "name": "Finland",
            "code": "FIN",
        },
    },
    "france": {
        "displayName": "France",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/france.png"),
        "assettoCorsa": {
            "name": "France",
            "code": "FRA",
        },
    },
    "gabon": {
        "displayName": "Gabon",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/gabon.png"),
        "assettoCorsa": {
            "name": "Gabon",
            "code": "GAB",
        },
    },
    "gambia": {
        "displayName": "The Gambia",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/gambia.png"),
        "assettoCorsa": {
            "name": "Gambia",
            "code": "GMB",
        },
    },
    "georgia": {
        "displayName": "Georgia",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/georgia.png"),
        "assettoCorsa": {
            "name": "Georgia",
            "code": "GEO",
        },
    },
    "germany": {
        "displayName": "Germany",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/germany.png"),
        "assettoCorsa": {
            "name": "Germany",
            "code": "DEU",
        },
    },
    "ghana": {
        "displayName": "Ghana",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/ghana.png"),
        "assettoCorsa": {
            "name": "Ghana",
            "code": "GHA",
        },
    },
    "greece": {
        "displayName": "Greece",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/greece.png"),
        "assettoCorsa": {
            "name": "Greece",
            "code": "GRC",
        },
    },
    "grenada": {
        "displayName": "Grenada",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/grenada.png"),
        "assettoCorsa": {
            "name": "Grenada",
            "code": "GRD",
        },
    },
    "guatemala": {
        "displayName": "Guatemala",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/guatemala.png"),
        "assettoCorsa": {
            "name": "Guatemala",
            "code": "GTM",
        },
    },
    "guinea": {
        "displayName": "Guinea",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/guinea.png"),
        "assettoCorsa": {
            "name": "Guinea",
            "code": "GIN",
        },
    },
    "guinea_bissau": {
        "displayName": "Guinea-Bissau",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/guinea_bissau.png"),
        "assettoCorsa": {
            "name": "Guinea-Bissau",
            "code": "GNB",
        },
    },
    "guyana": {
        "displayName": "Guyana",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/guyana.png"),
        "assettoCorsa": {
            "name": "Guyana",
            "code": "GUY",
        },
    },
    "haiti": {
        "displayName": "Haiti",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/haiti.png"),
        "assettoCorsa": {
            "name": "Haiti",
            "code": "HTI",
        },
    },
    "honduras": {
        "displayName": "Honduras",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/honduras.png"),
        "assettoCorsa": {
            "name": "Honduras",
            "code": "HND",
        },
    },
    "hungary": {
        "displayName": "Hungary",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/hungary.png"),
        "assettoCorsa": {
            "name": "Hungary",
            "code": "HUN",
        },
    },
    "iceland": {
        "displayName": "Iceland",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/iceland.png"),
        "assettoCorsa": {
            "name": "Iceland",
            "code": "ISL",
        },
    },
    "india": {
        "displayName": "India",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/india.png"),
        "assettoCorsa": {
            "name": "India",
            "code": "IND",
        },
    },
    "indonesia": {
        "displayName": "Indonesia",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/indonesia.png"),
        "assettoCorsa": {
            "name": "Indonesia",
            "code": "IDN",
        },
    },
    "iran": {
        "displayName": "Iran",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/iran.png"),
        "assettoCorsa": {
            "name": "Iran",
            "code": "IRN",
        },
    },
    "iraq": {
        "displayName": "Iraq",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/iraq.png"),
        "assettoCorsa": {
            "name": "Iraq",
            "code": "IRQ",
        },
    },
    "ireland": {
        "displayName": "Ireland",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/ireland.png"),
        "assettoCorsa": {
            "name": "Ireland",
            "code": "IRL",
        },
    },
    "israel": {
        "displayName": "Israel",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/israel.png"),
        "assettoCorsa": {
            "name": "Israel",
            "code": "ISR",
        },
    },
    "italy": {
        "displayName": "Italy",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/italy.png"),
        "assettoCorsa": {
            "name": "Italy",
            "code": "ITA",
        },
    },
    "ivory_coast": {
        "displayName": "Côte d'Ivoire",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/ivory_coast.png"),
        "assettoCorsa": {
            "name": "Côte d’Ivoire",
            "code": "CIV",
        },
    },
    "jamaica": {
        "displayName": "Jamaica",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/jamaica.png"),
        "assettoCorsa": {
            "name": "Jamaica",
            "code": "JAM",
        },
    },
    "japan": {
        "displayName": "Japan",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/japan.png"),
        "assettoCorsa": {
            "name": "Japan",
            "code": "JPN",
        },
    },
    "jordan": {
        "displayName": "Jordan",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/jordan.png"),
        "assettoCorsa": {
            "name": "Jordan",
            "code": "JOR",
        },
    },
    "kazakhstan": {
        "displayName": "Kazakhstan",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/kazakhstan.png"),
        "assettoCorsa": {
            "name": "Kazakhstan",
            "code": "KAZ",
        },
    },
    "kenya": {
        "displayName": "Kenya",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/kenya.png"),
        "assettoCorsa": {
            "name": "Kenya",
            "code": "KEN",
        },
    },
    "kiribati": {
        "displayName": "Kiribati",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/kiribati.png"),
        "assettoCorsa": {
            "name": "Kiribati",
            "code": "KIR",
        },
    },
    "kuwait": {
        "displayName": "Kuwait",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/kuwait.png"),
        "assettoCorsa": {
            "name": "Kuwait",
            "code": "KWT",
        },
    },
    "kyrgyzstan": {
        "displayName": "Kyrgyzstan",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/kyrgyzstan.png"),
        "assettoCorsa": {
            "name": "Kyrgyzstan",
            "code": "KGZ",
        },
    },
    "laos": {
        "displayName": "Laos",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/laos.png"),
        "assettoCorsa": {
            "name": "Laos",
            "code": "LAO",
        },
    },
    "latvia": {
        "displayName": "Latvia",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/latvia.png"),
        "assettoCorsa": {
            "name": "Latvia",
            "code": "LVA",
        },
    },
    "lebanon": {
        "displayName": "Lebanon",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/lebanon.png"),
        "assettoCorsa": {
            "name": "Lebanon",
            "code": "LBN",
        },
    },
    "lesotho": {
        "displayName": "Lesotho",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/lesotho.png"),
        "assettoCorsa": {
            "name": "Lesotho",
            "code": "LSO",
        },
    },
    "liberia": {
        "displayName": "Liberia",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/liberia.png"),
        "assettoCorsa": {
            "name": "Liberia",
            "code": "LBR",
        },
    },
    "libya": {
        "displayName": "Libya",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/libya.png"),
        "assettoCorsa": {
            "name": "Libya",
            "code": "LBY",
            "isMod": true,
        },
    },
    "liechtenstein": {
        "displayName": "Liechtenstein",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/liechtenstein.png"),
        "assettoCorsa": {
            "name": "Liechtenstein",
            "code": "LIE",
        },
    },
    "lithuania": {
        "displayName": "Lithuania",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/lithuania.png"),
        "assettoCorsa": {
            "name": "Lithuania",
            "code": "LTU",
        },
    },
    "luxembourg": {
        "displayName": "Luxembourg",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/luxembourg.png"),
        "assettoCorsa": {
            "name": "Luxembourg",
            "code": "LUX",
        },
    },
    "madagascar": {
        "displayName": "Madagascar",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/madagascar.png"),
        "assettoCorsa": {
            "name": "Madagascar",
            "code": "MDG",
        },
    },
    "malawi": {
        "displayName": "Malawi",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/malawi.png"),
        "assettoCorsa": {
            "name": "Malawi",
            "code": "MWI",
        },
    },
    "malaysia": {
        "displayName": "Malaysia",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/malaysia.png"),
        "assettoCorsa": {
            "name": "Malaysia",
            "code": "MYS",
        },
    },
    "maldives": {
        "displayName": "Maldives",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/maldives.png"),
        "assettoCorsa": {
            "name": "Maldives",
            "code": "MDV",
        },
    },
    "mali": {
        "displayName": "Mali",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/mali.png"),
        "assettoCorsa": {
            "name": "Mali",
            "code": "MLI",
        },
    },
    "malta": {
        "displayName": "Malta",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/malta.png"),
        "assettoCorsa": {
            "name": "Malta",
            "code": "MLT",
        },
    },
    "marshall_islands": {
        "displayName": "Marshall Islands",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/marshall_islands.png"),
        "assettoCorsa": {
            "name": "Marshall Islands",
            "code": "MHL",
        },
    },
    "mauritania": {
        "displayName": "Mauritania",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/mauritania.png"),
        "assettoCorsa": {
            "name": "Mauritania",
            "code": "MRT",
        },
    },
    "mauritius": {
        "displayName": "Mauritius",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/mauritius.png"),
        "assettoCorsa": {
            "name": "Mauritius",
            "code": "MUS",
        },
    },
    "mexico": {
        "displayName": "Mexico",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/mexico.png"),
        "assettoCorsa": {
            "name": "Mexico",
            "code": "MEX",
        },
    },
    "micronesia": {
        "displayName": "Micronesia",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/micronesia.png"),
        "assettoCorsa": {
            "name": "Micronesia",
            "code": "FSM",
        },
    },
    "moldova": {
        "displayName": "Moldova",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/moldova.png"),
        "assettoCorsa": {
            "name": "Moldova",
            "code": "MDA",
        },
    },
    "monaco": {
        "displayName": "Monaco",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/monaco.png"),
        "assettoCorsa": {
            "name": "Monaco",
            "code": "MCO",
        },
    },
    "mongolia": {
        "displayName": "Mongolia",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/mongolia.png"),
        "assettoCorsa": {
            "name": "Mongolia",
            "code": "MNG",
        },
    },
    "montenegro": {
        "displayName": "Montenegro",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/montenegro.png"),
        "assettoCorsa": {
            "name": "Montenegro",
            "code": "MNE",
        },
    },
    "morocco": {
        "displayName": "Morocco",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/morocco.png"),
        "assettoCorsa": {
            "name": "Morocco",
            "code": "MAR",
        },
    },
    "mozambique": {
        "displayName": "Mozambique",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/mozambique.png"),
        "assettoCorsa": {
            "name": "Mozambique",
            "code": "MOZ",
        },
    },
    "myanmar": {
        "displayName": "Myanmar",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/myanmar.png"),
        "assettoCorsa": {
            "name": "Burma",
            "code": "MMR",
        },
    },
    "namibia": {
        "displayName": "Namibia",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/namibia.png"),
        "assettoCorsa": {
            "name": "Namibia",
            "code": "NAM",
        },
    },
    "nauru": {
        "displayName": "Nauru",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/nauru.png"),
        "assettoCorsa": {
            "name": "Nauru",
            "code": "NRU",
        },
    },
    "nepal": {
        "displayName": "Nepal",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/nepal.png"),
        "assettoCorsa": {
            "name": "Nepal",
            "code": "NPL",
        },
    },
    "netherlands": {
        "displayName": "Netherlands",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/netherlands.png"),
        "assettoCorsa": {
            "name": "Netherlands",
            "code": "NLD",
        },
    },
    "new_zealand": {
        "displayName": "New Zealand",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/new_zealand.png"),
        "assettoCorsa": {
            "name": "New Zealand",
            "code": "NZL",
        },
    },
    "nicaragua": {
        "displayName": "Nicaragua",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/nicaragua.png"),
        "assettoCorsa": {
            "name": "Nicaragua",
            "code": "NIC",
        },
    },
    "niger": {
        "displayName": "Niger",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/niger.png"),
        "assettoCorsa": {
            "name": "Niger",
            "code": "NER",
        },
    },
    "nigeria": {
        "displayName": "Nigeria",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/nigeria.png"),
        "assettoCorsa": {
            "name": "Nigeria",
            "code": "NGA",
        },
    },
    "niue": {
        "displayName": "Niue",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/niue.png"),
        "assettoCorsa": {
            "name": "Niue",
            "code": "NIU",
            "isMod": true,
        },
    },
    "north_korea": {
        "displayName": "North Korea",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/north_korea.png"),
        "assettoCorsa": {
            "name": "North Korea",
            "code": "PRK",
            "isMod": true,
        },
    },
    "north_macedonia": {
        "displayName": "North Macedonia",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/north_macedonia.png"),
        "assettoCorsa": {
            "name": "Macedonia",
            "code": "MKD",
        },
    },
    "norway": {
        "displayName": "Norway",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/norway.png"),
        "assettoCorsa": {
            "name": "Norway",
            "code": "NOR",
        },
    },
    "oman": {
        "displayName": "Oman",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/oman.png"),
        "assettoCorsa": {
            "name": "Oman",
            "code": "OMN",
        },
    },
    "pakistan": {
        "displayName": "Pakistan",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/pakistan.png"),
        "assettoCorsa": {
            "name": "Pakistan",
            "code": "PAK",
        },
    },
    "palau": {
        "displayName": "Palau",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/palau.png"),
        "assettoCorsa": {
            "name": "Palau",
            "code": "PLW",
        },
    },
    "palestine": {
        "displayName": "Palestine",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/palestine.png"),
        "assettoCorsa": {
            "name": "Palestine",
            "code": "PSE",
            "isMod": true,
        },
    },
    "panama": {
        "displayName": "Panama",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/panama.png"),
        "assettoCorsa": {
            "name": "Panama",
            "code": "PAN",
        },
    },
    "papua_new_guinea": {
        "displayName": "Papua New Guinea",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/papua_new_guinea.png"),
        "assettoCorsa": {
            "name": "Papua New Guinea",
            "code": "PNG",
        },
    },
    "paraguay": {
        "displayName": "Paraguay",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/paraguay.png"),
        "assettoCorsa": {
            "name": "Paraguay",
            "code": "PRY",
        },
    },
    "peru": {
        "displayName": "Peru",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/peru.png"),
        "assettoCorsa": {
            "name": "Peru",
            "code": "PER",
        },
    },
    "philippines": {
        "displayName": "Philippines",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/philippines.png"),
        "assettoCorsa": {
            "name": "Philippines",
            "code": "PHL",
        },
    },
    "poland": {
        "displayName": "Poland",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/poland.png"),
        "assettoCorsa": {
            "name": "Poland",
            "code": "POL",
        },
    },
    "portugal": {
        "displayName": "Portugal",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/portugal.png"),
        "assettoCorsa": {
            "name": "Portugal",
            "code": "PRT",
        },
    },
    "qatar": {
        "displayName": "Qatar",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/qatar.png"),
        "assettoCorsa": {
            "name": "Qatar",
            "code": "QAT",
        },
    },
    "romania": {
        "displayName": "Romania",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/romania.png"),
        "assettoCorsa": {
            "name": "Romania",
            "code": "ROU",
        },
    },
    "russia": {
        "displayName": "Russia",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/russia.png"),
        "assettoCorsa": {
            "name": "Russia",
            "code": "RUS",
        },
    },
    "rwanda": {
        "displayName": "Rwanda",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/rwanda.png"),
        "assettoCorsa": {
            "name": "Rwanda",
            "code": "RWA",
        },
    },
    "st_kitts_and_nevis": {
        "displayName": "St. Kitts and Nevis",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/st_kitts_and_nevis.png"),
        "assettoCorsa": {
            "name": "St. Kitts and Nevis",
            "code": "KNA",
        },
    },
    "st_lucia": {
        "displayName": "St. Lucia",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/st_lucia.png"),
        "assettoCorsa": {
            "name": "St. Lucia",
            "code": "LCA",
        },
    },
    "st_vincent_and_the_grenadines": {
        "displayName": "St. Vincent and the Grenadines",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/st_vincent_and_the_grenadines.png"),
        "assettoCorsa": {
            "name": "St. Vincent and the Grenadines",
            "code": "VCT",
        },
    },
    "sahrawi_adm": {
        "displayName": "Sahrawi Republic",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/sahrawi_adm.png"),
        "assettoCorsa": {
            "name": "Sahrawi Republic",
            "code": "ESH",
        },
    },
    "samoa": {
        "displayName": "Samoa",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/samoa.png"),
        "assettoCorsa": {
            "name": "Samoa",
            "code": "WSM",
        },
    },
    "san_marino": {
        "displayName": "San Marino",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/san_marino.png"),
        "assettoCorsa": {
            "name": "San Marino",
            "code": "SMR",
        },
    },
    "sao_tome_and_principe": {
        "displayName": "São Tomé and Príncipe",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/sao_tome_and_principe.png"),
        "assettoCorsa": {
            "name": "São Tomé and Príncipe",
            "code": "STP",
        },
    },
    "saudi_arabia": {
        "displayName": "Saudi Arabia",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/saudi_arabia.png"),
        "assettoCorsa": {
            "name": "Saudi Arabia",
            "code": "SAU",
        },
    },
    "senegal": {
        "displayName": "Senegal",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/senegal.png"),
        "assettoCorsa": {
            "name": "Senegal",
            "code": "SEN",
        },
    },
    "serbia": {
        "displayName": "Serbia",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/serbia.png"),
        "assettoCorsa": {
            "name": "Serbia",
            "code": "SRB",
        },
    },
    "seychelles": {
        "displayName": "Seychelles",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/seychelles.png"),
        "assettoCorsa": {
            "name": "Seychelles",
            "code": "SYC",
        },
    },
    "sierra_leone": {
        "displayName": "Sierra Leone",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/sierra_leone.png"),
        "assettoCorsa": {
            "name": "Sierra Leone",
            "code": "SLE",
        },
    },
    "singapore": {
        "displayName": "Singapore",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/singapore.png"),
        "assettoCorsa": {
            "name": "Singapore",
            "code": "SGP",
        },
    },
    "slovakia": {
        "displayName": "Slovakia",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/slovakia.png"),
        "assettoCorsa": {
            "name": "Slovakia",
            "code": "SVK",
        },
    },
    "slovenia": {
        "displayName": "Slovenia",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/slovenia.png"),
        "assettoCorsa": {
            "name": "Slovenia",
            "code": "SVN",
        },
    },
    "solomon_islands": {
        "displayName": "Solomon Islands",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/solomon_islands.png"),
        "assettoCorsa": {
            "name": "Solomon Islands",
            "code": "SLB",
        },
    },
    "somalia": {
        "displayName": "Somalia",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/somalia.png"),
        "assettoCorsa": {
            "name": "Somalia",
            "code": "SOM",
        },
    },
    "south_africa": {
        "displayName": "South Africa",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/south_africa.png"),
        "assettoCorsa": {
            "name": "South Africa",
            "code": "ZAF",
        },
    },
    "south_korea": {
        "displayName": "South Korea",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/south_korea.png"),
        "assettoCorsa": {
            "name": "South Korea",
            "code": "KOR",
        },
    },
    "south_sudan": {
        "displayName": "South Sudan",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/south_sudan.png"),
        "assettoCorsa": {
            "name": "South Sudan",
            "code": "SSD",
            "isMod": true,
        },
    },
    "spain": {
        "displayName": "Spain",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/spain.png"),
        "assettoCorsa": {
            "name": "Spain",
            "code": "ESP",
        },
    },
    "sri_lanka": {
        "displayName": "Sri Lanka",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/sri_lanka.png"),
        "assettoCorsa": {
            "name": "Sri Lanka",
            "code": "LKA",
        },
    },
    "sudan": {
        "displayName": "Sudan",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/sudan.png"),
        "assettoCorsa": {
            "name": "Sudan",
            "code": "SDN",
        },
    },
    "suriname": {
        "displayName": "Suriname",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/suriname.png"),
        "assettoCorsa": {
            "name": "Suriname",
            "code": "SUR",
        },
    },
    "sweden": {
        "displayName": "Sweden",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/sweden.png"),
        "assettoCorsa": {
            "name": "Sweden",
            "code": "SWE",
        },
    },
    "switzerland": {
        "displayName": "Switzerland",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/switzerland.png"),
        "assettoCorsa": {
            "name": "Switzerland",
            "code": "CHE",
        },
    },
    "syria": {
        "displayName": "Syria",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/syria.png"),
        "assettoCorsa": {
            "name": "Syria",
            "code": "SYR",
        },
    },
    "taiwan": {
        "displayName": "Taiwan",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/taiwan.png"),
        "assettoCorsa": {
            "name": "Taiwan",
            "code": "TWN",
        },
    },
    "tajikistan": {
        "displayName": "Tajikistan",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/tajikistan.png"),
        "assettoCorsa": {
            "name": "Tajikistan",
            "code": "TJK",
        },
    },
    "tanzania": {
        "displayName": "Tanzania",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/tanzania.png"),
        "assettoCorsa": {
            "name": "Tanzania",
            "code": "TZA",
        },
    },
    "thailand": {
        "displayName": "Thailand",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/thailand.png"),
        "assettoCorsa": {
            "name": "Thailand",
            "code": "THA",
        },
    },
    "togo": {
        "displayName": "Togo",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/togo.png"),
        "assettoCorsa": {
            "name": "Togo",
            "code": "TGO",
        },
    },
    "tonga": {
        "displayName": "Tonga",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/tonga.png"),
        "assettoCorsa": {
            "name": "Tonga",
            "code": "TON",
        },
    },
    "trinidad_and_tobago": {
        "displayName": "Trinidad and Tobago",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/trinidad_and_tobago.png"),
        "assettoCorsa": {
            "name": "Trinidad and Tobago",
            "code": "TTO",
        },
    },
    "tunisia": {
        "displayName": "Tunisia",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/tunisia.png"),
        "assettoCorsa": {
            "name": "Tunisia",
            "code": "TUN",
        },
    },
    "turkey": {
        "displayName": "Turkey",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/turkey.png"),
        "assettoCorsa": {
            "name": "Turkey",
            "code": "TUR",
        },
    },
    "turkmenistan": {
        "displayName": "Turkmenistan",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/turkmenistan.png"),
        "assettoCorsa": {
            "name": "Turkmenistan",
            "code": "TKM",
        },
    },
    "tuvalu": {
        "displayName": "Tuvalu",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/tuvalu.png"),
        "assettoCorsa": {
            "name": "Tuvalu",
            "code": "TUV",
        },
    },
    "uganda": {
        "displayName": "Uganda",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/uganda.png"),
        "assettoCorsa": {
            "name": "Uganda",
            "code": "UGA",
        },
    },
    "ukraine": {
        "displayName": "Ukraine",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/ukraine.png"),
        "assettoCorsa": {
            "name": "Ukraine",
            "code": "UKR",
        },
    },
    "united_arab_emirates": {
        "displayName": "United Arab Emirates",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/united_arab_emirates.png"),
        "assettoCorsa": {
            "name": "United Arab Emirates",
            "code": "ARE",
        },
    },
    "united_kingdom": {
        "displayName": "United Kingdom",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/united_kingdom.png"),
        "assettoCorsa": {
            "name": "Great Britain",
            "code": "GBR",
        },
    },
    "united_states": {
        "displayName": "United States",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/united_states.png"),
        "assettoCorsa": {
            "name": "USA",
            "code": "USA",
        },
    },
    "uruguay": {
        "displayName": "Uruguay",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/uruguay.png"),
        "assettoCorsa": {
            "name": "Uruguay",
            "code": "URY",
        },
    },
    "uzbekistan": {
        "displayName": "Uzbekistan",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/uzbekistan.png"),
        "assettoCorsa": {
            "name": "Uzbekistan",
            "code": "UZB",
        },
    },
    "vanuatu": {
        "displayName": "Vanuatu",
        "category": CountryCategory.oceania,
        "flag": require("@assets/flags/vanuatu.png"),
        "assettoCorsa": {
            "name": "Vanuatu",
            "code": "VUT",
        },
    },
    "vatican_city": {
        "displayName": "Vatican City",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/vatican_city.png"),
        "assettoCorsa": {
            "name": "Holy see",
            "code": "VAT",
            "isMod": true,
        },
    },
    "venezuela": {
        "displayName": "Venezuela",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/venezuela.png"),
        "assettoCorsa": {
            "name": "Venezuela",
            "code": "VEN",
        },
    },
    "vietnam": {
        "displayName": "Vietnam",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/vietnam.png"),
        "assettoCorsa": {
            "name": "Vietnam",
            "code": "VNM",
        },
    },
    "yemen": {
        "displayName": "Yemen",
        "category": CountryCategory.middleEast,
        "flag": require("@assets/flags/yemen.png"),
        "assettoCorsa": {
            "name": "Yemen",
            "code": "YEM",
        },
    },
    "zambia": {
        "displayName": "Zambia",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/zambia.png"),
        "assettoCorsa": {
            "name": "Zambia",
            "code": "ZMB",
        },
    },
    "zimbabwe": {
        "displayName": "Zimbabwe",
        "category": CountryCategory.africa,
        "flag": require("@assets/flags/zimbabwe.png"),
        "assettoCorsa": {
            "name": "Zimbabwe",
            "code": "ZWE",
        },
    },
    /*******************************/
    /* Partially recognized states */
    /*******************************/
    "abkhazia": {
        "displayName": "Abkhazia",
        "category": CountryCategory.unrecognized,
        "flag": require("@assets/flags/abkhazia.png"),
        "assettoCorsa": {
            "name": "Abkhazia",
            "code": "ABK",
            "isMod": true,
        },
    },
    "afghanistan_emirate": {
        "displayName": "Emirate of Afghanistan",
        "category": CountryCategory.unrecognized,
        "flag": require("@assets/flags/afghanistan_emirate.png"),
        "assettoCorsa": {
            "name": "Emirate of Afghanistan",
            "code": "AFE",
            "isMod": true,
        },
    },
    "kosovo": {
        "displayName": "Kosovo",
        "category": CountryCategory.unrecognized,
        "flag": require("@assets/flags/kosovo.png"),
        "assettoCorsa": {
            "name": "Kosovo",
            "code": "UNK",
            "isMod": true,
        },
    },
    "northern_cyprus": {
        "displayName": "Northern Cyprus",
        "category": CountryCategory.unrecognized,
        "flag": require("@assets/flags/northern_cyprus.png"),
        "assettoCorsa": {
            "name": "Northern Cyprus",
            "code": "NCY",
            "isMod": true,
        },
    },
    "somaliland": {
        "displayName": "Somaliland",
        "category": CountryCategory.unrecognized,
        "flag": require("@assets/flags/somaliland.png"),
        "assettoCorsa": {
            "name": "Somaliland",
            "code": "SML",
            "isMod": true,
        },
    },
    "south_ossetia": {
        "displayName": "South Ossetia",
        "category": CountryCategory.unrecognized,
        "flag": require("@assets/flags/south_ossetia.png"),
        "assettoCorsa": {
            "name": "South Ossetia",
            "code": "SOS",
            "isMod": true,
        },
    },
    "transnistria": {
        "displayName": "Transnistria",
        "category": CountryCategory.unrecognized,
        "flag": require("@assets/flags/transnistria.png"),
        "assettoCorsa": {
            "name": "Transnistria",
            "code": "TRA",
            "isMod": true,
        },
    },
    /*******************************/
    /* Historical states (extinct) */
    /*******************************/
    
    "soviet_union": {
        "displayName": "Soviet Union",
        "category": CountryCategory.historical,
        "flag": require("@assets/flags/soviet_union.png"),
        "assettoCorsa": {
            "name": "Soviet Union",
            "code": "",
        },
    },
    /************************/
    /* Sub-national regions */
    /************************/
    // - United Kingdom
    "england": {
        "displayName": "England",
        "category": CountryCategory.subnational,
        "flag": require("@assets/flags/england.png"),
        "assettoCorsa": {
            "name": "England",
            "code": "ENG",
        },
    },
    "northern_ireland": {
        "displayName": "Northern Ireland",
        "category": CountryCategory.subnational,
        "flag": require("@assets/flags/northern_ireland.png"),
        "assettoCorsa": {
            "name": "Northern Ireland",
            "code": "NIR",
        },
    },
    "scotland": {
        "displayName": "Scotland",
        "category": CountryCategory.subnational,
        "flag": require("@assets/flags/scotland.png"),
        "assettoCorsa": {
            "name": "Scotland",
            "code": "SCT",
        },
    },
    "wales": {
        "displayName": "Wales",
        "category": CountryCategory.subnational,
        "flag": require("@assets/flags/wales.png"),
        "assettoCorsa": {
            "name": "Wales",
            "code": "WLS",
        },
    },
    // - Spain
    "basque_country": {
        "displayName": "Basque Country",
        "category": CountryCategory.subnational,
        "flag": require("@assets/flags/basque_country.png"),
        "assettoCorsa": {
            "name": "Basque Country",
            "code": "EUS",
            "isMod": true,
        },
    },
    "canary_islands": {
        "displayName": "Canary Islands",
        "category": CountryCategory.subnational,
        "flag": require("@assets/flags/canary_islands.png"),
        "assettoCorsa": {
            "name": "Canary Islands",
            "code": "CAI",
            "isMod": true,
        },
    },
    "catalonia": {
        "displayName": "Catalonia",
        "category": CountryCategory.subnational,
        "flag": require("@assets/flags/catalonia.png"),
        "assettoCorsa": {
            "name": "Catalonia",
            "code": "CAT",
            "isMod": true,
        },
    },
    "galicia": {
        "displayName": "Galicia",
        "category": CountryCategory.subnational,
        "flag": require("@assets/flags/galicia.png"),
        "assettoCorsa": {
            "name": "Galicia",
            "code": "GLZ",
            "isMod": true,
        },
    },
    // - Belgium
    "flanders": {
        "displayName": "Flanders",
        "category": CountryCategory.subnational,
        "flag": require("@assets/flags/flanders.png"),
        "assettoCorsa": {
            "name": "Flanders",
            "code": "FLA",
            "isMod": true,
        },
    },
    "wallonia": {
        "displayName": "Wallonia",
        "category": CountryCategory.subnational,
        "flag": require("@assets/flags/wallonia.png"),
        "assettoCorsa": {
            "name": "Wallonia",
            "code": "WAL",
            "isMod": true,
        },
    },
    // - Finland
    "aland": {
        "displayName": "Åland",
        "category": CountryCategory.subnational,
        "flag": require("@assets/flags/aland.png"),
        "assettoCorsa": {
            "name": "Åland",
            "code": "ALA",
            "isMod": true,
        },
    },
    /*****************************/
    /* Non-sovereign territories */
    /*****************************/
    // - Australia
    "christmas_island": {
        "displayName": "Christmas Island",
        "category": CountryCategory.oceania,
        "isPseudo": true,
        "flag": require("@assets/flags/christmas_island.png"),
        "assettoCorsa": {
            "name": "Christmas Island",
            "code": "CXR",
            "isMod": true,
        },
    },
    "cocos_islands": {
        "displayName": "Cocos (Keeling) Islands",
        "category": CountryCategory.oceania,
        "isPseudo": true,
        "flag": require("@assets/flags/cocos_islands.png"),
        "assettoCorsa": {
            "name": "Cocos (Keeling) Islands",
            "code": "CCK",
        },
    },
    "norfolk_island": {
        "displayName": "Norfolk Island",
        "category": CountryCategory.oceania,
        "isPseudo": true,
        "flag": require("@assets/flags/norfolk_island.png"),
        "assettoCorsa": {
            "name": "Norfolk Island",
            "code": "NFK",
            "isMod": true,
        },
    },
    // - China
    "hong_kong": {
        "displayName": "Hong Kong",
        "category": CountryCategory.asia,
        "isPseudo": true,
        "flag": require("@assets/flags/hong_kong.png"),
        "assettoCorsa": {
            "name": "Hong Kong",
            "code": "HKG",
        },
    },
    "macau": {
        "displayName": "Macau",
        "category": CountryCategory.asia,
        "isPseudo": true,
        "flag": require("@assets/flags/macau.png"),
        "assettoCorsa": {
            "name": "Macau",
            "code": "MAC",
        },
    },
    // - Denmark
    "faroe_islands": {
        "displayName": "Faroe Islands",
        "category": CountryCategory.europe,
        "isPseudo": true,
        "flag": require("@assets/flags/faroe_islands.png"),
        "assettoCorsa": {
            "name": "Faroe Islands",
            "code": "FRO",
        },
    },
    "greenland": {
        "displayName": "Greenland",
        "category": CountryCategory.europe, // geographically American.
        "isPseudo": true,
        "flag": require("@assets/flags/greenland.png"),
        "assettoCorsa": {
            "name": "Greenland",
            "code": "GRL",
        },
    },
    // - France
    "french_polynesia": {
        "displayName": "French Polynesia",
        "category": CountryCategory.oceania,
        "isPseudo": true,
        "flag": require("@assets/flags/french_polynesia.png"),
        "assettoCorsa": {
            "name": "French Polynesia",
            "code": "PYF",
        },
    },
    "martinique": {
        "displayName": "Martinique",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/martinique.png"),
        "assettoCorsa": {
            "name": "Martinique",
            "code": "MTQ",
            "isMod": true,
        },
    },
    "new_caledonia": {
        "displayName": "New Caledonia",
        "category": CountryCategory.oceania,
        "isPseudo": true,
        "flag": require("@assets/flags/new_caledonia.png"),
        "assettoCorsa": {
            "name": "New Caledonia",
            "code": "NCL",
        },
    },
    "st_barthelemy": {
        "displayName": "St. Barthélemy",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/st_barthelemy.png"),
        "assettoCorsa": {
            "name": "St. Barthélemy",
            "code": "BLM",
            "isMod": true,
        },
    },
    "st_martin": {
        "displayName": "St. Martin",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/st_martin.png"),
        "assettoCorsa": {
            "name": "St. Martin",
            "code": "MAF",
            "isMod": true,
        },
    },
    "st_pierre_and_miquelon": {
        "displayName": "St. Pierre and Miquelon",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/st_pierre_and_miquelon.png"),
        "assettoCorsa": {
            "name": "St. Pierre and Miquelon",
            "code": "SPM",
            "isMod": true,
        },
    },
    "wallis_and_futuna": {
        "displayName": "Wallis and Futuna",
        "category": CountryCategory.oceania,
        "isPseudo": true,
        "flag": require("@assets/flags/wallis_and_futuna.png"),
        "assettoCorsa": {
            "name": "Wallis and Futuna",
            "code": "WLF",
            "isMod": true,
        },
    },
    // - Netherlands
    "aruba": {
        "displayName": "Aruba",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/aruba.png"),
        "assettoCorsa": {
            "name": "Aruba",
            "code": "ABW",
        },
    },
    "curacao": {
        "displayName": "Curaçao",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/curacao.png"),
        "assettoCorsa": {
            "name": "Curacao",
            "code": "CUW",
            "isMod": true,
        },
    },
    "sint_maarten": {
        "displayName": "Sint Maarten",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/sint_maarten.png"),
        "assettoCorsa": {
            "name": "Sint Maarten",
            "code": "SXM",
            "isMod": true,
        },
    },
    // - New Zealand
    "tokelau": {
        "displayName": "Tokelau",
        "category": CountryCategory.oceania,
        "isPseudo": true,
        "flag": require("@assets/flags/tokelau.png"),
        "assettoCorsa": {
            "name": "Tokelau",
            "code": "TKL",
            "isMod": true,
        },
    },
    // - United Kingdom
    "anguilla": {
        "displayName": "Anguilla",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/anguilla.png"),
        "assettoCorsa": {
            "name": "Anguilla",
            "code": "AIA",
        },
    },
    "bermuda": {
        "displayName": "Bermuda",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/bermuda.png"),
        "assettoCorsa": {
            "name": "Bermuda",
            "code": "BMU",
        },
    },
    "cayman_islands": {
        "displayName": "Cayman Islands",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/cayman_islands.png"),
        "assettoCorsa": {
            "name": "Cayman Islands",
            "code": "CYM",
        },
    },
    "gibraltar": {
        "displayName": "Gibraltar",
        "category": CountryCategory.europe,
        "isPseudo": true,
        "flag": require("@assets/flags/gibraltar.png"),
        "assettoCorsa": {
            "name": "Gibraltar",
            "code": "GBZ",
            "isMod": true,
        },
    },
    "guernsey": {
        "displayName": "Guernsey",
        "category": CountryCategory.europe,
        "isPseudo": true,
        "flag": require("@assets/flags/guernsey.png"),
        "assettoCorsa": {
            "name": "Guernsey",
            "code": "GGY",
        },
    },
    "isle_of_man": {
        "displayName": "Isle of Man",
        "category": CountryCategory.europe,
        "isPseudo": true,
        "flag": require("@assets/flags/isle_of_man.png"),
        "assettoCorsa": {
            "name": "Isle of Man",
            "code": "IMN",
        },
    },
    "jersey": {
        "displayName": "Jersey",
        "category": CountryCategory.europe,
        "isPseudo": true,
        "flag": require("@assets/flags/jersey.png"),
        "assettoCorsa": {
            "name": "Jersey",
            "code": "JEY",
        },
    },
    "montserrat": {
        "displayName": "Montserrat",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/montserrat.png"),
        "assettoCorsa": {
            "name": "Montserrat",
            "code": "MSR",
        },
    },
    "turks_and_caicos_islands": {
        "displayName": "Turks and Caicos Islands",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/turks_and_caicos_islands.png"),
        "assettoCorsa": {
            "name": "Turks and Caicos Islands",
            "code": "TCA",
        },
    },
    "virgin_islands_gb": {
        "displayName": "Virgin Islands (Great Britain)",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/virgin_islands_gb.png"),
        "assettoCorsa": {
            "name": "British Virgin Islands",
            "code": "VGB",
        },
    },
    // - United States
    "american_samoa": {
        "displayName": "American Samoa",
        "category": CountryCategory.oceania,
        "isPseudo": true,
        "flag": require("@assets/flags/american_samoa.png"),
        "assettoCorsa": {
            "name": "American Samoa",
            "code": "ASM",
        },
    },
    "guam": {
        "displayName": "Guam",
        "category": CountryCategory.oceania,
        "isPseudo": true,
        "flag": require("@assets/flags/guam.png"),
        "assettoCorsa": {
            "name": "Guam",
            "code": "GUM",
        },
    },
    "puerto_rico": {
        "displayName": "Puerto Rico",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/puerto_rico.png"),
        "assettoCorsa": {
            "name": "Puerto Rico",
            "code": "PRI",
        },
    },
    "virgin_islands_us": {
        "displayName": "U.S. Virgin Islands",
        "category": CountryCategory.caribbean,
        "isPseudo": true,
        "flag": require("@assets/flags/virgin_islands_us.png"),
        "assettoCorsa": {
            "name": "U.S. Virgin Islands",
            "code": "VIR",
        },
    },
}

/**
 * A dictionary that maps Assetto Corsa's country names to Lega's country objects.
 */
export const CountriesByAssettoName: {[assettoName: string]: Country} = {};
/**
 * A dictionary that maps Assetto Corsa's country names to Lega's internal names.
 */
export const AssettoToLegaCountries: {[assettoName: string]: string} = {};

export function InitializeCountryData () {
    if (initialized) return;

    Object.keys(AssettoToLegaCountries).forEach(
        k => delete AssettoToLegaCountries[k]
    );
    
    for (const c in Countries) {
        const legaCountry = Countries[c];

        if (!legaCountry.assettoCorsa) continue;

        CountriesByAssettoName[legaCountry.assettoCorsa.name] = legaCountry;
        AssettoToLegaCountries[legaCountry.assettoCorsa.name] = c;
    }

    initialized = true;
}