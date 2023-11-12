//import { nativeImage } from 'electron';

export function loadImage (path: string) {
    const { nativeImage } = window.require("electron");
    const img = nativeImage.createFromPath(path);

    return img.toDataURL();
}