/**
 * It's background function, we should not link any libs because
 * the extension should be available on multiple platforms.
 *
 * @param token         Access token
 * @returns {Promise}
 */
function getNotificationsCount(token) {
  return fetch('https://oauth.reddit.com/message/unread', {
      method: 'GET'
    , headers: {
      'Authorization': `bearer ${token}`
    }
  })
    .then((response) => response.json())
    .then((response) => {
      if(response && response.data)
        return response.data.children.length;
    });
}

/**
 * Fetch new token
 * @param clientId      Client ID
 * @param refreshToken  Refresh token from local storage
 * @returns {Promise}
 */
function renewToken(clientId, refreshToken) {
  return fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST'
    , headers: {
        'Authorization': `Basic ${btoa(clientId + ':')}`
      , 'Content-Type': 'application/x-www-form-urlencoded'
    }
    , body: `grant_type=refresh_token&refresh_token=${refreshToken}`
  })
    .then((response) => response.json())
    .then((response) => [
        response['access_token']
      , response['expires_in']
    ]);
}

/**
 * Init timer to update badge
 * @param callback  Callback to platform API
 * @param time      Timeout
 */
function badgeListener(callback, time) {
  let parseOauth = (key) => {
    let promise = Promise.resolve()
      , localData = JSON.parse(localStorage[key]);

    if(Date.now() >= localData.expires) {
      renewToken(localData.clientId, localData.refreshToken)
        .then((data) => {
          localData.accessToken = data[0];
          localData.expires = Date.now() + parseInt(data[1]);

          // Write to localstorage
          localStorage[key] = JSON.stringify(localData);
        });
    }

    promise
      .then(() => {
        getNotificationsCount(localData.accessToken).then(callback);
      });
  };

  // There can be multiple API clients, we should choose the first
  // todo: Fix it
  for(var key in localStorage) {
    if(localStorage.hasOwnProperty(key) && ~key.indexOf('oauth/'))
      parseOauth(key);
  }

  // Run again after 10s delay
  setTimeout(badgeListener.bind(this, callback), time || 10000);
}
