var gulp         = require('gulp');
// Browsersync能让浏览器实时、快速响应您的文件更改（html、js、css、sass、less等）并自动刷新页面。
var browserSync  = require('browser-sync').create(); // 创建Browsersync实例
var SSI          = require('browsersync-ssi');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
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
// 配置文件
var config       = require('./config');

gulp.task('serve', function() {
    // BrowserSync 监听 dist 目录
    browserSync.init({
        server: {
            baseDir:[config.dest],
            middleware:SSI({
                baseDir: config.dest,
                ext: '.shtml',
                version: '2.10.0'
            })
        }
    });
    // watch -- 将文件编译到 dist 目录下, 触发 BrowserSync
    gulp.watch(config.sass.all, ['sass']);
    gulp.watch(config.less.all, ['less']);
    gulp.watch(config.js.src, ['js']);
    gulp.watch(config.html.src, ['html']);
    // browserSync.reload -- 浏览器重载
    gulp.watch(config.html.dest).on("change", browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
// 编译SASS 且 自动注入到浏览器
gulp.task('sass', function() {
    // browserSync.stream() -- 该 stream 方法返回一个变换流，并且可以充当一次或多个文件。
    return gulp.src(config.sass.all)
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
        .pipe(cssmin())
        // 兼容 IE7 及 以下需设置 compatibility 属性
        // .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(gulp.dest(config.sass.dest))
        .pipe(browserSync.stream());
});

gulp.task('less', function() {
    return gulp.src(config.less.all)
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
        .pipe(gulp.dest(config.less.dest))
        .pipe(browserSync.stream());
});

// javscript files operate
gulp.task('js', function(){
    return gulp.src(config.js.src)
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(uglify({
            mangle: false
            // mangle: true,// 类型：Boolean 默认：true 是否修改变量名  
            // mangle: {except:['require','exports','module','$']} // 排除混淆关键字 
        })) // 压缩，丑化代码
        .pipe(gulp.dest(config.js.dest))
        .pipe(browserSync.stream());
});

// 处理 html 文件
gulp.task('html', function() {
    // 排除 publicHTML 下的 html
    return gulp.src([config.html.src].concat(config.html.ignore))
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest(config.html.dest))
        .pipe(browserSync.stream());
});

// CSS生成文件hash编码 并 生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function() {
    return gulp.src(config.dest+"/css/**/*.css")
        // .pipe(plumber())
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(rev()) // 设置 hash 值
        .pipe(gulp.dest(config.dest+"/css"))
        .pipe(rev.manifest()) // 生产 hash 值得 json 文件
        .pipe(gulp.dest(config.dest+'/rev/css')); // 保存 hash 值得 json 文件
});

//Html替换css、js文件版本
gulp.task('revHtml', function () {
    return gulp.src([config.dest+"/rev/**/*.json", config.dest+"/*.html"])
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(revCollector({ // Html -- 替换 css、js文件版本
            replaceReved: true
        }))
        .pipe(gulp.dest(config.dest));
});

// 清空目标文件
gulp.task('clean', function () {
    console.log('clean');
    return gulp.src([config.dest], {read: false})
        .pipe(clean());
});

// publish -- 打包发布目标文件
gulp.task('publish', function() {
    // dist css 和 js hash

    return gulp.src(config.dest+'/**/*')
        .pipe(plumber({errorHandler:notify.onError('Error:<%=error.message%>')}))
        .pipe(zip('publish.'+config.version+'.zip'))
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
        // ['serve'],
        done);
});

// 编辑默认任务
gulp.task('default', ['dev']);
