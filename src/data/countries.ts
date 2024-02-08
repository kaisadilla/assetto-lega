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
    "france": {
        "displayName": "France",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/france.png"),
        "assettoCorsa": {
            "name": "France",
            "code": "FRA",
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
    "italy": {
        "displayName": "Italy",
        "category": CountryCategory.europe,
        "flag": require("@assets/flags/italy.png"),
        "assettoCorsa": {
            "name": "Italy",
            "code": "ITA",
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