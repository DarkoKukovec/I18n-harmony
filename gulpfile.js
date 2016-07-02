/* eslint no-console:0 */

var fs = require('fs');
var http = require('http');
var path = require('path');

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var eslint = require('gulp-eslint');

var runSequence = require('run-sequence');
var _ = require('lodash');

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

gulp.task('closure-compiler', function(done) {
  var postData = _.map({
    js_code: fs.readFileSync(path.join(__dirname, 'I18n.js'), 'utf-8'),
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    output_info: 'compiled_code',
    output_format: 'text',
    warning_level: 'QUIET',
    language: 'ECMASCRIPT5_STRICT',
    language_out: 'ECMASCRIPT5'
  }, function(value, key) {
    return key + '=' + encodeURIComponent(value);
  }).join('&');

  var postOptions = {
    host: 'closure-compiler.appspot.com',
    port: '80',
    path: '/compile',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  var minFile = fs.createWriteStream('I18n.min.js');
  var postReq = http.request(postOptions, function(res) {
    res.setEncoding('utf8');
    res.pipe(minFile);
    res.on('end', done);
  });

  postReq.write(postData);
  postReq.end();
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
