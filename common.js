var glob=require("glob");
var fs=require("fs");
// console.log(process)
// var doudouPath= "e:/projectA/source/doudou/WebRoot/play/"
var config=JSON.parse(fs.readFileSync("./config.json"));
var doudouPath= config.gameRoot;
module.exports.getAllGame=function(){
    return glob.sync(doudouPath+"*").filter(function(ipath){
            return /^\d+-\w+(?!\.\w+)$/.test(ipath.split(doudouPath)[1]);
            // return true
        })
}

module.exports.doudouPath=doudouPath;
module.exports.specialSeperator="     ";
