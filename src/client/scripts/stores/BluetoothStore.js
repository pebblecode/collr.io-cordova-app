import BaseStore from './BaseStore';
import {ActionConstants, BluetoothStatus, CollarStatus, BluetoothConstants} from '../constants';
import AppDispatcher from '../dispatchers/appDispatcher';
import BluetoothActions from '../actions/bluetoothActions';

class BluetoothStore extends BaseStore {

  constructor() {
    super();
    this.connectionStatus = BluetoothStatus.IDLE;
    this.discoveredCollars = {}; // all the collars discovered while scanning
  }

  _updateCollar(collarID, collarData, state) {
    this.discoveredCollars[collarID] = collarData;
    this.discoveredCollars[collarID].state = state || this.getCollarStatus(collarID) || CollarStatus.UNKNOWN;
    this.discoveredCollars[collarID].updatedAt = Date.now();
  }

  _updateCollarByBluetoothDeviceAddress(deviceBluetoothAddress, collarData, state) {
    for (let k in this.discoveredCollars) {
      if (this.discoveredCollars[k].id === deviceBluetoothAddress) {
        return this._updateCollar(k, collarData, state);
      }
    }
  }

  _updateCollarState(collarID, state) {
    if (!this.discoveredCollars[collarID]) {
      this.discoveredCollars[collarID] = {};
    }
    this.discoveredCollars[collarID].state = state || this.getCollarStatus(collarID) || CollarStatus.UNKNOWN;
    this.discoveredCollars[collarID].updatedAt = Date.now();
  }

  _updateCollarStateByBluetoothDeviceAddress(deviceBluetoothAddress, state, characteristics) {
    for (let k in this.discoveredCollars) {
      if (this.discoveredCollars[k].id === deviceBluetoothAddress) {
        if (characteristics) {
          this.discoveredCollars[k].characteristics = characteristics;
        }
        return this._updateCollarState(k, state);
      }
    }
  }

  getConnectionStatus() {
    return this.connectionStatus;
  }

  getDiscoveredCollarByBluetoothAddress(deviceBluetoothAddress) {
    for (let k in this.discoveredCollars) {
      let collar = this.discoveredCollars[k];
      if (collar.id === deviceBluetoothAddress) {
        return collar;
      }
    }
  }

  getCollarIDByBluetoothAddress(deviceBluetoothAddress) {
    for (let k in this.discoveredCollars) {
      let collar = this.discoveredCollars[k];
      if (collar.id === deviceBluetoothAddress) {
        return k;
      }
    }
  }

  getCollarById(collarID) {
    return this.discoveredCollars[collarID];
  }

  getCollarStatus(collarID) {
    return (this.discoveredCollars[collarID]) ? JSON.parse(JSON.stringify(this.discoveredCollars[collarID])).state : CollarStatus.UNKNOWN;
  }

  getDiscoveredCollars() {
    return this.discoveredCollars;
  }

  /**
   * @param collarID Collar ID that matches to API
   */
  getDeviceBluetoothAddress(collarID) {
    let collarData = this.discoveredCollars[collarID];
    return collarData ? collarData.id : null;
  }

  isScanningForCollars() {
    return this.connectionStatus === BluetoothStatus.SCANNING;
  }

}

let bluetoothStore = new BluetoothStore();


bluetoothStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.type) {

    case ActionConstants.PAUSE_SCAN:
      bluetoothStore.connectionStatus = BluetoothStatus.PAUSED;
      break;

    case ActionConstants.RESUME_SCAN:
      bluetoothStore.connectionStatus = BluetoothStatus.IDLE;
      break;

    // SCANNING

    case ActionConstants.SCAN:
      // set the bluetooth connection to scanning
      bluetoothStore.connectionStatus = BluetoothStatus.SCANNING;
      bluetoothStore.emitChange();
      break;

    case ActionConstants.SCAN_DISCOVERED:
      //bluetoothStore._updateCollar(action.data.collarID, action.data, CollarStatus.UNKNOWN, true);
      bluetoothStore.emitChange();
      break;

    case ActionConstants.SCAN_SUCCESS:
      // once the scan is completed, we can return the bluetooth to an idle state
      bluetoothStore.connectionStatus = BluetoothStatus.IDLE;
      bluetoothStore.emitChange();
      break;

    case ActionConstants.SCAN_FAIL:
      // if the scan errors, set bluetooth to an error state
      bluetoothStore.connectionStatus = BluetoothStatus.ERROR;
      bluetoothStore.emitChange();
      break;


    // CONNECTING

    case ActionConstants.COLLR_CONNECT:
      // we are attempting to connect to a collar
      bluetoothStore._updateCollarStateByBluetoothDeviceAddress(action.address, CollarStatus.CONNECTING);
      bluetoothStore.connectionStatus = BluetoothStatus.CONNECTING;
      bluetoothStore.emitChange();
      break;

    case ActionConstants.COLLR_CONNECT_SUCCESS:
      // successfully connected to the collar
      bluetoothStore._updateCollarByBluetoothDeviceAddress(action.address, action.data, CollarStatus.CONNECTED);
      bluetoothStore.connectionStatus = BluetoothStatus.CONNECTED;
      bluetoothStore.emitChange();
      break;

    case ActionConstants.COLLR_CONNECT_FAIL:
      // failed to connect to the collar
      bluetoothStore._updateCollarStateByBluetoothDeviceAddress(action.address, CollarStatus.ERROR);
      bluetoothStore.connectionStatus = BluetoothStatus.ERROR;
      bluetoothStore.emitChange();
      break;


    // DISCONNECTING

    case ActionConstants.COLLR_DISCONNECT:
      // attempting to disconnect from the collar
      bluetoothStore.connectionStatus = BluetoothStatus.DISCONNECTING;
      bluetoothStore.emitChange();
      break;

    case ActionConstants.COLLR_DISCONNECT_SUCCESS:
      // disconnected from the collar
      bluetoothStore.connectionStatus = BluetoothStatus.IDLE;
      bluetoothStore.emitChange();
      break;

    case ActionConstants.COLLR_DISCONNECT_FAIL:
      // failed to disconnect from the collar (silently)
      bluetoothStore.emitChange();
      break;

  }

});

export default bluetoothStore;
