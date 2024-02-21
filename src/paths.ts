import { FILE_PROTOCOL } from "data/files";

/**
 * Returns the path to the preview file of the given car.
 * @param skinFolderPath The complete path to the skin to display for that car.
 * @param asResource If true, the path will contain the resource protocol.
 */
export function getCarPreviewFile (skinFolderPath: string, asResource: boolean = false) {
    const filePath = skinFolderPath + "/preview.jpg";
    return __returnPath(filePath, asResource);
}

export function getCarBadgeFile (carFolderPath: string, asResource: boolean = false) {
    const filePath = carFolderPath + "/ui/badge.png";
    return __returnPath(filePath, asResource);
}

function __returnPath (path: string, asResource: boolean) {
    return (asResource ? FILE_PROTOCOL : "") + path;
}