/* eslint no-console:0 */

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var eslint = require('gulp-eslint');

gulp.task('lint', function () {
  return gulp.src(['I18n.js', 'test/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test', ['lint'], function (cb) {
  gulp.src(['I18n.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src('test/test.js', {read: false})
        .pipe(mocha())
        .pipe(istanbul.writeReports({
          dir: './report',
          reporters: ['lcovonly', 'text', 'text-summary'],
          reportOpts: {
            lcovonly: { dir: './report', file: 'lcov.info' }
          }
        }))
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
        .on('error', function(e) { console.error(e.message); })
        .on('end', cb);
    });
});
