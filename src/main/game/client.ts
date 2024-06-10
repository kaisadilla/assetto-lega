import { shell, utilityProcess } from "electron";
import { spawn } from "child_process";


export function launchGame (acRootPath: string) {
    let acsPath = _WinPath(acRootPath + "/acs.exe");
    console.log(acsPath);
    
    const proc = spawn(acsPath, {
        cwd: acRootPath
    });

    proc.on('error', err => {
        console.error("acs.exe error: ", err);
    })
    proc.on('message', msg => {
        console.info("acs.exe message: ", msg);
    });

    //console.log(proc);
}

function _WinPath (path: string) {
    return path.replaceAll("/", "\\");
}