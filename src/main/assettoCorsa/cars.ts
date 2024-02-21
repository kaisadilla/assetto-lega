import { AcCarCollection, AcCarBrand, AcCar } from "data/schemas";
import { AssettoCorsa } from "./acFolder";
import { LOCALE, getCarDefaultSkin } from "../mainProcessUtils";

const Cars: AcCarCollection = {
    carList: [],
    carsById: {},
    brands: [],
    brandsById: {},
    tags: [],
};

export async function loadAcCarCollection () : Promise<number> {
    Cars.carList = await AssettoCorsa.getCarList();
    Cars.carList = Cars.carList.sort(
        (a, b) => a.ui.name?.localeCompare(b.ui.name ?? "") ?? 1
    );

    // Create other collections derived from the car list.
    const tagSet: Set<string> = new Set();
    Cars.brandsById = {};

    for (const c of Cars.carList) {
        Cars.carsById[c.folderName] = c;

        // add all tags in this car to the tag list.
        for (const tag of c.ui.tags ?? []) {
            tagSet.add(tag);
        }

        const brand = c.ui.brand ?? "";

        if (Cars.brandsById[brand] === undefined) {
            Cars.brandsById[brand] = {
                displayName: brand,
                badgePath: "asset://" + c.folderPath + "/ui/badge.png",
            } as AcCarBrand;
        }
    }

    Cars.brands = Object.values(Cars.brandsById).sort(
        (a, b) => a.displayName.localeCompare(b.displayName, LOCALE)
    );
    Cars.tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b, LOCALE));

    return Cars.carList.length;
};

export default Cars;