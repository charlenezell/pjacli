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
			async.parallel(
				[function(cb) {
					async.map(data.urls.map(v => v[0]),qrcode.toDataURL,function(err,result){
						cb(err,result);
					});
				}, function(cb) {
					async.map(data.urls.map(v => v[2]),qrcode.toDataURL,function(err,result){
						cb(err,result);
					});
				}],
				function(err, results) {
					// console.log(err);
					// return false;
					var rst = results[0].map(function(v, k) {
						return `
					<div class="gameItem">
						<div>
							<h1>${data.urls[k][1]}</h1>
						</div>
						<div class="gameItem__type">
							<div>doudou</div>
							<img src="${v}"/>
							<div><a href="${data.urls[k][0]}" target="_blank">${data.urls[k][0]}</a></div>
						</div>
						<div class="gameItem__type">
							<div>原游戏</div>
							<img src="${results[1][k]}"/>
							<div><a href="${data.urls[k][2]}" target="_blank">${data.urls[k][2]}</a></div>
						</div>
						<div>
							<div>测试状态:</div>
							<ol>
								<li>暂无</li>
							</ol>
						</div>
					</div>`;
					});

					rst.unshift(`<!DOCTYPE html>
							<html lang="en">
							<head>
								<meta charset="UTF-8">
								<title>豆豆游戏_${new Date().toLocaleDateString()}</title>
								<style>
											.gameItem{
												margin:10px 0;
												padding:10px;
												background-color:#e0e0e0;
											}
											.gameItem img{
												width:200px;
											}
											.gameItem__type{
												background-color:#d0d0d0;
												margin:5px 0;
												padding:10px;
											}
											</style>
							</head>
							<body>
							<div>生成时间:${new Date().toLocaleString()}</div>
											`);
					rst.push(`
							</body>
						</html>
					`);
					fs.writeFileSync(`豆豆游戏_${new Date().toLocaleDateString()}.html`, rst.join(""), {
						encode: "utf8"
					});

				});
		}
	})
	.parse(process.argv);