import localforage from 'localforage';
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
    this.store = localforage.createInstance({
        name: 'oauth'
      , driver: localforage.LOCALSTORAGE
    });

    // Set to true after doing any request
    this._oauthRequest = null;

    // Show popup if code doesn't exist in storage
    this._storage('code').then((code) => !code && this.showPopup());
  }

  /**
   * Load storage from clientID
   * @param variable  Returns data from localStorage
   * @param newValue  Set new value to storage
   * @returns {String}
   * @private
   */
  _storage(variable, newValue) {
    if(_.isArray(variable))
      return Promise.all(_.map(variable, (el) => this._storage(el)));

    // If it has assoc of values assign them all
    let promise = this.store
      .getItem(this.clientId)
      .then((data) => data || {});

    // Check is variable assoc
    let isAssoc = _.isObject(variable);
    if(newValue || isAssoc) {
      return promise.then((data) => {
        this.store.setItem(
            this.clientId
          , _.assign(data, isAssoc ? variable : {[variable]: newValue})
        );
      });
    } else
      return promise.then((data) => data[variable]);
  }

  /**
   * Clears all data
   */
  logout() {
    this.store.clear();
  }

  /**
   * Show authorization tab and close popup
   * @returns {Promise}
   */
  showPopup() {
    this.logout();

    // Make request
    let queryParams = OAuth.serializeURL(_.assign({
        'scope': this.scope
      , 'client_id': this.clientId
    }, this.headers));

    return Platform
      // Show popup
      .showOAuthPopup(this.clientId, `${this.headers.server}/api/v1/authorize?${queryParams}`)

      // Save new code to storage
      .then((code) => this._storage('code', code));
  }

  /**
   * Create API request
   * @param path  API path
   * @param data  Form data
   * @param type  Call type
   * @returns {Promise}
   */
  api(path, data={}, type='get') {
    let requestPromise = (token) => {
      return qwest[type](`${this.headers.apiServer}/${path}`, data, {
        headers: {
          'Authorization': `bearer ${token}`
        }
      });
    };

    return this
      ._storage(['accessToken', 'expires'])
      .then(([accessToken, expires]) => {
        let promise = null;

        // If there is no access token full auth
        if(!accessToken)
          promise = this._authorize().then(requestPromise);

        // Regenerate token if older than 1 hour
        else if(Date.now() >= parseInt(expires))
          promise = this._authorize(true).then(requestPromise);

        // If success
        else
          promise = requestPromise(accessToken);

        // parse to JSON
        return promise.then((data) => JSON.parse(data.response));
      });
  }

  /**
   * Get front page JSON, it's not part of api
   * so it is in separate method
   * @param name  Front JSON path
   * @returns {Promise}
   */
  front(name='') {
    return qwest
      .get(`${this.headers.page}/${name}.json`)
      .then((data) => JSON.parse(data.response));
  }

  /**
   * Authorize to server getting access code, if access token
   * is not provided show authorization popup
   * @param refresh   Refresh token if true
   * @returns {Promise}
   */
  _authorize(refresh=false) {
    if(this._oauthRequest)
      return this._oauthRequest;

    // Authorize promise
    let requestPromise = ([code, refreshToken]) => {
      // Create form data
      let formData = {
          'grant_type': refresh ? 'refresh_token' : 'authorization_code'
        , 'redirect_uri': this.headers['redirect_uri']
        , code
      };
      if(refresh)
        formData['refresh_token'] = refreshToken;

      // Getting access token if not showing Popup
      return qwest
        .post(`${this.headers.server}/api/v1/access_token`, formData, {
          headers: {
            'Authorization': `Basic ${btoa(this.clientId + ':')}`
          }
        })
        .then((data) => [refreshToken, data]);
    };

    // Fetch local cache
    this._oauthRequest = this
      ._storage(['code', 'refreshToken'])
      .then(requestPromise)

      // Parse data
      .then(([refreshToken, data]) => {
        data = JSON.parse(data.response);
        if(data.error)
          throw data.error;

        // Cache values
        return this
          ._storage({
              accessToken: data['access_token']
            , expires: Date.now() + 30 * 60 * 1000
            , refreshToken: refresh ? refreshToken : data['refresh_token']
            , clientId: this.clientId
          })
          .then(() => {
            this._oauthRequest = null;
            return data['access_token'];
          });
      })
      // Catch errors
      .catch((error) => {
        error === 'invalid_grant' && this.showPopup();
      });

    return this._oauthRequest;
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
    , page: 'https://www.reddit.com'

    // Additional flags
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
