import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';
import {isUsernameValid, passwordValid} from '../../utils/validation';
import {signIn} from '../../utils/client';
import AccountActions from '../../actions/accountActions';
import AccountStore from '../../stores/AccountStore';
import AppStore from '../../stores/AppStore';
import {t} from '../../utils/i18n';

// tmp test for login bounce
let cacheLoaded = false;
class LoginPage extends React.Component {

  getDefaultState() {
    return {
      isValid: false,
      requestProcessing: false,
      username: '',
      password: '',
      usernameValid: false,
      usernameDirty: false, // dirty is true when the user blurs the field
      passwordValid: false,
      passwordDirty: false,
      // -
      offline: AppStore.isOffline(),
      serverError: false
    };
  }

  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
    this._onSubmit = this._onSubmit.bind(this);
    this._validateUsername = this._validateUsername.bind(this);
    this._validatePassword = this._validatePassword.bind(this);
    this.__authenticateSuccess = this.__authenticateSuccess.bind(this);
    this.__authenticateFail = this.__authenticateFail.bind(this);
    this._onAccountChanged = this._onAccountChanged.bind(this);
    this._onAppChanged = this._onAppChanged.bind(this);
  }

  // METHODS

  _loginFormClasses() {
    return classnames({
      'disabled': !this._isValid(),
      'login-form': true
    });
  }

  _usernameClasses() {
    return (!this.state.usernameValid && this.state.usernameDirty) ? 'invalid' : null;
  }

  _passwordClasses() {
    return (!this.state.passwordValid && this.state.passwordDirty) ? 'invalid' : null;
  }

  _isValid() {
    return !this.state.requestProcessing && (this.state.usernameValid && this.state.passwordValid) && !this.state.offline;
  }

  __authenticateSuccess(data) {
    if (data.ErrorMessage || data.error) {
      return this.__authenticateFail(data);
    }
    AccountActions.authenticate(data);

    // Now fetch user info

    let userInfoFail = (error) => {
      this.__authenticateFail(error);
    };

    AccountActions.getUserInfo(null, userInfoFail);
  }

  __authenticateFail() {
    this.setState({
      serverError: true,
      requestProcessing: false
    });
  }

  // EVENT HANDLERS

  _validateUsername(event) {
    this.setState({
      username: event.target.value.trim(),
      usernameValid: isUsernameValid(event.target.value.trim()),
      usernameDirty: this.state.usernameDirty || event.type === 'blur'
    });
  }

  _validatePassword(event) {
    this.setState({
      password: event.target.value.trim(),
      passwordValid: passwordValid(event.target.value.trim()),
      passwordDirty: this.state.passwordDirty || event.type === 'blur'
    });
  }

  _onSubmit() {
    if (this._isValid()) {
      this.setState({
        serverError: false,
        requestProcessing: true
      }, () => {
        signIn(this.state.username, this.state.password, this.__authenticateSuccess, this.__authenticateFail);
      });
    }
  }

  // STORE LISTENERES

  _onAccountChanged() {
    this.setState({
      loggedIn: AccountStore.isLoggedIn(),
      userInfo: AccountStore.getUserInfo()
    }, () => {
      if (this.state.loggedIn && this.state.userInfo && this.state.userInfo.user_id ) {
        this.context.router.transitionTo('/locations');
      }
    });
  }

  _onAppChanged() {
    this.setState({
      offline: AppStore.isOffline()
    });
  }

  // LIFECYCLE

  componentWillMount() {
    AccountStore.addChangeListener(this._onAccountChanged);
    document.addEventListener('offline', this._onAppChanged);
    document.addEventListener('online', this._onAppChanged);
    if (!cacheLoaded) {
      AccountActions.getUserCache();
    }
    cacheLoaded = true;
  }

  componentWillUnmount() {
    AccountStore.removeChangeListener(this._onAccountChanged);
    document.removeEventListener('offline', this._onAppChanged);
    document.removeEventListener('online', this._onAppChanged);
  }

  // RENDER

  _renderButton() {
    if (this.state.requestProcessing) {
      return <span className='loading-spinner'> Loading </span>;
    }
    return <button className='login-button' onClick={this._onSubmit}>{t('LoginPage.Title')}</button>;
  }

  _renderError() {
    if (this.state.offline) {
      return <p className='server-error'>{t('LoginPage.Offline')}</p>;
    }
    if (this.state.serverError) {
      return <p className='server-error'>{t('LoginPage.ServerError')}</p>;
    }
  }

  render() {
    return (
      <div className='page page-login'>
        <div className='page-contents'>
          <div className={this._loginFormClasses()}>
            <h1>{t('LoginPage.Title')}</h1>
            {this._renderError()}
            <form>
              <input autoCorrect='off' autoCapitalize='none' type='text' tabIndex='1' className={this._usernameClasses()} onChange={this._validateUsername} onBlur={this._validateUsername} placeholder={t('Forms.UsernamePlaceholder')} />
              <input type='password' tabIndex='2' className={this._passwordClasses()} onChange={this._validatePassword} onBlur={this._validatePassword} placeholder={t('Forms.PasswordPlaceholder')} />
            </form>
            {this._renderButton()}
            <Link to='/passwordReset' className='forgot-password'>{t('LoginPage.ForgotPassword')}</Link>
          </div>
        </div>
        <div className='footer'>
          <Link to='/verify' className='button login-button'>{t('LoginPage.NewUser')}</Link>
        </div>
      </div>
    );
  }

}

LoginPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default LoginPage;
