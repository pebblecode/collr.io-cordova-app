import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';
import AppStore from '../../stores/AppStore';
import {t} from '../../utils/i18n';

class HomePage extends React.Component {

  getDefaultState() {
    return {
    };
  }

  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  }

  // RENDER

  render() {
    return (
      <div className='page page-home'>
        <div className='page-contents'>
          <h1>Home</h1>
        </div>
        <div className='footer'>
        </div>
      </div>
    );
  }

}

HomePage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default HomePage;
