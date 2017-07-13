var gulp = require("gulp");

var ejs = require("gulp-ejs"),
    sass = require("gulp-sass"),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    pleeease = require("gulp-pleeease"),
    browser = require("browser-sync");

var source = "src/",
    dest = "dist/";


// default task
gulp.task('default', ['watch']);

//ejs
gulp.task("ejs", function() {
    gulp.src(
        [source + "ejs/**/*.ejs",'!' + source + "ejs/**/_*.ejs"]
    )
    .pipe(ejs())
    .pipe(gulp.dest(dest))
    .pipe(browser.reload({stream:true}));
});

// copy bootstrap required fonts to dest
gulp.task('fonts', function () {
    return gulp
        .src([source + 'fonts/*.*', './node_modules/bootstrap-sass/assets/fonts/**/*'])
        .pipe(gulp.dest(dest + 'fonts/'));
});

// compile scss
gulp.task('sass', ['fonts'], function () {
    return gulp.src(source + 'sass/main.scss')
        .pipe(sass({
            outputStyle: 'nested',
            precison: 3,
            errLogToConsole: true,
            includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets']
        }))
        .pipe(gulp.dest(dest + 'css/'))
        .pipe(browser.reload({stream:true}));
});

// jshint
gulp.task("jshint", function() {
    return gulp.src(source + "js/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

// copy js
gulp.task("js", function() {
    return gulp.src(source + "js/**/*.js")
        .pipe(gulp.dest(dest + "js"));
});

// lib
gulp.task("lib", function() {
    return gulp.src([
            './node_modules/jquery/dist/jquery.js',
            './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(dest + 'js'));
});

// images
gulp.task("images", function() {
    return gulp.src(source + "images/**/*")
        .pipe(gulp.dest(dest + "images"));
});

// browser sync
gulp.task("server", function() {
    browser({
        server: {
            baseDir: dest
        },
        port: 3000
    });
});

// build
gulp.task('build', ["ejs","sass","jshint","js","lib","images"]);

// watch
gulp.task('watch', ["build", "server"], function() {
    gulp.watch(source + "ejs/**/*.ejs",["ejs"]);
    gulp.watch(source + "sass/**/*.scss",["sass"]);
    gulp.watch(source + "js/**/*.js",["jshint","js"]);
    gulp.watch(source + "images/**/*",["images"]);
});