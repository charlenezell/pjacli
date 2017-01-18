/// <reference path="../typings/index.d.ts" />
// 'use strict';
// var checksum = require('checksum');
// var async = require("async");
// var glob = require("glob");
// var files=glob.sync("c:/users/huangguangyao/Desktop/*.bat");
// var u=require("util");
// // console.log(files)
// async.map(files, function(item,cb){
//     checksum.file(item,{algorithm:"sha256"},function(err,rst){
//         cb(err,`${item}\n${rst}\n`);
//         // console.log(rst);
//     });
//     // console.log(u.inspect(arguments))
// }, function (err,rst) {
//     console.log(rst.join("\n"))
// });
var StrGen = {
    range: function (from, to) {
        if (from == to) {
            return [from];
        } else {
            let r = []
            for (var i = from; from < to && i <= to || from > to && i >= to; from > to ? i-- : i++) {
                r.push(i);
            }
            return r;
        }

    }
};
var download = require("download");
var path = require("path");
var dest = path.resolve("c:/users/huangguangyao/Desktop/test/");
// console.log(StrGen.range(720, 713))
Promise.all(StrGen.range(707, 700).map(v => `http://g.51h5.com/yzm/9684094533/res/img/11${v}.png`).map(x => download(x, dest))).then(() => {
    console.log('files downloaded!');
});
