/// <reference path="../typings/index.d.ts" />
/* f_url commander component
 * To use add require('../cmds/f-url.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';
var commander = require("commander");
// var fs = require("fs");
var path = require("path");
var vfs = require('vinyl-fs');
// var ncp = require('ncp').ncp;
// var async = require("async");
// var glob = require("glob");
// var cpy=require("cpy")
// ncp.limit = 16;
// var Util = require("util");
var codeBase = __dirname;
commander
	.usage('<projectType ...>')
	.description('创建新项目模板(act01=>[sass,babel,handlebars,sprite],\n act01b=>[sass,babel,handlebars,sprite] with browserify bundle')
	.action(function (input) {
		var a = {
			act01: {
				paths: [path.join(codeBase, "../projects/actsasses6handlerbar/**/*"),"!"+path.join(codeBase, "../projects/actsasses6handlerbar/style/sprites/*")]
			},
			act01b:{
				paths: [path.join(codeBase, "../projects/actsasses6handlerbarbrowserifybundle/**/*"),"!"+path.join(codeBase, "../projects/actsasses6handlerbarbrowserifybundle/style/sprites/*")]
			}
		}
		var source = a[input];
		if (source) {
			vfs.src(source.paths.map(v=>v.replace(/\\/g,"/")),{
				dot:true
			}).pipe(vfs.dest("./"));
		} else {
			throw new Error("项目类型不存在");
		}
	})
	.parse(process.argv);
