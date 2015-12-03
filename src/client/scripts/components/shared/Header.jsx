/*global device*/
import React from 'react';
import classnames from 'classnames';
import {t} from '../../utils/i18n';
import AppActions from '../../actions/appActions';
import AppStore from '../../stores/AppStore';

class Header extends React.Component {

  getDefaultState() {
    return {
      menuExpanded: AppStore.isMenuExpanded(),
      offline: AppStore.isOffline()
    };
  }

  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
    this._goBack = this._goBack.bind(this);
    this._toggleMenu = this._toggleMenu.bind(this);
    this._updateConnectionStatus = this._updateConnectionStatus.bind(this);
    this._listenForAppStoreChanges = this._listenForAppStoreChanges.bind(this);
  }

  // EVENT HANDLERS

  _goBack() {
    if (this.props.backLink) {
      this.context.router.transitionTo(this.props.backLink);
    } else {
      this.context.router.goBack();
    }
  }

  _toggleMenu(event) {
    event.preventDefault();
    AppActions.toggleSidebar();
  }

  _updateConnectionStatus() {
    this.setState({
      offline: AppStore.isOffline()
    });
  }

  // LISTENERS

  _listenForAppStoreChanges() {
    this.setState(this.getDefaultState());
  }

  // LIFECYCLE

  componentWillMount() {
    document.addEventListener('offline', this._updateConnectionStatus, false);
    document.addEventListener('online', this._updateConnectionStatus, false);
    AppStore.addChangeListener(this._listenForAppStoreChanges);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._listenForAppStoreChanges);
  }

  // RENDER

  _renderBackBtn() {
    if (!this.props.hideBackBtn) {
      return (
        <div className='back' onClick={this._goBack} onTouchStart={this._goBack}>
          <img src="images/icons/icon_back.svg" alt="Kiwi standing on oval" />
        </div>
      );
    }
  }

  _renderBurger() {
    if (!this.props.hideMenu) {
      let burgerClasses = classnames({
        burger: true,
        expanded: this.state.menuExpanded
      });
      return <div id='toggle-menu' className={burgerClasses} onTouchStart={this._toggleMenu} onClick={this._toggleMenu}></div>;
    }
  }

  _renderOffline() {
    if (this.state.offline) {
      return <p className='offline'>{t('General.Offline')}</p>;
    }
  }

  render() {

    let classes = classnames({
      'header': true,
      'transparent': this.props.transparent,
      'no-back-btn': this.props.hideBackBtn,
      'no-menu': this.props.hideMenu,
      'ios': typeof device !== 'undefined' && device.platform === 'iOS'
    });

    return (
      <header className={classes}>
        {this._renderBackBtn()}
        <div className='content'>{this.props.children}</div>
        {this._renderBurger()}
        {this._renderOffline()}
      </header>
    );
  }

}

Header.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Header;
