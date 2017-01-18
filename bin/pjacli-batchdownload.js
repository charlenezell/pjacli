/// <reference path="../typings/index.d.ts" />
'use strict';
var commander = require("commander");
var checksum = require('checksum');
var Download = require("download");
commander
    .usage('<projectType ...>')
    .description('检查文件checksum')
    .action(function (pattern, ) {
        input.forEach((v) => {

        })
        Promise.all(['unicorn.com/foo.jpg', 'cats.com/dancing.gif'].map(x => download(x, 'dist'))).then(() => {
            console.log('files downloaded!');
        });
    })
    .parse(process.argv);
