'use strict';

var fs = require("fs");
var path=require("path");
var glob=require("glob");

var winston = require("winston");
winston.cli();
var commander = require("commander");

var testCom = require("../common.js");
var _ = require("lodash");
// var child_process = require("child_process");
// var path = require("path");
var async = require("async");
// var winattr = require("winattr");
var cheerio = require('cheerio');

var allGame = testCom.getAllGame();

var allGameName = allGame.map(function(v) {
    return v.split(testCom.doudouPath)[1];
});

commander
    .option("-f,--force", "强制")
    .parse(process.argv);

process.stdin.setEncoding('utf8');
var idata = []

process.on('SIGBREAK', function() {
    doBuild("cmdBREAK");
})
process.stdin.on("end", function() {
    // console.log("end");
    doBuild("main");
});
process.stdin.on('data', function(data) {
    // console.log("data");
    idata.push(data);
});

function parseLsPipeData(data) {
    var innerData = data[0].replace(testCom.specialSeperator, "").replace(/\n/, "").split(" ");
    return innerData;
}

function parseInnerData(innerData) {
    /*uniq and must in all game list*/
    var w = _.uniq(innerData).filter(function(v) {
        return _.indexOf(allGameName, v) > -1 ? true : false;
    });
    winston.log("filtered to Be:%s", w);
    winston.log("%d games are going to be builded", w.length);
    return w;
}

function doBuild(method) {
    var ag = {
        main: function() {
            idata = parseLsPipeData(idata);
            var innerData = idata.concat(commander.args);
            innerData = parseInnerData(innerData);
            winston.log(innerData);
            async.series(innerData.map(function(v) {
                return function(callback) {
                    winston.log("you are building : %s", v);
                    build(v, callback);
                }
            }))
        }
    }
    var _method = ag[method] || ag["main"];
    _method();
}


function build(gameName, callback) {
    var p = testCom.doudouPath,
        g = p + gameName + "/";
    var roothtmlfils=glob.sync("./*.@(html|htm|HTML|HTM)",{cwd:path.resolve(g)})//这里不明白case insensitive的功能不成..

    if(roothtmlfils.length>1&&!commander.force){
        winston.warn(`游戏根目录${g}的html数目大于1，不会进行后续操作 使用强大的 -f 试试吧`);
        callback();
        return false;
    }
    if (roothtmlfils.length<1) {
        winston.warn(`fail in building ${g} for not exist of .html,.htm file in this game root`);
        callback();
        return false;
    }
    var html = fs.readFileSync(path.resolve(g,roothtmlfils[0]), "utf8");
    // console.log(html);
    var $ = cheerio.load(html, {
        decodeEntities: false,
        lowerCaseTags:true
    });
    var css = `
  <link rel="shortcut icon" href="icon.jpg">
  <link rel="icon" href="icon.jpg">
  <link type="text/css" href="http://www.doudou.in/play/common/common.css" rel="stylesheet" />
  `;
    var hasJqueryOrZepto = false;
    $("title").text(function() {
        var g = $(this).text() + "--豆豆游戏";
        return g;
    })
    $("script").each(function() {
        if (($(this).attr("src") + "").search(/jquery|zepto/im) > -1) {
            hasJqueryOrZepto = true;
        }
    })
    if (hasJqueryOrZepto) {
        $("script[src*='jquery']").add($("script[src*='zepto']")).appendTo("head");
    }
    if (!hasJqueryOrZepto) {
        css += '<script type="text/javascript" src="http://www.doudou.in/play/common/zepto.min.js"></script>';
    }

    css += '<script src="http://www.doudou.in/play/common/common.js"></script>';

    $("head").append(css);

    const bodyHead = `
  <div id="wx_logo" style="margin:0 auto;display:none;">
    <img src="icon.jpg">
  </div>
  <script>
    btGame.playLogoAdv1();
  </script>
  `;
    const bodyTail = `
  <script>
  btGame.setShare({title:"分享语"});
  </script>
  <script type="text/javascript" src="http://dc.100bt.com/js/dc.js"></script>
  `;
    $("script[src*='code_statistics/cnzz.js']").remove();
    $("script[src*='code_statistics/7724common.js']").replaceWith('<script src="../7724common.js"></script>')
    $("script[src*=7724loading]").remove();
    $("script[src*=api.51h5.com/open/sdk.php]").remove();
    $("body").prepend(bodyHead).append(bodyTail);
    // console.log($.html())
    fs.writeFileSync(g+"index.html",$.html(),"utf8");
    callback();
}
