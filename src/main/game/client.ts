import { shell } from "electron";


export function launchGame (acRootPath: string) {
    const acsPath = _WinPath(acRootPath + "/acs.exe");
    console.log(acsPath);
    //shell.openExternal(acsPath);

    const { exec, spawn } = require("node:child_process");
    //const proc = spawn(acsPath);
    exec(`"${acsPath}"`, (err: any, stdout: any, stderr: any) => {
        console.log("> Error:");
        console.log(err);
        console.log("> stdout:");
        console.log(stdout);
        console.log("> stderr:");
        console.log(stderr);
    });
    //exec(`ping -c 4 0.0.0.0`, (err: any, stdout: any, stderr: any) => {
    //    console.log(err);
    //    console.log(stdout);
    //    console.log(stderr);
    //});

    //const bat2 = spawn('cmd.exe', ["/c", `"${acsPath}"`]);
    //console.log(bat2);
}

function _WinPath (path: string) {
    return path.replaceAll("/", "\\");
}