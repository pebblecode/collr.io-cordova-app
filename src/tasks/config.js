/**
 * Shared config for gulp tasks.
 */

/**
 * Cordova plugins.
 * Plugins aren't stored in package.json right now because they only recently shifted to publishing them in NPM,
 * and most of them aren't moved yet. We could revisit this later though...
 *
 * See: https://cordova.apache.org/announcements/2015/04/21/plugins-release-and-move-to-npm.html
 */
const Config = {

  /**
   * Plugins are referenced via node_modules if we can install via NPM, otherwise reference our forks via GitHub.
   * Be careful if you reference a GitHub repo that's not under our control, since it could change without us knowing,
   * unless we specify a particular tag - see:
   * https://cordova.apache.org/docs/en/5.0.0/guide_cli_index.md.html#The%20Command-Line%20Interface_add_plugin_features
   */
  CORDOVA_PLUGINS: [
    '../node_modules/cordova-plugin-console',
    '../node_modules/cordova-plugin-file',
    '../node_modules/cordova-plugin-geolocation',
    '../node_modules/cordova-plugin-network-information',
    '../node_modules/cordova-plugin-whitelist',
    '../node_modules/cordova-plugin-device',
    '../node_modules/cordova-plugin-statusbar',
    '../node_modules/cordova-plugin-media',
    'https://github.com/pebblecode/cordova-plugin-background-fetch.git',
    'https://github.com/pebblecode/cordova-plugin-ble-central.git',
    'https://github.com/pebblecode/bgs-core.git',
    'https://github.com/pebblecode/cordova-plugin-globalization.git',
    'https://github.com/pebblecode/phonegap-plugin-barcodescanner.git'
  ],

  // If we want to add other platforms (eg. Windows), we'll need to add appropriate directories here and reference below
  CORDOVA_PLATFORM_DIR_IOS: process.cwd() + '/node_modules/cordova-ios',
  CORDOVA_PLATFORM_DIR_ANDROID: process.cwd() + '/node_modules/cordova-android',

  BUILD_DIR: process.cwd() + '/build',
  BUILD_WEB_DIR: process.cwd() + '/build/www',
  CLIENT_SRC_DIR: process.cwd() + '/src/client',

  // These values will be replaced when the release task is called
  iOSCodeSigningIdentity: 'Please provide the Signing Identity via the gulp release command',
  iOSProvisioningProfileUUID: 'Please provide the Provisioning Profile UUID via the gulp release command'

};

Config.CORDOVA_PLATFORM_DIRS = [
  Config.CORDOVA_PLATFORM_DIR_IOS,
  Config.CORDOVA_PLATFORM_DIR_ANDROID
];

export default Config;
