import {setBrowserAPI} from '../../../src/api/platform';

/**
 * Show popup, reject if close, resolve if redirect
 * @param clientId  Client ID
 * @param url       OAuth address
 * @returns {Promise}
 */
function showOAuthPopup(clientId, url) {
  _.assignIn(chrome.extension.getBackgroundPage(), {
      captureCode: true
    , clientId
  });
  chrome.tabs.create({
    url
  });
}

setBrowserAPI({
  showOAuthPopup
});