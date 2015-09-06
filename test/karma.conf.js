module.exports = function(config) {
  config.set({
    browsers : ['Chrome'],
    // browsers: ['PhantomJS'],
    frameworks: ['mocha'],
    basePath: '../',
    files: [
      'node_modules/chai/chai.js',
      'node_modules/lodash/index.js',
      'I18n.js',
      'test/runner.js'
    ],

    preprocessors: {
      'I18n.js': ['coverage']
    },

    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type : 'lcov',
      dir : 'report/karma'
    }
  });
};
