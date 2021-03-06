/* eslint no-console:0 */

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var eslint = require('gulp-eslint');
var compiler = require('google-closure-compiler-js').gulp();

var runSequence = require('run-sequence');

var git = require('gulp-git');

gulp.task('lint', function () {
  return gulp.src(['I18n.js', 'test/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('full-test', ['lint'], function (cb) {
  gulp.src('I18n.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src('test/I18n.test.js', {read: false})
        .pipe(mocha())
        .pipe(istanbul.writeReports({
          dir: './report',
          reporters: ['lcovonly', 'text', 'text-summary', 'html'],
          reportOpts: {
            lcovonly: { dir: './report/node', file: 'lcov.info' },
            html: { dir: './report/node-html' }
          }
        }))
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
        .on('error', function(e) { console.error(e.message); })
        .on('end', cb);
    });
});

gulp.task('closure-compiler', function() {
  return gulp.src('I18n.js')
    .pipe(compiler({
      compilationLevel: 'ADVANCED',
      jsOutputFile: 'I18n.min.js',
      createSourceMap: false,
      warningLevel: 'QUIET',
      languageIn: 'ECMASCRIPT5_STRICT'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('min-test', function (cb) {
  gulp.src('I18n.min.js')
    .on('finish', function () {
      gulp.src('test/I18n.min.test.js', {read: false})
        .pipe(mocha())
        .on('error', function(e) { console.error(e.message); })
        .on('end', cb);
    });
});

gulp.task('minify', function (cb) {
  runSequence('closure-compiler', 'min-test', cb);
});

gulp.task('precommit', ['test'], function() {
  return gulp.src('I18n.min.js')
    .pipe(git.add());
});

gulp.task('test', function (cb) {
  runSequence('full-test', 'minify', cb);
});
