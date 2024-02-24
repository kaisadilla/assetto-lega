import { FILE_PROTOCOL } from "data/files";

/**
 * Returns the path to the preview file of the given car.
 * @param skinFolderPath The complete path to the skin to display for that car.
 * @param asResource If true, the path will contain the resource protocol.
 */
export function getCarPreviewFile (
    skinFolderPath: string, asResource: boolean = false
) {
    const filePath = skinFolderPath + "/preview.jpg";
    return __returnPath(filePath, asResource);
}

export function getCarBadgeFile (
    carFolderPath: string, asResource: boolean = false
) {
    const filePath = carFolderPath + "/ui/badge.png";
    return __returnPath(filePath, asResource);
}

export function getCarSkinIconFromId (
    acPath: string, carFolder: string, skinFolder: string, asResource: boolean = false
) : string {
    return __returnPath(
        acPath + "/content/cars/" + carFolder + "/skins/"
            + skinFolder + "/livery.png",
        asResource
    );
}

export function getCarSkinPreviewFile (
    skinFolderPath: string, asResource: boolean = false
) {
    return getCarPreviewFile(skinFolderPath, asResource)
}

export function getCarSkinIcon (
    skinPath: string, asResource: boolean = false
) : string {
    return __returnPath(skinPath + "/livery.png", asResource);
}

function __returnPath (path: string, asResource: boolean) {
    return (asResource ? FILE_PROTOCOL : "") + __cureImgSrc(path);
}

/**
 * Replaces the character '#' in the string given for its HTML safe
 * representation: '%23'.
 * @param path 
 * @returns 
 */
function __cureImgSrc (path: string) {
    return path.replace("#", "%23");
}