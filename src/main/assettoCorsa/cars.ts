import { CarData } from "data/schemas";
import { AssettoCorsa } from "./acFolder";

const Cars = {
    carList: [] as CarData[],
    carsById: {} as {[folderName: string]: CarData},
    async loadCars () : Promise<number> {
        this.carList = await AssettoCorsa.getCarList();

        for (const c of this.carList) {
            this.carsById[c.folderName] = c;
        }

        return this.carList.length;
    },
};

export default Cars;