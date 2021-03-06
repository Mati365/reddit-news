// Called after authorized
var clientId = '';
var captureCode = false;

/**
 * Get URL parse parameters
 * @param url URL
 * @returns {Array}
 */
function parseUrlParams(url) {
  var re = /(\w*)=([^&]*)(?:$|&)/g
    , getParams = {}
    , match;

  while(match = re.exec(url))
    getParams[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  return getParams;
}

// Called after changing URL on tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Check only loading page
  if(!captureCode || changeInfo.status !== 'loading')
    return;

  // Map URL params
  var params = parseUrlParams(changeInfo.url);
  if(params.state && params.code) {
    captureCode = false;

    // Fetch data to localforage
    localStorage['oauth/' + clientId] = JSON.stringify({
      code: params.code
    });
    chrome.tabs.remove(tab.id);
  }
});

/**
 * Open page and fill form
 * @param url   Page url
 * @param form  Fields assoc
 */
/* eslint-disable */
function fillTab(url, form) {
  chrome.tabs.create({'url': url}, function(tab) {
    chrome.tabs.executeScript(tab.id, {file: 'injector.js'}, function() {
      chrome.tabs.sendMessage(tab.id, form);
    });
  });
}
/* eslint eqeqeq:0*/

// Show notifications on icon
chrome.browserAction.setBadgeBackgroundColor({color: '#FF0000'});
badgeListener(function(count) {
  chrome.browserAction.setBadgeText({text: (count || '').toString()});
});
