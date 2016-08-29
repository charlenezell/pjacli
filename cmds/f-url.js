/// <reference path="../typings/index.d.ts" />
/* f_url commander component
 * To use add require('../cmds/f-url.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';
var qrcode=require("qrcode");
var async=require("async");

var fs=require("fs");

module.exports = function(program) {

	program
		.command('f-url')
		.version('0.0.1')
		.description('generate url qrcodes by config provide a default html template')
		.action(function (input,template) {
			var data=JSON.parse(fs.readFileSync(input,"utf8"));
			async.map(data.urls.map(function(v){
				return v[0];
			}),qrcode.toDataURL,function(err,result){
				fs.writeFileSync("./result.html",result.map(function(v,k){
					return `
					<div>
						<span>${data.urls[k][1]}</span>
					</div>
					<div>
						<img src="${v}"/><a href="${data.urls[k][0]}" target="_blank">${data.urls[k][0]}</a>
					</div>`;
				}).join(""),{encode:"utf8"});
			})
		});

};
