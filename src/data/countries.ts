export interface Country {
    displayName: string;
    category: CountryCategory;
    isRegion?: boolean;
    assettoCorsa: CorsaCountry | null;
    flag: string;
}

export enum CountryCategory {
    pseudo = "Regions",
    europe = "Europe",
    americas = "Americas",
    oceania = "Oceania",
    asia = "Asia",
    middleEast = "Middle East",
    africa = "Africa",
    caribbean = "Caribbean",
}

interface CorsaCountry {
    name: string;
    code: string;
}

export const COUNTRIES_ASSETTO_TO_LEGA: {[key: string]: string} = {
    "Austria": "austria",
    "Europe": "eu",
    "France": "france",
    "Germany": "germany",
    "Italy": "italy",
    "Japan": "japan",
    "Mexico": "mexico",
    "Netherlands": "netherlands",
    "South Korea": "south_korea",
    "Spain": "spain",
    "Great Britain": "united_kingdom",
    "United States": "united_states",
};

export const Countries: { [key: string]: Country } = {
    "assetto_corsa": {
        "displayName": "Assetto Corsa",
        "category": CountryCategory.pseudo,
        "isRegion": true,
        "flag": require("@assets/flags/assetto_corsa.png"),
        "assettoCorsa": {
            "name": "Assetto Corsa",
            "code": "AC",
        },
    },
    "eu": {
        "displayName": "Europe",
        "category": CountryCategory.pseudo,
        "isRegion": true,
        "flag": require("@assets/flags/eu.png"),
        "assettoCorsa": null,
    },
    "world": {
        "displayName": "World",
        "category": CountryCategory.pseudo,
        "isRegion": true,
        "flag": require("@assets/flags/world.png"),
        "assettoCorsa": null,
    },
    "afghanistan": {
        "displayName": "Afghanistan",
        "category": CountryCategory.middleEast,
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
    "aruba": {
        "displayName": "Aruba",
        "category": CountryCategory.caribbean,
        "flag": require("@assets/flags/aruba.png"),
        "assettoCorsa": {
            "name": "Aruba",
            "code": "ABW",
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
            "name": "The Bahamas",
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
            "name": "Central Africa R.",
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
            "name": "Congo, Dem. Rep.",
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
            "name": "Eswatini",
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
            "name": "The Gambia",
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
        "category": CountryCategory.africa,
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
            "name": "Côte d'Ivoire",
            "code": "CIV",
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
    "mexico": {
        "displayName": "Mexico",
        "category": CountryCategory.americas,
        "flag": require("@assets/flags/mexico.png"),
        "assettoCorsa": {
            "name": "Mexico",
            "code": "MEX",
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
    "south_korea": {
        "displayName": "South Korea",
        "category": CountryCategory.asia,
        "flag": require("@assets/flags/south_korea.png"),
        "assettoCorsa": {
            "name": "South Korea",
            "code": "KOR",
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
            "name": "United States",
            "code": "USA",
        },
    },
}