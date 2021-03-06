const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const connect = require("gulp-connect");
const ts = require("gulp-typescript");
const fileInclude = require("gulp-file-include");

sass.compiler = require("sass");

gulp.task("connect", async function (cb) {
	connect.server({
		root: "dist",
		livereload: true,
	});
	cb();
});

gulp.task("scss", async function (cb) {
	return gulp
		.src(["./src/scss/pages/**/*.scss", "./src/scss/*.scss"], {allowEmpty: true})
		.pipe(
			sourcemaps.init({
				loadMaps: true,
			})
		)
		.pipe(sass().on("error", sass.logError))
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
		.pipe(sourcemaps.write("./maps"))
		.pipe(gulp.dest("./dist/css"))
		.pipe(connect.reload());
});

gulp.task("pug", async function () {
	return gulp
		.src("./src/pug/**/*.pug", {allowEmpty: true})
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest("./dist"));
});

gulp.task("typescript", async function () {
	return gulp
		.src("./src/ts/**/*.ts", {allowEmpty: true})
		.pipe(
			sourcemaps.init({
				loadMaps: true,
			})
		)
		.pipe(
			ts({
				declaration: true,
				module: "commonjs",
			})
		)
		.pipe(sourcemaps.write("./maps"))
		.pipe(gulp.dest("./dist/js/"))
		.pipe(connect.reload());
});

gulp.task("html", async function () {
	gulp.src(["./src/html/**/*.html", "!./src/html/components/**/*.html"], {allowEmpty: true})
		.pipe(
			fileInclude({
				prefix: "@@",
				basepath: "@file",
			})
		)
		.pipe(gulp.dest("./dist"))
		.pipe(connect.reload());
});

gulp.task("watch", async function () {
	gulp.watch("./src/scss/**/*.scss", gulp.series("scss"));
	gulp.watch("./src/html/**/*.html", gulp.series("html"));
	gulp.watch("./src/pug/**/*.pug", gulp.series("pug"));
	gulp.watch("./src/ts/**/*.ts", gulp.series("typescript"));
});

gulp.task("start", gulp.series(["connect", "watch"]));
gulp.task("build", gulp.series(["scss", "pug", "typescript", "html"]));
