/// <reference path="../typings/index.d.ts" />
/* f_url commander component
 * To use add require('../cmds/f-url.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';
var commander = require("commander");
// var fs = require("fs");
var path = require("path");
// var ncp = require('ncp').ncp;
// var async = require("async");
// var glob = require("glob");
var cpy=require("cpy")
// ncp.limit = 16;
// var Util = require("util");
var codeBase = __dirname;
commander
	.usage('<projectType ...>')
	.description("输入projectType创建一个目录在当前目录")
	.action(function (input) {
		var a = {
			act01: {
				paths: [path.join(codeBase, "../projects/actsasses6handlerbar/*")],
			}
		}
		var source = a[input];
		if (source) {
			cpy(source.paths, process.cwd(),{parents:true}).then(() => {
				console.log('files copied');
			});
		} else {
			throw new Error("项目类型不存在");
		}
	})
	.parse(process.argv);