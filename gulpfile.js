const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const connect = require("gulp-connect");
const ts = require("gulp-typescript");

sass.compiler = require("sass");

gulp.task("connect", function (cb) {
	connect.server({
		root: "dist",
		livereload: true,
	});
	cb();
});

gulp.task("scss", function (cb) {
	return gulp
		.src("./src/scss/**/*.scss", {allowEmpty: true})
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("./dist/css"))
		.pipe(connect.reload());
});

gulp.task("pug", function () {
	return gulp.src("./src/pug/**/*.pug").pipe(pug()).pipe(gulp.dest("./dist")).pipe(connect.reload());
});

gulp.task("typescript", function () {
	return gulp
		.src("./src/ts/**/*.ts")
		.pipe(sourcemaps.init())
		.pipe(
			ts({
				declaration: true,
				module: "commonjs",
			})
		)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("./dist/js"))
		.pipe(connect.reload());
});

gulp.task("watch", function () {
	gulp.watch("./src/scss/**/*.scss", gulp.series("scss"));
	gulp.watch("./src/pug/**/*.pug", gulp.series("pug"));
	gulp.watch("./src/ts/**/*.ts", gulp.series("typescript"));
});

gulp.task("start", gulp.series(["connect", "watch"]));
gulp.task("build", gulp.series(["scss", "pug", "typescript"]));
