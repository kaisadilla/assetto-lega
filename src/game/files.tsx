//import { nativeImage } from 'electron';

export function loadImage (path: string) {
    //const img = nativeImage.createFromPath(path);
    //return img;
    const { nativeImage } = window.require("electron");
    const img = nativeImage.createFromPath(path);

    return img.toDataURL();
}