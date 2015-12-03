import EventEmitter from 'events';

var CHANGE_EVENT = 'change';

class Store extends EventEmitter {

  constructor() {
    super();
    this.dispatchToken = null;
  }

  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  }

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

}

export default Store;
