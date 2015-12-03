/**
 * DEVELOPMENT / RUN TASKS
 */

import config from './config';
import gulp from 'gulp';
import gutil from 'gulp-util';
import livereload from 'gulp-livereload';
import server from '../../server';
import cordovaLib from 'cordova-lib';

let cdv = cordovaLib.cordova.raw;

/**
 * Platform is currently either 'ios' or 'android'
 */
function runOnDevice(platform) {

  gutil.log('Attempting to run on ' + platform + ' device');

  process.chdir(config.BUILD_DIR);

  return cdv.run({platforms: [platform], options: {'device': true}});
}

/**
 * Platform is currently either 'ios' or 'android'
 */
function runOnEmulator(platform) {

  gutil.log('Attempting to run on ' + platform + ' emulator');

  process.chdir(config.BUILD_DIR);
  return cdv.emulate({platforms: [platform]});
}

/**
 * Run native app on an iOS emulator.
 */
gulp.task('emulate:ios', ['build:ios'], function() {
  return runOnEmulator('ios');
});

gulp.task('emulate:android', ['build:android'], function() {
  return runOnEmulator('android');
});

/**
 * Run native app on a real iOS device attached to computer.
 */
gulp.task('run:ios', ['build:ios'], function() {
  return runOnDevice('ios');
});

gulp.task('run:android', ['build:android'], function() {
  return runOnDevice('android');
});

/**
 * Build web app and watch for changes.
 */
gulp.task('watch', ['build:web'], function () {

  gulp.watch(config.CLIENT_SRC_DIR + '/*.html', ['build:html']);
  gulp.watch([config.CLIENT_SRC_DIR + '/scripts/**/*.js', config.CLIENT_SRC_DIR + '/scripts/**/*.jsx'], ['build:babel']);
  gulp.watch(config.CLIENT_SRC_DIR + '/sass/**/*.scss', ['build:sass']);

});

/**
 * Runs our Node + Express server for testing the app in the browser, and watches for sass/js changes.
 */
gulp.task('serve', ['watch'], function () {
  var port = server.start();
  livereload.listen();
  gutil.log(gutil.colors.green('Started development server on port'), port);
});
