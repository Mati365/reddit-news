import _ from 'lodash';

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

/**
 * Download tab info
 * @returns {Promise}
 */
function getTabInfo() {
  return new Promise((resolve) => {
    chrome.windows.getCurrent(function(w) {
      chrome.tabs.getSelected(w.id, function (response) {
        resolve(_.pick(response, 'title', 'url'));
      });
    });
  });
}

/**
 * Set badge text
 * @param text  Text in badge
 */
function setBadgeText(text) {
  chrome.browserAction.setBadgeText({text});
}

setBrowserAPI({
    showOAuthPopup
  , openTab
  , getTabInfo
  , setBadgeText
  
  // Open tab and fill with data
  , fillTab() {
    let background = chrome.extension.getBackgroundPage();
    background.fillTab.apply(background, arguments);
  }
});