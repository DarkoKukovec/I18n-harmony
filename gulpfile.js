var gulp = require('gulp');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');

gulp.task('lint', function () {
  return gulp.src(['index.js', 'test/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test', ['lint'], function () {
  return gulp.src('test/test.js', {read: false})
    .pipe(mocha());
});
