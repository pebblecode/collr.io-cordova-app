 import React from 'react';
 import classnames from 'classnames';
 import Sidebar from './Sidebar.jsx';
 import AppStore from '../../stores/AppStore';
 import AppActions from '../../actions/AppActions';

class InnerMain extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.expandedMenu === this.props.expandedMenu;
  }

  render() {
    return (
      <div className="inner-main" id='inner-main'>
        {this.props.children}
      </div>
    );
  }
}

class Main extends React.Component {

  getDefaultState() {
    return {
      menuExpanded: AppStore.isMenuExpanded()
    };
  }

  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
    this._listenForAppStoreChanges = this._listenForAppStoreChanges.bind(this);
    this._hideSidebar = this._hideSidebar.bind(this);
  }

  // METHODS

  isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  _listenForAppStoreChanges() {
    this.setState(this.getDefaultState(), () => {
      if (this.state.menuExpanded) {
        document.getElementsByClassName('inner-main')[0].addEventListener('click', this._hideSidebar, true);
      } else {
        document.getElementsByClassName('inner-main')[0].removeEventListener('click', this._hideSidebar, true);
      }
    });
  }

  _hideSidebar(event) {
    if (this.state.menuExpanded) {
      if (this.isDescendant(document.getElementById('inner-main'), event.target) && event.target.id !== 'toggle-menu') {
        event.preventDefault();
        event.stopPropagation();
        AppActions.toggleSidebar();
      }
    }
  }

  // LIFECYCLE

  componentWillMount() {
    AppStore.addChangeListener(this._listenForAppStoreChanges);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._listenForAppStoreChanges);
  }

  // RENDER

  _renderSidebar() {
    if (this.state.menuExpanded) {
      return <Sidebar />;
    }
  }

  render() {

    let cx = classnames({
      'app-main': true,
      'menu-expanded': this.state.menuExpanded
    });

    return (
      <div className={cx} onClick={this._hideSidebar}>
        <InnerMain onClick={this._hideSidebar}>
          {this.props.children}
        </InnerMain>
        {this._renderSidebar()}
      </div>
    );
  }

}

Main.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Main;
