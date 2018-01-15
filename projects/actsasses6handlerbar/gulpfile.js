var gulp = require("gulp");
var zellsprite = require("zellsprite");
var livereload = require('gulp-livereload');
var autoprefixer = require("gulp-autoprefixer");
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
const rev = require('gulp-rev');
// var helpers=require("handlebars-helpers")();
var rename = require("gulp-rename");
var zreplace = require("./local/replaceFilePath.js");
var hb = require('gulp-hb');
var path = require("path");
var uglifyConfig = {
    warnings: false,
    output: {
        ascii_only: true,
        comments: /author|copyright|license/,
    }
};

zellsprite.default(gulp, {
    src: "./spritesrc",
    dest: "./style/sprites",
    templateFile: "./css.hb",
    taskName: "sprite"
});


var cssminConfig = {
    compatibility: "ie6,ie7,ie8,+selectors.ie7Hack,+properties.iePrefixHack",
    roundingPrecision: -1
};

// var qs=require("qs");
gulp.task("buildjs", function () {
    return gulp.src("./script/*.es6")
        .pipe(babel())
        // .pipe(uglify(uglifyConfig))
        .pipe(gulp.dest("./dest/script/"))
        .pipe(livereload());
});
gulp.task("buildcss", function () {
    return gulp.src("./style/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(cssmin(cssminConfig))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dest/style/"))
        .pipe(livereload());
});
gulp.task("watchjs", function () {
    return gulp.watch("./script/**/*.es6", ["buildjs"]);
});
gulp.task("watchcss", function () {
    return gulp.watch("./style/**/*.scss", ["buildcss"]);
});

gulp.task("watchautosprite", function () {
    return gulp.watch("./spritesrc/**/*", ["sprite"]);
});
gulp.task("buildHtml", function () {
    return gulp.src("./template/*.hbs")
        .pipe(hb({
            partials: './template/partials/**/*.hbs',
            helpers: './template/helpers/**/*.js',
            data: './data/*.json',
            parsePartialName: function (options, file) {
                var PATH_SEPARATOR = '/';
                var PATH_SEPARATORS = /[\\\/]/g;
                var WHITESPACE_CHARACTERS = /\s+/g;
                var WORD_SEPARATOR = '-';
                var fullPath = file.path.replace(PATH_SEPARATORS, PATH_SEPARATOR);
                var basePath = file.base.replace(PATH_SEPARATORS, PATH_SEPARATOR) + PATH_SEPARATOR;
                var shortPath = fullPath.replace(new RegExp(basePath, "i"), '');
                var extension = path.extname(shortPath);
                return shortPath
                    .substr(0, shortPath.length - extension.length)
                    .replace(WHITESPACE_CHARACTERS, WORD_SEPARATOR);
            }
        }).helpers(require('handlebars-layouts'))
        // .helpers(helpers)
        )
        .data({
            now: ((new Date() - 0) + "").substring(5)
        })
        .pipe(rename(function (path) {
            path.extname = ".html";
            return path;
        }))
        .pipe(gulp.dest("./"))
        .pipe(livereload());

})

gulp.task("watchhtml", function () {
    return gulp.watch(["./template/**/*.{js,hbs}", "./data/*.json"], ["buildHtml"]);
});
gulp.task("build", function (cb) {
    runSequence("buildHtml", "buildjs", "buildcss","copyResource", function () {
        cb();
    });
})

gulp.task("copyResource",function(){
    return gulp.src("./style/**/*.{png,jpg,mp3,mp4,webp,webm,gif,jpeg}")
    .pipe(gulp.dest("./dest/style/"));
})

gulp.task("default", function (cb) {
    runSequence("watchjs", "watchcss", "watchhtml", "build", function () {
        livereload.listen();
        cb();
    });
});
gulp.task("revImg", ["makeLocalRevMap"], function () {
    var mani = gulp.src("./rev-manifest.json");
    return gulp.src("./dest/**/*.css")
        .pipe(rev())
        .pipe(gulp.dest("./dest/"));
});

gulp.task("makeLocalRevMap", function () {
    return gulp.src(["./style/**/*.{jpeg,jpg,gif,png}"])
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest("./"));
});
gulp.task("sp", function (cb) {
    runSequence("sprite", function () {
        cb();
    });
});

gulp.task("deploy", function () {
    gulp.src(["./**/*.{html,mp3,jpg,png,js,css}", "!./node_modules/**/*", "!./gulpfile.js", "!./local/**/*", "!./deploy_dir/**/*", "!./spritesrc/**/*"]).pipe(gulp.dest("./deploy_dir"))
})