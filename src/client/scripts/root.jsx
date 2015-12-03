import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Router, Route} from 'react-router';
import HashHistory from 'react-router/lib/HashHistory';
import {isLoggedIn} from './utils/authentication';

// Pages
import HomePage from './components/pages/Home.jsx';
import CollrPage from './components/pages/Collr.jsx';

const history = new HashHistory();

injectTapEventPlugin();

class Root extends React.Component {

  render() {
    return (
      <Router history={history}>
        <Route name="root" path="/" component={HomePage}/>
        <Route name="collr" path="/collr" component={CollrPage}/>
      </Router>
    );
  }

}

export default Root;
