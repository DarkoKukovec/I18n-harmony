/* eslint no-console:0 */

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var eslint = require('gulp-eslint');
// var merger = require ('lcov-result-merger');
var Server = require('karma').Server;

gulp.task('lint', function () {
  return gulp.src(['I18n.js', 'test/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test', ['lint'], function (cb) {
  gulp.src('I18n.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src('test/test.js', {read: false})
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

gulp.task('test-karma', function(cb) {
  new Server({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, function() {
    cb();
  }).start();
});

// gulp.task('test', ['test-node', 'test-karma'], function() {
//   gulp.src(['report/node/lcov.info', 'report/karma/**/lcov.info'])
//     .pipe(merger())
//     .pipe(gulp.dest('./report/'));
// });
