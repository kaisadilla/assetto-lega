import { BrandData, CarData } from "data/schemas";
import { AssettoCorsa } from "./acFolder";
import { LOCALE, getCarDefaultSkin } from "../mainProcessUtils";

const Cars = {
    carList: [] as CarData[],
    carsById: {} as {[folderName: string]: CarData},
    brands: [] as BrandData[],
    brandsById: {} as {[brandName: string]: BrandData},
    async loadCars () : Promise<number> {
        this.carList = await AssettoCorsa.getCarList();
        this.carList = this.carList.sort(
            (a, b) => a.ui.name?.localeCompare(b.ui.name ?? "") ?? 1
        );

        this.brandsById = {};

        for (const c of this.carList) {
            this.carsById[c.folderName] = c;

            const brand = c.ui.brand ?? "";

            if (this.brandsById[brand] === undefined) {
                this.brandsById[brand] = {
                    displayName: brand,
                    badgePath: "asset://" + c.folderPath + "/ui/badge.png",
                } as BrandData;
            }
        }

        this.brands = Object.values(this.brandsById).sort(
            (a, b) => a.displayName.localeCompare(b.displayName, LOCALE)
        );

        return this.carList.length;
    },
};

export default Cars;