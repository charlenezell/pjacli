/// <reference path="../typings/index.d.ts" />
/* f_url commander component
 * To use add require('../cmds/f-url.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';
var request = require('request').defaults({
	encoding: null
});
var commander = require("commander");
var fs = require("fs");
var path = require("path");
var Util = require("util");
// var del = require("del");

commander
	.usage('<file/url ...>')
	.description("暂时支持本地路径而已，url将来可以支持")
	.action(function(input) {
		if (!/^http/.test(input)) {
			if (fs.existsSync(input)) {
				let content = fs.readFileSync(input);
				let ext = path.extname(input).substr(1);
				console.log(`data:image/${ext};base64,${content.toString('base64')}`);
			}
		} else {
			// let temp=fs.createWriteStream('temp.png');
			// let ext=path.extname(input).substr(1);
			// temp.on("close",function(err,cont){
			// 	let content=fs.readFileSync("./temp.png");
			// 	console.log(`data:image/${ext};base64,${content.toString('base64')}`);
			// 	del.sync("./temp.png");
			// });
			// request(input).pipe(temp);

			request(input, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					let data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
					console.log(data);
				}
			})
		}
	})
	.parse(process.argv);