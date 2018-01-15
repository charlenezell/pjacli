// let cp=require("child_process");
let fs = require("fs-extra");
let path = require("path");
var glob = require("glob");
let envOption = require("./env");
// let env=
console.log("copying jsps");
glob.sync('./build/*.jsp').forEach(v => {
    // console.log(v);
    fs.copySync(v, path.resolve(envOption.ttqJSPDeployPath, path.basename(v)));
    console.info(`success in copy ${v} to ${envOption.ttqJSPDeployPath}`)
})
if (envOption.staticDeployPath) {
    console.log("copying other static resources");
    glob.sync("./build/**/*", { ignore: ["./build/*.html", "./build/*.jsp"] }).forEach(v => {
        // console.log(v);
        fs.copySync(v, path.resolve(envOption.staticDeployPath, path.relative("./build",v)));
        console.info(`success in copy ${v} to ${envOption.staticDeployPath}`)
    })
}