/**
 * RELEASE TASKS
 */

import config from './config';
import pkg from '../../package.json';
import gulp from 'gulp';
import gutil from 'gulp-util';
import bump from 'gulp-bump';
import semver from 'semver';
import runSequence from 'run-sequence';
import xmlEditor from 'gulp-xml-editor';
import {argv} from 'yargs';
import cordovaLib from 'cordova-lib';

let cdv = cordovaLib.cordova.raw;

// PREPARE RELEASE

/**
 * @param bumpType: major|minor|patch|prerelease
 * @param cb callback
 */
function bumpVersion(bumpType, cb) {

  var newVer = semver.inc(pkg.version, bumpType);

  // Set new version number in package.json
  gulp.src(process.cwd() + '/package.json')
    .pipe(bump({version: newVer}))
    .pipe(gulp.dest(process.cwd()))
    .on('end', function() {

      // Also set new version number in Cordova config.xml
      gulp.src(process.cwd() + '/src/config.xml')
        .pipe(xmlEditor([
          {path: '//xmlns:widget', attr: {'version': newVer}}
        ], 'http://www.w3.org/ns/widgets'))
        .pipe(gulp.dest(process.cwd() + '/src'))
        .on('end', function() {

          gutil.log('Updated config.xml version number to:', newVer);

          if( cb ) {
            cb();
          }
        });
    });

}

gulp.task('prepare-release:patch', function (cb) {
  bumpVersion('patch', cb);
});

gulp.task('prepare-release:minor', function (cb) {
  bumpVersion('minor', cb);
});

gulp.task('prepare-release:major', function (cb) {
  bumpVersion('major', cb);
});

// RELEASE

/**
 * Copy over release-signing.properties from project root to Android build directory.
 * This allows the APK to be signed without any password prompt.
 * release-signing.properties is not checked into source control to protect the password for the keystore.
 * It should exist on the Jenkins server and Jenkins should copy into the project root before doing `gulp release`.
 */
gulp.task('build:cordova:release:android:copy-properties', function() {
  return gulp.src(__dirname+'/../../release-signing.properties')
    .pipe(gulp.dest(__dirname + '/../../build/platforms/android'));
});

/**
 * Cordova build for Android.
 */
gulp.task('build:cordova:release:android:cdv', function() {
  process.chdir(config.BUILD_DIR);
  return cdv.build({options: ['--release'], platforms: ['android']});
});

/**
 * Build Android release - copy release properties and perform Cordova build.
 */
gulp.task('build:cordova:release:android', function(cb) {
  runSequence('build:cordova:release:android:copy-properties', 'build:cordova:release:android:cdv', cb);
});

/**
 * Build iOS release.
 */
gulp.task('build:cordova:release:ios', function() {

  console.log('Code signing identity:', config.iOSCodeSigningIdentity);
  console.log('Provisioning profile UUID:', config.iOSProvisioningProfileUUID);

  process.chdir(config.BUILD_DIR);

  return cdv.build({options: [
    '--release',
    '--device',
    '--codeSignIdentity=' + config.iOSCodeSigningIdentity,
    '--provisioningProfile=' + config.iOSProvisioningProfileUUID
  ], platforms: ['ios']});

});

/**
 * Release Android only.
 */
gulp.task('release:android', function(cb) {
  runSequence('build:clean', 'build:web', 'build:cordova:release:android', cb);
});

/**
 * Release iOS only.
 *
 * Usage: gulp release:ios --signing-identity="[Code Signing Identity]" --provisioning-profile="[Profile UUID]"
 */
gulp.task('release:ios', function(cb) {

  if (!argv.signingIdentity || !argv.provisioningProfile) {

    gutil.log(gutil.colors.red('Usage: gulp release:ios --signing-identity="[Code Signing Identity]" --provisioning-profile="[Profile UUID]"'));

  } else {

    config.iOSCodeSigningIdentity = argv.signingIdentity;
    config.iOSProvisioningProfileUUID = argv.provisioningProfile;

    runSequence('build:clean', 'build:web', 'build:cordova:release:ios', cb);
  }

});

/**
 * Generate clean release builds for both iOS and Android.
 * This task is called by Jenkins server to build the releases.
 *
 * Usage: gulp release --signing-identity="[Code Signing Identity]" --provisioning-profile="[Profile UUID]"
 */
gulp.task('release', function(cb) {

  if (!argv.signingIdentity || !argv.provisioningProfile) {

    gutil.log(gutil.colors.red('Usage: gulp release --signing-identity="[Code Signing Identity]" --provisioning-profile="[Profile UUID]"'));

  } else {

    config.iOSCodeSigningIdentity = argv.signingIdentity;
    config.iOSProvisioningProfileUUID = argv.provisioningProfile;

    runSequence('build:clean', 'build:web', 'build:cordova:release:ios', 'build:cordova:release:android', cb);
  }

});
