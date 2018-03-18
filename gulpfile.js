var gulp         = require('gulp');
// Browsersync能让浏览器实时、快速响应您的文件更改（html、js、css、sass、less等）并自动刷新页面。
var browserSync  = require('browser-sync').create(); // 创建Browsersync实例
var SSI          = require('browsersync-ssi');
var concat       = require('gulp-concat');
// minify是最小化，uglify是丑化
// 最小化，把你代码压成一行; 丑化，把你代码压成一行，并混淆丑化
var minify       = require('gulp-minify');
var cssmin       = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var fileinclude  = require('gulp-file-include');
// 加入 版本号
var rev          = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
//当发生异常时提示错误
// plumber -- gulp watch 例外错误
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var sass         = require('gulp-sass');
var less         = require('gulp-less');
var zip          = require('gulp-zip');
var clean        = require('gulp-clean');
// 同步执行任务 -- gulp 的任务的执行是异步的。 
var runSequence  = require('run-sequence');

gulp.task('serve', function() {
    // BrowserSync 监听 dist 目录
    browserSync.init({
        server: {
            baseDir:["./dist"],
            middleware:SSI({
                baseDir:'./dist',
                ext:'.shtml',
                version:'2.10.0'
            })
        }
    });
    // watch -- 将文件编译到 dist 目录下, 触发 BrowserSync
    gulp.watch("app/scss/**/*.scss", ['sass']);
    gulp.watch("app/less/**/*.less", ['less']);
    gulp.watch("app/scripts/**/*.js", ['js']);
    gulp.watch("app/**/*.html", ['html']);
    // browserSync.reload -- 浏览器重载
    gulp.watch("dist/**/*.html").on("change", browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
// 编译SASS 且 自动注入到浏览器
gulp.task('sass', function() {
    // browserSync.stream() -- 该 stream 方法返回一个变换流，并且可以充当一次或多个文件。
    return gulp.src("app/scss/**/*.scss")
        // .pipe(plumber())
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(sass.sync().on('error', sass.logError))
        // 代码 compact使紧密结合
        .pipe(sass({outputStyle: "compact"}))
        // .pipe(autoprefixer())
        .pipe(autoprefixer({
            browsers: ['last 50 version', '> 0.1%'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
        }))
        .pipe(gulp.dest("dist/styles"))
        .pipe(browserSync.stream());
});

gulp.task('less', function() {
    return gulp.src("app/less/**/*.less")
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(less())
        // .pipe(autoprefixer())
        .pipe(autoprefixer({
            browsers: ['last 50 version', '> 0.1%'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
        }))
        .pipe(cssmin())
        // 兼容 IE7 及 以下需设置 compatibility 属性
        // .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(gulp.dest("dist/styles"))
        .pipe(browserSync.stream());
});

// javscript files operate
gulp.task('js', function(){
    // minify() -- gulp-minify 压缩 js 代码
    return gulp.src('app/scripts/**/*.js')
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(minify())
        .pipe(gulp.dest("dist/scripts"))
        .pipe(browserSync.stream());
});

// 处理 html 文件
gulp.task('html', function() {
    // 排除 publicHTML 下的 html
    return gulp.src(["app/*.html", "!app/publicHTML/*.html"])
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest("dist/"))
        .pipe(browserSync.stream());
});

// CSS生成文件hash编码 并 生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function() {

    return gulp.src("dist/styles/**/*.css")
        // .pipe(plumber())
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(rev()) // 设置 hash 值
        .pipe(gulp.dest('dist/styles'))
        .pipe(rev.manifest()) // 生产 hash 值得 json 文件
        .pipe(gulp.dest('dist/rev/css')); // 保存 hash 值得 json 文件
});

//Html替换css、js文件版本
gulp.task('revHtml', function () {
    return gulp.src(["dist/rev/**/*.json", "dist/*.html"])
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(revCollector({ // Html -- 替换 css、js文件版本
            replaceReved: true
        }))
        .pipe(gulp.dest("dist/"));
});

// 清空目标文件
gulp.task('clean', function () {
    console.log('clean');
    return gulp.src(['dist'], {read: false})
        .pipe(clean());
});

// publish -- 打包发布目标文件
gulp.task('publish', function() {
    // dist css 和 js hash

    return gulp.src('dist/**/*')
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(zip('publish.zip'))
        .pipe(gulp.dest('release'))
});

// build 构建
gulp.task('build', function (done) {
    condition = false;
    runSequence(
        ['revCss'],
        ['revHtml'],
        ['publish'],
        done);
});

// 开发 dev 构建
gulp.task('dev', function (done) {
    condition = false;
    runSequence(
        ['clean'],
        ['html', 'js', 'sass', 'less'],
        ['serve'],
        done);
});

// 编辑默认任务
gulp.task('default', ['dev']);

