/**
 * BUILD TASKS
 */

import config from './config';
import gulp from 'gulp';
import gutil from 'gulp-util';
// import babelify from 'babelify';
import browserify from 'browserify';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourceMaps from 'gulp-sourcemaps';
import runSequence from 'run-sequence';
import livereload from 'gulp-livereload';
import cordovaLib from 'cordova-lib';
import fs from 'fs';
import del from 'del';
import concat from 'gulp-concat';
import mkdirp from 'mkdirp';
import replace from 'gulp-replace';
import {argv} from 'yargs';

let cdv = cordovaLib.cordova.raw;

/**
 * Clean - deletes and recreates build directory.
 */
gulp.task('build:recreate-dirs', function (cb) {
  runSequence('build:delete-dir', 'build:create-dirs', cb);
});

/**
 * Delete build directory.
 */
gulp.task('build:delete-dir', function (cb) {
  del(['build'], cb);
});

/**
 * Creates the build directory and subdirectories res, www/js, www/css
 */
gulp.task('build:create-dirs', function (cb) {

  mkdirp(config.BUILD_DIR + '/res', function() {
    mkdirp(config.BUILD_WEB_DIR + '/css', function () {
      mkdirp(config.BUILD_WEB_DIR + '/js', cb);
    });
  });

});

/**
 * Copies the images into build/www/images. Later we could add optimisation if we want.
 */
gulp.task('build:images', function () {
  return gulp.src(config.CLIENT_SRC_DIR + '/images/**/*')
    .pipe(gulp.dest(config.BUILD_WEB_DIR + '/images'))
    .pipe(livereload());
});

/**
 * Copies the audio files into build/www/audio.
 */
gulp.task('build:audio', function () {
  return gulp.src(config.CLIENT_SRC_DIR + '/audio/**/*')
    .pipe(gulp.dest(config.BUILD_WEB_DIR + '/audio'))
    .pipe(livereload());
});

/**
 * Copies the fonts into build/www/fonts. Later we could add optimisation if we want.
 */
gulp.task('build:fonts', function () {
  return gulp.src(config.CLIENT_SRC_DIR + '/fonts/**/*')
    .pipe(gulp.dest(config.BUILD_WEB_DIR + '/fonts'))
    .pipe(livereload());
});

/**
 * Copies the HTML into build/www/. Later we could add e.g. minification, if it'd make much difference inside an app?
 */
gulp.task('build:html', function () {

  return gulp.src(config.CLIENT_SRC_DIR + '/*.html')
    .pipe(gulp.dest(config.BUILD_WEB_DIR))
    .pipe(livereload());
});

/**
 * Copies vendor scripts into build/js directory
 */
gulp.task('build:vendor', function () {

  return gulp.src(config.CLIENT_SRC_DIR + '/scripts/vendor/**/*')
    .pipe(gulp.dest(config.BUILD_WEB_DIR + '/js'))
    .pipe(livereload());

});

/**
 *  Compile and concatenate the SCSS files into build/www/css/styles.css
 */
gulp.task('build:sass', function () {

  return gulp.src(config.CLIENT_SRC_DIR + '/sass/**/*.scss')
    .pipe(sourceMaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer('last 5 versions'))
    .pipe(sourceMaps.write())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(config.BUILD_WEB_DIR + '/css'))
    .pipe(livereload());
});

/**
 *  Transpile and concatenate the JavaScripts into build/www/js/bundle.js
 */
gulp.task('build:babel', ['lint', 'test'], function () {
  // Add `fullPaths: true` temporarily if you want to use discify (https://github.com/hughsk/disc)
  return browserify(config.CLIENT_SRC_DIR + '/scripts/main.js', {debug: false})
    .transform('babelify', {presets: ['es2015', 'react']})
    .bundle()
    .on('error', function (err) {
      gutil.log('Babelify error', err.message);
    })
    .pipe(fs.createWriteStream(config.BUILD_WEB_DIR + '/js/bundle.js'));

});

/**
 * Run Cordova build for iOS only.
 */
gulp.task('build:cordova:ios', ['build:cordova:res:ios'], function(cb) {
  runSequence('build:cordova:config', 'build:cordova:cdv:ios', cb);
});

/**
 * Run Cordova build for Android only.
 */
gulp.task('build:cordova:android', ['build:cordova:res:android'], function(cb) {
  runSequence('build:cordova:config', 'build:cordova:cdv:android', cb);
});

/**
 * Build for iOS only.
 */
gulp.task('build:ios', ['build:web', 'build:cordova:ios'], function() {
});

/**
 * Build for Android only.
 */
gulp.task('build:android', ['build:web', 'build:cordova:android'], function() {
});

/**
 * Run Cordova build for all platforms.
 */
gulp.task('build:cordova', ['build:cordova:res:android', 'build:cordova:res:ios'], function(cb) {
  runSequence('build:cordova:config', 'build:cordova:cdv', cb);
});

/**
 * Copies over config.xml into the build directory (previously we did this with a symlink but that was a problem
 * on Windows).
 */
gulp.task('build:cordova:config', function () {

  const bundleId = argv.bundleId ? argv.bundleId : 'com.pebblecode.collrio';

  return gulp.src(process.cwd() + '/src/config.xml')
    .pipe(replace(/{{BUNDLE_ID}}/g, bundleId))
    .pipe(gulp.dest(config.BUILD_DIR));
});

gulp.task('build:cordova:cdv:ios', function() {
  process.chdir(config.BUILD_DIR);
  return cdv.build({ platforms: ['ios'] });
});

gulp.task('build:cordova:cdv:android', function() {
  process.chdir(config.BUILD_DIR);
  return cdv.build({ platforms: ['android'] });
});

gulp.task('build:cordova:cdv', function() {
  process.chdir(config.BUILD_DIR);
  return cdv.build();
});

gulp.task('build:cordova:res:android', function() {
  return gulp.src(process.cwd() + '/src/res/android/**/*')
    .pipe(gulp.dest(config.BUILD_DIR + '/res/android'));
});

gulp.task('build:cordova:res:ios', function() {
  return gulp.src(process.cwd() + '/src/res/ios/**/*')
    .pipe(gulp.dest(config.BUILD_DIR + '/res/ios'));
});

/**
 * Create the Cordova project under ./build/ for all platforms.
 * This is kind of equivalent of the 'cordova create' command, but we don't actually need that.
 */
gulp.task('build:cordova:create', function() {

  process.chdir(config.BUILD_DIR);

  // Must first add plugins then platforms (otherwise Cordova fails, expecting to find the ./build/plugins directory).
  return cdv.plugins('add', config.CORDOVA_PLUGINS)
    .then(function () {
      return cdv.platform('add', config.CORDOVA_PLATFORM_DIRS);
    });
});

/**
 * Run Web builds (Sass, Babel etc). First time you'll need to do a full `clean` first.
 */
gulp.task('build:web', ['build:html', 'build:fonts', 'build:audio', 'build:images', 'build:sass', 'build:vendor', 'build:babel'], function () {
});

/**
 * By default builds Web version and native versions.
 */
gulp.task('build', ['build:web', 'build:cordova']);

/**
 * Recreate Cordova project - recreates the build directory and performs 'build:cordova:create'.
 * The actual build step is currently separate.
 */
gulp.task('build:clean', function (cb) {
  runSequence('build:recreate-dirs', 'build:cordova:config', ['build:cordova:res:android', 'build:cordova:res:ios'],
    'build:cordova:create', cb);
});

/**
 * Shorthand for build clean task.
 */
gulp.task('clean', ['build:clean']);
