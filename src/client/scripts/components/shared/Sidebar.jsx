import React from 'react';
import {t} from '../../utils/i18n';
import {Link} from 'react-router';
import AppActions from '../../actions/appActions';

class Sidebar extends React.Component {

	constructor(props) {
		super(props);
		this._logout = this._logout.bind(this);
		this._onAccountChanged = this._onAccountChanged.bind(this);
		this._onLinkClicked = this._onLinkClicked.bind(this);
	}

	// METHODS

	_onLinkClicked(event) {
		// Close sidebar
		AppActions.toggleSidebar();
	}

	// RENDER

	render() {
		return (
			<div className="sidebar">

				<Link to="/" onClick={this._onLinkClicked} className='menu-item'>
					<p>Start</p>
				</Link>

				<Link to="/collar" onClick={this._onLinkClicked} className='menu-item'>
					<p>Collar</p>
				</Link>

			</div>
		);
	}
}

Sidebar.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Sidebar;
