import { FILE_PROTOCOL } from "data/files";

/**
 * Returns the path to the preview file of the given car.
 * @param skinFolderPath The complete path to the skin to display for that car.
 * @param asResource If true, the path will contain the resource protocol.
 */
export function getCarPreviewFolder (skinFolderPath: string, asResource: boolean = false) {
    const filePath = skinFolderPath + "/preview.jpg";
    return (asResource ? FILE_PROTOCOL : "") + filePath;
}
