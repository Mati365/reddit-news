import {setBrowserAPI} from '../../../src/api/platform';

/**
 * Open tab
 * @param url Tab URL
 */
function openTab(url) {
  chrome.tabs.create({
    url
  });
}

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
  openTab(url);
}

setBrowserAPI({
    showOAuthPopup
  , openTab
});