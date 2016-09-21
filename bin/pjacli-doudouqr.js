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
			data.url=data.urls.sort(function(a,b){
				if(a[4]>b[4]){
					return -1;
				}else{
					return 1;
				}
			})
			async.parallel(
				[function(cb) {
					async.map(data.urls.map(v => v[2]), qrcode.toDataURL, function(err, result) {
						cb(err, result);
					});
				}, function(cb) {
					async.map(data.urls.map(v => v[1]), qrcode.toDataURL, function(err, result) {
						cb(err, result);
					});
				}],
				function(err, results) {
					// console.log(err);
					// return false;
					function getType(word) {
						var v=""
						switch (word) {
							case "高":
								v="h"
								break;
							case "中":
								v="m"
								break;
							case "低":
								v="l"
								break;
							default:
								break;
						}
						return v;
					}
					var rst = results[0].map(function(v, k) {
						// console.log(data.urls[k]);
						return `
					<div id="id_${data.urls[k][0]}" class="gameItem gameItem--${getType(data.urls[k][4])}">
						<div>
							<h1>${data.urls[k][0]}</h1>
							<h2>分享语: <input type="text" name="" id="" value="${data.urls[k][3]}"/></h2>
						</div>
						<div class="gameItem__type">
							<div>doudou</div>
							<img src="${v}"/>
							<div><a href="${data.urls[k][2]}" target="_blank">${data.urls[k][2]}</a></div>
						</div>
						<div class="gameItem__type">
							<div>原游戏</div>
							<img src="${results[1][k]}"/>
							<div><a href="${data.urls[k][1]}" target="_blank">${data.urls[k][1]}</a></div>
						</div>
						<div>
							<div>测试状态:</div>
							<ol>
								<li>暂无</li>
							</ol>
						</div>
					</div>`;
					});
					var c=results[0].map(function(v,k){
						return `
						<span style="display:inline-block;margin:10px 5px;">
						<a style="display:block" href="#id_${data.urls[k][0]}" class="gameThumb gameThumb--${getType(data.urls[k][4])}">${k+1}.${data.urls[k][0]}</a>
						<input type="text" style="width:80px;display:block" value="${data.urls[k][2].replace("http://www.doudou.in/play/","")}" />
						</span>
						`
					});
					var w=['<div class="gameThumbs">',...c,'</div>'].join("");
					rst.unshift(w);
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
											.gameThumb{}
											.gameThumb--h{color:red;}
											.gameThumb--m{color:blue;}
											.gameThumb--l{color:green;}
											.gameItem--h h1{color:red;}
											.gameItem--m h1{color:blue;}
											.gameItem--l h1{color:green;}
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