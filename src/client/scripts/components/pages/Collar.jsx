import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';
import {t} from '../../utils/i18n';
import {CollarStatus} from '../../constants';
import BluetoothActions from '../../actions/bluetoothActions';
import BluetoothStore from '../../stores/BluetoothStore';

import Header from '../shared/Header.jsx';
import Main from '../shared/Main.jsx';

class CollarPage extends React.Component {

  buildStateObj() {
    return {
      collar: BluetoothStore.getCollarById(this.props.params.collarID),
      collarBluetoothAddress: BluetoothStore.getDeviceBluetoothAddress(this.props.params.collarID),
      collarStatus: BluetoothStore.getCollarStatus(this.props.params.collarID)
    };
  }

  constructor(props) {
    super(props);
    this.state = this.buildStateObj();
    this._onBluetoothChange = this._onBluetoothChange.bind(this);
    this._retry = this._retry.bind(this);
  }

  // METHODS

  _getStatusClass() {
    switch (this.state.collarStatus) {
      case CollarStatus.CONNECTING:
        return 'accessing';
      case CollarStatus.CONNECTED:
        return 'unlocked';
      case CollarStatus.ERROR:
        return 'error';
      default:
        console.warn('something went wrong', this.state);
    }
  }

  _collarClasses() {
    return classnames({
      'page': true,
      'page-collar': true,
      [this._getStatusClass()]: true
    });
  }

  _isConnected() {
    return this.state.collarStatus === CollarStatus.CONNECTED;
  }

  // EVENT HANDLERS

  _retry(event) {
    event.preventDefault();
    BluetoothActions.connectToCollar(this.state.collarBluetoothAddress);
  }

  // STORE LISTENERS

  _onBluetoothChange() {
    this.setState(this.buildStateObj());
  }

  // LIFECYCLE

  componentWillMount() {
    BluetoothStore.addChangeListener(this._onBluetoothChange);
    if (!this._isConnected()) {
      BluetoothActions.connectToCollar(this.state.collarBluetoothAddress);
    }
  }

  componentWillUnmount() {
    BluetoothStore.removeChangeListener(this._onBluetoothChange);
  }

  // RENDER

  _renderHeader() {
    if (this._isConnected() ) {
      return <h3>{this.state.collar.name}</h3>;
    }
  }

  _renderTitle() {
    switch (this.state.collarStatus) {
      case CollarStatus.CONNECTING:
        return 'Connecting';
      case CollarStatus.CONNECTED:
        return 'Connected';
      case CollarStatus.ERROR:
        return 'Error';
      default:
        return console.warn('Unexpected status:' + this.state.status);
    }
  }

  _renderFooter() {
    return <div className='footer'></div>;
  }

  render() {

    return (
      <Main>
        <div className={this._collarClasses()}>
          <Header backLink='/'>{this._renderTitle()}</Header>
          <div className='page-contents'>
            <div className='collar-wrapper'>
              <div className='flex-1'>
                {this._renderHeader()}
              </div>
              <div className='flex-2'>
                {this.state.collar} {this.state.collarStatus}
              </div>
              <div className='flex-3'>
                <h4>{this._renderTitle()}</h4>
              </div>
            </div>
          </div>
          {this._renderFooter()}
        </div>
      </Main>
    );
  }
}

CollarPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default CollarPage;
