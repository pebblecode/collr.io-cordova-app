/*global Connection*/
import BaseStore from './BaseStore';
import {ActionConstants} from '../constants';
import {isCordova} from '../utils/helpers';
import AppDispatcher from '../dispatchers/appDispatcher';

window.Connection = window.Connection || {};

class AppStore extends BaseStore {

  constructor() {
    super();
    this.sidebarExpanded = false;
  }

  resume() {
    this.background = false;
  }

  inBackground() {
    return this.background;
  }

  isOffline() {
    switch (navigator.connection.type) {
      case Connection.ETHERNET:
      case Connection.WIFI:
      case Connection.CELL_2G:
      case Connection.CELL_3G:
      case Connection.CELL_4G:
      case Connection.CELL:
        return false;
      default:
        return true;
    }
  }

  wifiConnection() {
    return navigator.connection.type === Connection.WIFI;
  }

  apiHost() {
    return isCordova() ? API_HOST : API_HOST_MOCK;
  }

  authHost() {
    return isCordova() ? AUTH_HOST : AUTH_HOST_MOCK;
  }

  isMenuExpanded() {
    return this.sidebarExpanded;
  }

}

let appStore = new AppStore();

appStore.dispatchToken = AppDispatcher.register((action) => {

  switch (action.type) {

    case ActionConstants.PAUSE_SCAN:
      appStore.background = true;
      break;

    case ActionConstants.RESUME_SCAN:
      appStore.background = false;
      break;

  }

});

export default appStore;
