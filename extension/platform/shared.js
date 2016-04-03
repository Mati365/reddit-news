/**
 * It's background function, we should not link any libs because
 * the extension should be available on multiple platforms.
 *
 * @param token     Access token
 * @param callback  Callback after downlad
 */
function getNotificationsCount(token, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://oauth.reddit.com/message/unread', true);
  xhr.setRequestHeader('Authorization', 'bearer ' + btoa(token));
  xhr.onload = function () {
    var r = JSON.parse(this.responseText);
    r.data && callback(r.data.children.length);
  };
  xhr.send();
}

/**
 * Init timer to update badge
 * @param callback  Callback to platform API
 * @param time      Timeout
 */
function badgeListener(callback, time) {
  // There can be multiple API clients, we should choose the first
  // todo: Fix it
  for(var key in localStorage) {
    // If found access token
    if(localStorage.hasOwnProperty(key) && ~key.indexOf('oauth/')) {
      // store client lib store data in json
      var token = JSON.parse(localStorage[key]).accessToken;
      getNotificationsCount(token, callback);
      break;
    }
  }

  // Run again after 10s delay
  setTimeout(badgeListener.bind(this, callback), time || 10000);
}
