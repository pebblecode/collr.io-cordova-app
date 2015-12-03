/*global ble, device, atatus*/

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root.jsx';
import BluetoothService from './bluetooth/bluetoothService';
import BluetoothActions from './actions/BluetoothActions';
import {setLanguage} from './utils/i18n';
import {isCordova} from './utils/helpers';


// promise polyfil
let Promise = require('es6-promise').Promise;
if (!window.Promise) {
  window.Promise = Promise;
}

/**
 * When ready...
 */
function init() {

  console.log('Device ready. Initialising...');

  // Initialize the localization
  if (isCordova() && navigator.globalization) {
    navigator.globalization.getPreferredLanguage(setLanguage);
  }

  // Dependency injection - real `ble` and `device`, or mocks

  if( isCordova() ) {
    BluetoothService.init(ble, device);
  } else {
    // Switch bleMock to bleMockBuggy to test with the deliberately error-prone version!
    BluetoothService.init( require('./bluetooth/bleMock').default, {platform: 'Mock'} );
  }

  // Configure the syncing processes
  sync.init(isCordova());
  // Render the app
  ReactDOM.render(<Root/>, document.getElementById('app'));
}

document.addEventListener('deviceready', init);
document.addEventListener('pause', () => {
  BluetoothActions.pause();
});
document.addEventListener('resume', () => {
  BluetoothActions.resume();
});
/**
 * If inside Cordova app, we get a 'deviceready' event, otherwise just fire init ourselves.
 */
if( !isCordova() ) {
	// stub out the connection for browsers
	window.navigator.connection = window.navigator.connection || {};
  init();
}
