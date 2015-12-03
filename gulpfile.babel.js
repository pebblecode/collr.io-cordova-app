/**
 * Based on kamrik's Cordova Gulp Template: https://github.com/kamrik/CordovaGulpTemplate
 * License: https://github.com/kamrik/CordovaGulpTemplate/blob/master/LICENSE
 */

import gulp from 'gulp';
import gutil from 'gulp-util';
import requireDir from 'require-dir';

requireDir('./src/tasks');

gulp.task('default', ['serve'], function () {
  gutil.log('Running development server by default. Check gulpfile for other tasks.');
});
