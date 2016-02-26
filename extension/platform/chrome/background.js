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
    localStorage[clientId + '_code'] = params.code;
    chrome.tabs.remove(tab.id);
    captureCode = false;
  }
});