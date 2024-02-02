interface Country {
    displayName: string;
    isRegion?: boolean;
    assettoCorsa: CorsaCountry | null;
    flag: string;
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
    "eu": {
        "displayName": "Europe",
        "isRegion": true,
        "flag": require("@assets/flags/eu.png"),
        "assettoCorsa": null,
    },
    "world": {
        "displayName": "World",
        "isRegion": true,
        "flag": require("@assets/flags/world.png"),
        "assettoCorsa": null,
    },
    "austria": {
        "displayName": "Austria",
        "flag": require("@assets/flags/austria.png"),
        "assettoCorsa": {
            "name": "Austria",
            "code": "AUT",
        },
    },
    "france": {
        "displayName": "France",
        "flag": require("@assets/flags/france.png"),
        "assettoCorsa": {
            "name": "France",
            "code": "FRA",
        },
    },
    "germany": {
        "displayName": "Germany",
        "flag": require("@assets/flags/germany.png"),
        "assettoCorsa": {
            "name": "Germany",
            "code": "DEU",
        },
    },
    "italy": {
        "displayName": "Italy",
        "flag": require("@assets/flags/italy.png"),
        "assettoCorsa": {
            "name": "Italy",
            "code": "ITA",
        },
    },
    "japan": {
        "displayName": "Japan",
        "flag": require("@assets/flags/japan.png"),
        "assettoCorsa": {
            "name": "Japan",
            "code": "JPN",
        },
    },
    "mexico": {
        "displayName": "Mexico",
        "flag": require("@assets/flags/mexico.png"),
        "assettoCorsa": {
            "name": "Mexico",
            "code": "MEX",
        },
    },
    "netherlands": {
        "displayName": "Netherlands",
        "flag": require("@assets/flags/netherlands.png"),
        "assettoCorsa": {
            "name": "Netherlands",
            "code": "NLD",
        },
    },
    "south_korea": {
        "displayName": "South Korea",
        "flag": require("@assets/flags/south_korea.png"),
        "assettoCorsa": {
            "name": "South Korea",
            "code": "KOR",
        },
    },
    "spain": {
        "displayName": "Spain",
        "flag": require("@assets/flags/spain.png"),
        "assettoCorsa": {
            "name": "Spain",
            "code": "ESP",
        },
    },
    "united_kingdom": {
        "displayName": "United Kingdom",
        "flag": require("@assets/flags/united_kingdom.png"),
        "assettoCorsa": {
            "name": "Great Britain",
            "code": "GBR",
        },
    },
    "united_states": {
        "displayName": "United States",
        "flag": require("@assets/flags/united_states.png"),
        "assettoCorsa": {
            "name": "United States",
            "code": "USA",
        },
    },
}