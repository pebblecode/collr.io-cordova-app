/**
 * TEST TASKS
 */

let config = require('./config');
let gulp = require('gulp');
let esLint = require('gulp-eslint');
let jest = require('jest-cli');

/**
 * Perform ESLint checks.
 */
gulp.task('lint', function () {
  return gulp.src(
    [
      config.CLIENT_SRC_DIR+'/scripts/**/*.js',
      config.CLIENT_SRC_DIR+'/scripts/**/*.jsx',
      '!'+config.CLIENT_SRC_DIR+'/scripts/vendor/**/*'
    ])
    .pipe(esLint())
    .pipe(esLint.format());
});

gulp.task('test', function (done) {

  jest.runCLI(
    {
      config: {
        rootDir : './src',
        scriptPreprocessor : '<rootDir>../node_modules/babel-jest',
        testFileExtensions : ['es6', 'js'],
        moduleFileExtensions : ['js', 'json', 'es6', 'jsx'],
        unmockedModulePathPatterns : ['<rootDir>../node_modules/react']
      }
    },
    './src',
    function(success) {
      done( success ? null : 'Jest failed');
      process.on('exit', function() {
        process.exit(success ? 0 : 1);
      });
    }
  );

});
