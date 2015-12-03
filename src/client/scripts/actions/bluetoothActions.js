import {ActionConstants, CollarStatus, BluetoothConstants} from '../constants';
import AppDispatcher from '../dispatchers/appDispatcher';
import {getCharacteristicsFromDeviceData, parseHexBytesToNumber, logTimestamp} from '../utils/helpers';
import BluetoothService from '../bluetooth/bluetoothService';
import BluetoothStore from '../stores/BluetoothStore';
import AccountStore from '../stores/AccountStore';

const RETRIES = 3;

let numRetriesByBluetoothAddress = {};
let actionInitiatedTimestamp;

let BluetoothActions = {

  /**
   * Scan for all collars in range.
   */
  startScan(onDiscoverDevice) {

    AppDispatcher.dispatch({
      type: ActionConstants.SCAN
    });

    /**
     * When a collar is discovered by the Bluetooth scan.
     */
    onDiscoverDevice = onDiscoverDevice || function(data) {

        console.log('Bluetooth device discovered by scan: ' + JSON.stringify(data));

        /**
         * TODO check if it's a collar and dispatch SCAN_DISCOVERED
         */

    };

    let failure = (error) => {

      console.error('Error starting BLE scan: ' + error);

      AppDispatcher.dispatch({
        type: ActionConstants.SCAN_FAIL,
        data: {
          error: error
        }
      });

    };

    BluetoothService.startCollarScan(onDiscoverDevice, failure);

  },

  /**
   * Stop scanning for collars.
   */
  stopScan(success) {

    success = success || function() {

      console.log('Stopped BLE scan');

      AppDispatcher.dispatch({
        type: ActionConstants.SCAN_SUCCESS
      });

    };

    let failure = function(error) {

      console.error('Error stopping BLE scan');

      AppDispatcher.dispatch({
        type: ActionConstants.SCAN_FAIL,
        data: error
      });

    };

    BluetoothService.stopCollarScan(success, failure);

  },

  /**
   * Pause activities i.e. collar scanning
   */
  pause() {
    this.stopCollarScan(() => {
      AppDispatcher.dispatch({
        type: ActionConstants.PAUSE_SCAN
      });
    });
  },

  /**
   * Resume activities i.e. collar scanning
   */
  resume() {
    AppDispatcher.dispatch({
      type: ActionConstants.RESUME_SCAN
    });
  },

  /**
   * Connect to the given collar.
   */
  connectToCollar(deviceBluetoothAddress, success, failure) {

    AppDispatcher.dispatch({
      type: ActionConstants.COLLR_CONNECT,
      address: deviceBluetoothAddress,
      data: {
        deviceBluetoothAddress
      }
    });

    success = success || function(data) {

        logTimestamp('Connected', actionInitiatedTimestamp);

        numRetriesByBluetoothAddress[deviceBluetoothAddress] = 0;

        AppDispatcher.dispatch({
          type: ActionConstants.COLLAR_CONNECT_SUCCESS,
          chars: getCharacteristicsFromDeviceData(data),
          address: deviceBluetoothAddress,
          data: data
        });
      };

    let defaultFailure = (error) => {

      console.log('Connection failure but this might be OK... ' + JSON.stringify(error));

      logTimestamp('Connect failed', actionInitiatedTimestamp);

      let collar = BluetoothStore.getDiscoveredCollarByBluetoothAddress(deviceBluetoothAddress);

      // Only actually an error if this happens when connecting
      // We can get this happen afterwards if we get disconnected when the
      // locker goes to sleep, but that's OK if we actually unlocked
      if (collar.state === CollarStatus.CONNECTING) {

        console.warn('Failed to connect: ' + deviceBluetoothAddress + '\n' + JSON.stringify(error));

        let retriedCount = numRetriesByBluetoothAddress[deviceBluetoothAddress] || 0;

        if (retriedCount < MAX_RETRIES - 1) {

          console.log('Retrying to connect... ' + (retriedCount + 1));

          this.backgroundConnectToCollar(deviceBluetoothAddress, success, failure);

          retriedCount++;
          numRetriesByBluetoothAddress[deviceBluetoothAddress] = retriedCount;

        } else {

          console.error('Failed ' + MAX_RETRIES + ' times to connect: ' + deviceBluetoothAddress + '\n' + JSON.stringify(error));

          AppDispatcher.dispatch({
            type: ActionConstants.COLLR_CONNECT_FAIL,
            address: deviceBluetoothAddress,
            data: {
              error: error
            }
          });

        }

      }

    };

    failure = failure || defaultFailure;

    console.log('Stop collar scan ready to connect...');

    this.stopCollarScan(() => {

      actionInitiatedTimestamp = logTimestamp('Connecting');

      BluetoothService.connectToCollar(deviceBluetoothAddress, success, failure);

    });

  },

  disconnectFromCollar(deviceBluetoothAddress, success, failure) {

    AppDispatcher.dispatch({
      type: ActionConstants.COLLR_DISCONNECT
    });

    success = success || function() {
      console.log('Disconnect success');
      AppDispatcher.dispatch({
        type: ActionConstants.COLLR_DISCONNECT_SUCCESS
      });
    };

    failure = failure || function(error) {

      console.error('Failed to disconnect');

      AppDispatcher.dispatch({
        type: ActionConstants.COLLR_DISCONNECT_FAIL,
        data: {
          error: error
        }
      });

    };

    BluetoothService.disconnectFromCollar(deviceBluetoothAddress, success, failure);

  }

};

export default BluetoothActions;
