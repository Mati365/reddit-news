// Called after authorized
var clientId = '';

// Called after changing URL on tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Check only loading page
  if(changeInfo.status !== 'loading')
    return;

  // Get URL params
  var match = changeInfo.url.match(/state=(\w*)&code=(\w*)/);
  if(match) {
    // todo: Add access_denied URL field support
    localStorage[clientId + '_code'] = match[2];
    chrome.tabs.remove(tab.id);
  }
});