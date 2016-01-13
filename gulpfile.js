var basePaths = {
	src: 'src/',
	dest: 'public/assets/'
};

var paths = {
	scripts: {
		src: basePaths.src + 'scripts/',
		dest: basePaths.dest + 'js/'
	},
	styles: {
		src: basePaths.src + 'styles/',
		dest: basePaths.dest + 'css/'
	},
	images: {
		src: basePaths.src + 'images/',
		dest: basePaths.dest + 'img/'
	}
};

var gulp  			= require('gulp'),
	map 					= require('map-stream'),
	gutil 				= require('gulp-util'),
	gulpImports		= require('gulp-imports'),
	del						= require('del'),
	jshint 				= require('gulp-jshint'),
	sass 					= require('gulp-sass'),
	sourcemaps 		= require('gulp-sourcemaps'),
	concat 				= require('gulp-concat'),
	uglify 				= require('gulp-uglify'),
	minifyCSS			= require('gulp-minify-css'),
	rename				= require('gulp-rename'),
	notify				= require('gulp-notify'),
	autoprefixer	= require('gulp-autoprefixer'),
	plumber				= require('gulp-plumber');

var onCompileError = function (err) {
	gutil.log(err);
	notify.onError({
		title:    "Gulp",
		subtitle: "Compile Error!",
		message:  "<%= error.message %>",
		sound:    "Beep"
	})(err);
	gutil.log(gutil.colors.red(err));
	this.emit('end');
};

var onJSHintError = function (err) {
	//gutil.log(err);
	notify.onError({
		title:    "Gulp",
		subtitle: "JS Error!",
		message:  "<%= error.message %>",
		sound:    "Beep"
	})(err);
	this.emit('end');
};

gulp.task('default', ['build-css', /*'build-js',*/ 'watch']);
gulp.task('build-js', ['jshint', 'build-js-dependencies', 'build-js-components']);

gulp.task('clean', function () {
	del([basePaths.dest + '**']);
});

gulp.task('build-css', function () {
	return gulp.src(paths.styles.src + 'main.scss')
		.pipe(plumber({
			errorHandler: onCompileError
		}))
		// Inlude sourcemaps if gulp runs with '--type prod'
		.pipe(gutil.env.type === 'prod' ? gutil.noop() : sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({ browsers: ['> 1%', 'ios_saf 6'], map: true }))
		// Minify if gulp runs with '--type prod'
			.pipe(gutil.env.type === 'prod' ? minifyCSS() : gutil.noop())
			.pipe(gutil.env.type === 'prod' ? gutil.noop() : sourcemaps.write('.'))
			.pipe(gutil.env.type === 'prod' ? rename('styles.min.css') : rename('styles.css'))
		.pipe(gulp.dest('public/assets/css'))
		.pipe(notify('SASS Complete'));
});

gulp.task('jshint', function () {
	return gulp.src(paths.scripts.src + 'components/**/*.js')
		.pipe(plumber({
			errorHandler: onJSHintError
		}))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
        .on('error', notify.onError({ message: 'JS hint fail'}));

		/* .pipe(notify(function (file) {
			if (!file.jshint.success) {
				gutil.sound("Beep");
			}
		})) */

});

gulp.task('build-js-dependencies', function () {
	return gulp.src(paths.scripts.src + 'dependencies.js')
		.pipe(plumber({
			errorHandler: onCompileError
		}))
		.pipe(sourcemaps.init())
		.pipe(gulpImports())
		.pipe(concat('dependencies.js'))
		// Uglify if gulp runs with '--type prod'
			.pipe(gutil.env.type === 'prod' ? gutil.noop() : sourcemaps.write())
			.pipe(gutil.env.type === 'prod' ? uglify() : gutil.noop())
			.pipe(gutil.env.type === 'prod' ? rename('dependencies.min.js') : gutil.noop())
		.pipe(gulp.dest('public/assets/js'))
		.pipe(notify('JS Dependencies Complete'));
});

gulp.task('build-js-components', function () {
	return gulp.src(paths.scripts.src + 'components.js')
		.pipe(plumber({
			errorHandler: onCompileError
		}))
		.pipe(sourcemaps.init())
		.pipe(gulpImports())
		// Uglify if gulp runs with '--type prod'
			.pipe(gutil.env.type === 'prod' ? gutil.noop() : sourcemaps.write())
			.pipe(gutil.env.type === 'prod' ? uglify() : gutil.noop())
			.pipe(gutil.env.type === 'prod' ? rename('scripts.min.js') : rename('scripts.js'))
		.pipe(gulp.dest('public/assets/js'))
		.pipe(notify('JS Components Complete'));
});

gulp.task('watch', function () {
	gulp.watch(paths.scripts.src + '**/*.js', [
		'jshint',
		// 'build-js'
	]);
	gulp.watch(paths.styles.src + '**/*.scss', [
		'build-css'
	]);
});
