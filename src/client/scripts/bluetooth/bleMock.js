/**
 * If we're running outside our Cordova native wrapper, `ble` won't be available. This provides a mock instead.
 */

import {BluetoothConstants} from '../constants';

// Polyfill for ES6 Array.prototype.find()
import 'core-js/fn/array/find';

const LOG_PREFIX = 'Mock BLE: ';

const DUMMY_COLLARS = [
  {
    id: 'BLUETOOTH_ADDRESS_1',
    name: '000001',
    services: [
      '1'
    ],
    characteristics: [
      {
        'service': '1',
        'characteristic': 'A',
        'properties': [
          'Read',
          'Write'
        ]
      },
      {
        'service': '1',
        'characteristic': 'B',
        'properties': [
          'Notify'
        ]
      }
    ]
  },
  {
    id: 'BLUETOOTH_ADDRESS_2',
    name: '000002',
    services: [
      '1'
    ],
    characteristics: [
      {
        'service': '1',
        'characteristic': 'A',
        'properties': [
          'Read',
          'Write'
        ]
      },
      {
        'service': '1',
        'characteristic': 'B',
        'properties': [
          'Notify'
        ]
      }
    ]
  },
  {
    id: 'BLUETOOTH_ADDRESS_3',
    name: '000003',
    services: [
      '1'
    ],
    characteristics: [
      {
        'service': '1',
        'characteristic': 'A',
        'properties': [
          'Read',
          'Write'
        ]
      },
      {
        'service': '1',
        'characteristic': 'B',
        'properties': [
          'Notify'
        ]
      }
    ]
  },
  {
    id: 'BLUETOOTH_ADDRESS_4',
    name: '000004',
    services: [
      '1'
    ],
    characteristics: [
      {
        'service': '1',
        'characteristic': 'A',
        'properties': [
          'Read',
          'Write'
        ]
      },
      {
        'service': '1',
        'characteristic': 'B',
        'properties': [
          'Notify'
        ]
      }
    ]
  },
  {
    id: 'BLUETOOTH_ADDRESS_5',
    name: '000011',
    services: [
      '1'
    ],
    characteristics: [
      {
        'service': '1',
        'characteristic': 'A',
        'properties': [
          'Read',
          'Write'
        ]
      },
      {
        'service': '1',
        'characteristic': 'B',
        'properties': [
          'Notify'
        ]
      }
    ]
  }
];

let chosenCollarID;
let unlocked = false;

export default {

  enable(success) {
    setTimeout(function () {
      success();
    }, 100);
  },

  startScan: function(services, success) {

    console.log(LOG_PREFIX + 'Start scan');

    if( chosenCollarID ) {

      // Simulate polling for collar while unlocked, to know when it's locked again

      console.log(LOG_PREFIX + 'Unlocked and scanning for particular collar');

      setTimeout(function() {

        let collarData = DUMMY_COLLARS.find(collar => {
          return collar.id === chosenCollarID;
        });

        success(collarData);

      }, 8000);

    } else {

      // Normal collar scan

      console.log(LOG_PREFIX + 'General collar scan');

      chosenCollarID = null;

      setTimeout(function () {
        success(DUMMY_COLLARS[0]);
      }, 200);

      setTimeout(function () {
        success(DUMMY_COLLARS[1]);
      }, 250);

      setTimeout(function () {
        success(DUMMY_COLLARS[2]);
      }, 400);

      setTimeout(function () {
        success(DUMMY_COLLARS[3]);
      }, 800);


      setTimeout(function () {
        success(DUMMY_COLLARS[4]);
      }, 800);

    }

  },

  stopScan: function (success) {

    setTimeout(success, 50);

  },

  connect: function(deviceId, success) {
    console.log(LOG_PREFIX + 'Setting chosenCollarID: ' + deviceId);
    chosenCollarID = deviceId;

    let collarData = DUMMY_COLLARS.find(collar => {
      return collar.id === chosenCollarID;
    });

    setTimeout(success.bind(this, collarData), 1000);
  },

  disconnect: function(deviceId, success) {
    console.log(LOG_PREFIX + 'Setting chosenCollarID to null');
    setTimeout(success, 100);
  },

  write: function(deviceId, serviceUUID, characteristicUUID, value, success) {

    if( success ) {
      setTimeout(function () {
        success();
      }, 500);
    }

  },

  startNotification: function(deviceId, serviceUUID, characteristicUUID, success) {

    console.log(LOG_PREFIX + 'Start notification');

    setTimeout(function () {
      console.log(LOG_PREFIX + 'unlocked -> true');
      unlocked = true;
      success(); // TODO pass back data we're expecting
    }, 1000);

  },

  stopNotification: function(deviceId, serviceUUID, characteristicUUID, success) {

    setTimeout(function () {
      success();
    }, 100);

  }

};

