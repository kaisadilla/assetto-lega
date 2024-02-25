import { AcCar } from "data/schemas";

export const LOCALE = "en-US";

export function getCarDefaultSkin (carData: AcCar) {
    const firstSkin = Object.keys(carData.skinsById)[0];
    return carData.skinsById[firstSkin];
}