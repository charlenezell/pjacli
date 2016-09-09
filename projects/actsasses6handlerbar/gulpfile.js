var gulp = require("gulp");
var zellsprite=require("zellsprite");
var livereload = require('gulp-livereload');
var autoprefixer = require("gulp-autoprefixer");
var runSequence = require('run-sequence');
var sass = require('gulp-ruby-sass');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var zreplace=require("./local/replaceFilePath.js");
var hb = require('gulp-hb');
var uglifyConfig = {
    warnings: false,
    output: {
        ascii_only: true,
        comments: /author|copyright|license/,
    }
};

zellsprite.default(gulp,{src:"./spritesrc",dest:"./style/sprites",templateFile:"./css.hb",taskName:"sprite"});


var cssminConfig = {
  compatibility: "ie6,ie7,ie8,+selectors.ie7Hack,+properties.iePrefixHack",
  roundingPrecision:-1
};

// var qs=require("qs");
gulp.task("buildjs", function() {
     return gulp.src("./script/*.es6")
        .pipe(babel())
        .pipe(uglify(uglifyConfig))
        .pipe(gulp.dest("./dest/script/"))
        .pipe(livereload());
});
gulp.task("buildcss", function() {
    return sass(["./style/*.scss"], {
            sourcemap: false,
            emitCompileError: false,
            "load-path" :"e:/projectA/source/web/resource/marketnew/common/src/scss/common"
        })
        .pipe(autoprefixer())
        .pipe(zreplace(/style\/sprites/img,"../../style/sprites"))
        .pipe(cssmin(cssminConfig))
        .pipe(gulp.dest("./dest/style/"))
        .pipe(livereload());
});
gulp.task("watchjs", function() {
    return gulp.watch("./script/**/*.es6", ["buildjs"]);
});
gulp.task("watchcss", function() {
    return gulp.watch("./style/**/*.scss",["buildcss"]);
});
gulp.task("buildHtml",function () {
    return gulp.src("./template/*.html")
                .pipe(hb({
                    partials:'./template/partials/**/*.hbs',
                    helpers:'./template/helpers/**/*.js',
                    data:'./data/*.json'
                }))
                .pipe(gulp.dest("./"))
                .pipe(livereload());

})

gulp.task("watchhtml", function() {
    return gulp.watch(["./template/**/*.{html,js,hbs}"], ["buildHtml"]);
});

gulp.task("default",function(cb){
  runSequence("sprite","watchjs", "watchcss", "watchhtml","buildHtml", "buildjs","buildcss",function(){
      livereload.listen();
      cb();
  });
});