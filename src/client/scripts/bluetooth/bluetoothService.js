import {BluetoothConstants} from '../constants';
import {parseDigitsToArray, formatNumberAs4HexBytes} from '../utils/helpers';

class BluetoothService {

  /**
   * Dependency injection - `ble` could be the Cordova version or the mock version.
   */
  init(ble, device) {

    this.ble = ble;
    this.device = device;

    this.enableBLE();

  }

  /**
   * This only works on Android - prompt to enable Bluetooth if not already enabled.
   * See: https://github.com/don/cordova-plugin-ble-central/#enable
   */
  enableBLE() {

    console.log('Device platform: ' + this.device.platform);

    // To save an error in the logs on iOS
    if( this.device.platform === 'Android' ) {

      let success = () => {
        console.log('BLE enabled');
      };

      let failure = () => {
        console.warn('BLE *not* enabled');
      };

      this.ble.enable(success, failure);

    }
  }

  startCollarScan(deviceDiscoveredCallback, failure) {

    this.ble.startScan([], deviceDiscoveredCallback, failure);

  }

  stopCollarScan(success, failure) {

    this.ble.stopScan(success, failure);

  }

  connectToCollar(deviceBluetoothAddress, success, failure) {

    console.log('Connect to collar with address: ' + deviceBluetoothAddress);

    this.ble.connect(deviceBluetoothAddress, success, failure);

  }

  disconnectFromCollar(deviceBluetoothAddress, success, failure) {

    this.ble.disconnect(deviceBluetoothAddress, success, failure);

  }

  isConnectedToCollar(deviceBluetoothAddress, success, failure) {

    this.ble.isConnected(deviceBluetoothAddress, success, failure);

  }

  registerNotifications(deviceBluetoothAddress, characteristic, success, failure) {

    console.log('startNotification: ' + deviceBluetoothAddress + '\n' + JSON.stringify(characteristic));

    this.ble.startNotification(deviceBluetoothAddress, characteristic.service, characteristic.characteristic, success, failure);

  }

  unregisterNotifications(deviceBluetoothAddress, characteristic, success, failure) {

    console.log('stopNotification: ' + deviceBluetoothAddress + '\n' + JSON.stringify(characteristic));

    this.ble.stopNotification(deviceBluetoothAddress, characteristic.service, characteristic.characteristic, success, failure);

  }

}

export default new BluetoothService();
