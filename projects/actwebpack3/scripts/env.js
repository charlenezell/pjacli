let fs = require("fs-extra");
var JSON5 = require('json5');
let path = require("path");
let envOption
try {
    envOption = JSON5.parse(fs.readFileSync(path.resolve(__dirname, "../env.setting.json").toString()));
} catch (e) {
    envOption = {
        "ttqJSPDeployPath": "F:\\projectA\\source\\appqq\\WebRoot\\nqqgeneratejsp",//这个是中间的jsp文件导出路径导出文件供jsp后端引入作为资源引用注入
        "sassLibPaths": ["./src/assets/style/common/marketnewcommon/"],//sass基础库引入
        "staticRootURL": "http://nqqresource.100bt.com/build/",
        "testStaticRootURL": "http://resource.a0bi.com/nqq/",
        "bsProxy": "http://app.qq.100bt.com:18006/",
        "staticDeployPath": "F:\\projectA\\source\\web\\resource\\nqq"
    }
}
module.exports = envOption;