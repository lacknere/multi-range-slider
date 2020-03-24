var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var sass = require('gulp-sass');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', function () {
    tsProject = tsProject.src()
        .pipe(tsProject());

    return merge([
        tsProject.dts.pipe(gulp.dest('dist/definitions')),
        tsProject.js.pipe(gulp.dest('dist/js'))
    ]);
});

gulp.task('sass', function () {
    return gulp.src('src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch:scripts', function () {
    return gulp.watch('src/**/*.ts', gulp.series('scripts'));
});

gulp.task('watch:sass', function () {
    return gulp.watch('*.scss', gulp.series('sass'));
});