/// <reference path="../typings/index.d.ts" />
/* f_url commander component
 * To use add require('../cmds/f-url.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';
var qrcode = require("qrcode");
var async = require("async");
var commander = require("commander");
var fs = require("fs");
// var Util = require("util");
commander
	.usage('<file ...>')
	.description("游戏列表JSON（不支持ls的pipe），数据格式见/demo目录的a.json")
	.action(function(input) {
		if (fs.existsSync(input)) {
			var data = JSON.parse(fs.readFileSync(input, "utf8"));
			async.map(data.urls.map(function(v) {
				return v[0];
			}), qrcode.toDataURL, function(err, result) {
				fs.writeFileSync("./result.html", result.map(function(v, k) {
					return `
					<div>
						<span>${data.urls[k][1]}</span>
					</div>
					<div>
						<img src="${v}"/><a href="${data.urls[k][0]}" target="_blank">${data.urls[k][0]}</a>
					</div>`;
				}).join(""), {
					encode: "utf8"
				});
			})
		}
	})
	.parse(process.argv);