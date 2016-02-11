import qwest from 'qwest';
import _ from 'lodash';

import Platform from './platform';

/**
 * Simple oauth client for reddit
 * @class
 */
class OAuth {
  /**
   * @param headers   Basic authorize headers
   * @param clientId  Client ID
   * @param scope     Grants array
   */
  constructor(headers, clientId, scope) {
    this.headers = headers;
    this.clientId = clientId;
    this.scope = scope.join(',');

    if(!this._storage('code'))
      this.showPopup();
  }

  /**
   * Load storage from clientID
   * @param variable  Returns data from localStorage
   * @param newValue  Set new value to storage
   * @returns {String}
   * @private
   */
  _storage(variable, newValue) {
    if(_.isObject(variable)) {
      _.each(variable, (val, key) => this._storage(key, val));
      return this;

    } else {
      let key = this.clientId + '_' + variable;
      if(!newValue)
        return localStorage[key];
      else {
        localStorage[key] = newValue;
        return this;
      }
    }
  }

  /**
   * Show authorization tab and close popup
   */
  showPopup() {
    let queryParams = OAuth.serializeURL(_.assign({
        'scope': this.scope
      , 'client_id': this.clientId
    }, this.headers));

    localStorage.clear();
    Platform
      // Show popup
      .showOAuthPopup(this.clientId, `${this.headers.server}/api/v1/authorize?${queryParams}`)

      // Save new code to storage
      .then(code => this._storage('code', code));
  }

  /**
   * Create API request
   * @param path  API path
   * @param data  Form data
   * @returns {Promise}
   */
  api(path, data={}) {
    let request = () => {
      return qwest.get(`${this.headers.apiServer}/${path}`, data, {
        headers: {
          'Authorization': `bearer ${this._storage('accessToken')}`
        }
      });
    };

    let promise = null;

    // Authorize before API call
    if(!this._storage('accessToken'))
      promise = this._authorize().then(request);

    // Regenerate token if older than 1 hour
    else if(Date.now() >= parseInt(this._storage('expires')))
      promise = this._authorize(true).then(request);

    // Parse response
    else
      promise = request();

    // parse to JSON
    return promise.then(data => JSON.parse(data.response));
  }

  /**
   * Authorize to server getting access code
   * @param refresh   Refresh token if true
   * @returns {Promise}
   */
  _authorize(refresh=false) {
    let formData = {
        'grant_type': refresh
          ? 'refresh_token'
          : 'authorization_code'

      , 'redirect_uri': this.headers['redirect_uri']
      , 'code': this._storage('code')
    };
    if(refresh)
      formData['refresh_token'] = this._storage('refreshToken');

    return qwest
      .post(`${this.headers.server}/api/v1/access_token`, formData, {
        headers: {
          'Authorization': `Basic ${btoa(this.clientId + ':')}`
        }
      })
      .then(data => {
        data = JSON.parse(data.response);
        if(data.error)
          throw data.error;

        this
          ._storage({
              accessToken: data['access_token']
            , expires: Date.now() + parseInt(data['expires_in']) * 1000
            , refreshToken: refresh
              ? this._storage('refreshToken')
              : data['refresh_token']
          });
      })
      .catch(error => {
        error === 'invalid_grant' && this.showPopup();
      });
  }

  /**
   * Converts assoc array to URL
   * @param assoc   Assoc array
   * @param prefix  Name before array, only for arrays
   * @returns URL params
   */
  static serializeURL(assoc, prefix='') {
    return _.reduce(assoc, (sum, obj, index) => {
      index = encodeURIComponent(index);
      let key = prefix ? `${prefix}[${index}]` : index;

      return sum
        + (sum.length ? '&' : '')
        + (_.isArray(obj) ? OAuth.serializeURL(obj, index) : (key + '=' + encodeURIComponent(obj)));
    }, '');
  }
}

/** Form headers for pages */
OAuth.Headers = {
  'reddit' : {
    server: 'https://ssl.reddit.com'
  , apiServer: 'https://oauth.reddit.com'

  , 'response_type': 'code'
  , 'duration': 'permanent'
  , 'state':  Math.random().toString(36).slice(2)
  , 'redirect_uri': 'https://reddit.com/reddit-news'
  }
};

/**
 * Create OAuth client
 * @param page      Page from OAuth.headers list
 * @param clientId  Client ID
 * @param scope     Grants
 * @returns {OAuth}
 */
OAuth.createClient = function(page, clientId, scope) {
  return new OAuth(OAuth.Headers[page], clientId, scope);
};

export default OAuth;