import { CarData } from "data/schemas";

export function getCarDefaultSkin (carData: CarData) {
    const firstSkin = Object.keys(carData.skins)[0];
    return carData.skins[firstSkin];
}