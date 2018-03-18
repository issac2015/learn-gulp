// var src = './src';
var src = 'app';
var dest = 'dist';
// 请勿 修改 rev -- 没有写
// less 和 sass 都在 dest + "/css" -- 没有写

module.exports = {
	version: '1.0.0',
	src: src,
	dest: dest,
	less: {
		all: src + "/less/**/*.less", // 所有 less
        src: src + "/less/*.less", // 需要编译的 less
        dest: dest + "/css", // 输出目录
        rev: dest + "/rev/css",
        settings: { // 编译 less 过程需要的配置，可以为空

        }
	},
	sass: {
		all: src + "/scss/**/*.scss", // 所有scss
        src: src + "/scss/*.scss", // 需要编译的scss
        dest: dest + "/css", // 输出目录
        rev: dest + "/rev/css",
        settings: { // 编译 scss 过程需要的配置，可以为空

        }
	},
	js: {
		src: src + "/js/**/*.js",
        dest: dest + "/js",
        rev: dest + "/rev/js"
	},
	html: {
		src: src + "/**/*.html",
        dest: dest,
        ignore: ["!"+src+"/publicHTML/*.html"]
	},
	rev: {

	}
};