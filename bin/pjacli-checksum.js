/// <reference path="../typings/index.d.ts" />
'use strict';
var commander = require("commander");
var checksum = require('checksum');
var async = require("async");
var glob = require("glob");
var path=require("path");
var chalk = require('chalk');
commander
    .usage('<projectType ...>')
    .description('检查文件checksum')
	.option("-a,--algorithm <string>", "算法指定，默认是sha256")
	.option("-c,--compare", "如果比较则只返回前两个的比较结果：true/false")
	.option("-g,--glob", "假设输入的是glob多个的话会合并之")
    .action(function (...input) {
		let cmd=input.pop();
		// console.log(cmd.algorithm);
		if(cmd.compare&&cmd.compare!=-1){
			input=input.slice(0,2);
		}
		if(cmd.glob&&cmd.glob!=-1){
			let _t=[];
			input.forEach((v)=>{
				_t=_t.concat(glob.sync(v));
			})
			input=_t;
		}
        async.map(input.map(v=>path.resolve(v)), function (item, cb) {
            checksum.file(item, {
                algorithm: (cmd.algorithm&&cmd.algorithm!=-1)?cmd.algorithm:"sha256"
            }, function (err, rst) {
                cb(err, `${item}\n${chalk.yellow(rst)}\n`);
            });
        }, function (err, rst) {
            if(cmd.compare&&cmd.compare!=-1){
				console.log(chalk.blue(`compare=>${rst[0]==rst[1]?"same":"different"}`));
			}else{
				console.log(chalk.blue(rst.join("\n"))+chalk.grey(`\n total:${rst.length} files`));
			}
        });

    })
    .parse(process.argv);
